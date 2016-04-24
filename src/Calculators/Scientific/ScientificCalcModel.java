package Calculators.Scientific;

// SYSTEM LIBRARIES
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

import java.io.IOException;
import java.io.InputStreamReader;

// Libraries for running javascript
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

// USER LIBRARIES
import Core.Calculator;


import org.matheclipse.core.basic.Config;
import org.matheclipse.core.eval.EvalEngine;
import org.matheclipse.core.eval.ExprEvaluator;
import org.matheclipse.core.interfaces.IAST;
import org.matheclipse.core.interfaces.IExpr;
import org.matheclipse.parser.client.SyntaxError;
import org.matheclipse.parser.client.math.MathException;

/**
 * A general purpose scientific calculator for doing day-to-day calculations. Uses expression parsing to calculate
 * the result of a mathematic formula entered as a string.
 *
 * This calculator is quite different to most other calculators.
 *
 * Possible Expression Parsers:
 * Uses a javascript library, math.js, to parse mathematical expressions that the user inputs.
 * SpEL (Spring Expression Langauge)
 * symja, Java 8 version (https://bitbucket.org/axelclk/symja_android_library/wiki/Home)
 *
 * @author          gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since           2016-04-09
 * @last-modified   2016-04-12
 */
public class ScientificCalcModel extends Calculator{

    @FXML private ScrollPane expressionsScrollPane;

    @FXML private VBox expressionsVBox;

    @FXML private TextField expressionInput;


    EvalEngine engine;
    private ExprEvaluator exprEvaluator;

    // The following variables get assigned in
    // loadJavascript().
    ScriptEngineManager scriptEngineManager;
    ScriptEngine scriptEngine;
    Invocable inv;
    Object mathJsObj;
    Object mathJsParserObj;

    public ScientificCalcModel() {

        super("Scientific Calculator",
                "A generic scientific calculator for doing basic mathematical calculations.",
                new String[]{"Scientific"},
                new String[]{"scientific", "generic", "general", "mathematics", "maths", "calculations", "equations", "addition", "subtraction", "multiply", "multiplication", "divide", "division", "variables", "functions", "trigonometry", "expressions"});

        super.setIconImagePath(getClass().getResource("grid-icon.jpg"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("ScientificCalcView.fxml"));
        //fxmlLoader.setRoot(this.view);
        fxmlLoader.setController(this);
        try {
            // Create a UI node from the FXML file, and save it to the view variable.
            // This will be used by the main window to create a new instance of this calculator when
            // the "Open" button is clicked.
            this.view = fxmlLoader.load();
        } catch (IllegalStateException e) {
            System.err.println("IllegalStateException occurred, is the fxml path valid?");
            throw e;
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        //===============================================================================================//
        //============================== LOAD CALCULATOR-SPECIFIC STYLING ===============================//
        //===============================================================================================//

        // Grab .css file and convert contents to string
        String css = getClass().getResource("style.css").toExternalForm();
        // Add this css data to this calculator node
        this.view.getStylesheets().add(css);

        //===============================================================================================//
        //====================================== INSTALL EVENT HANDLERS =================================//
        //===============================================================================================//

        // Setup listener for text area
        this.expressionInput.setOnKeyPressed((event) -> {
            //System.out.println("setOnKeyPressed(). called.");

            if(event.getCode() == KeyCode.ENTER) {
                //System.out.println("Enter key pressed.");
                this.parseExpression();
            }
        });

        // This makes the VBox holding all the expressions results INITIALLY be the same height as the scroll pane,
        // which makes new results appear at the bottom of the window (as desired). When there are too many
        // results, this VBox expands past the height of the scroll pane, causing the scroll bars to appear.
        this.expressionsVBox.prefHeightProperty().bind(this.expressionsScrollPane.heightProperty());

        // This listener forces the scroll pane to always scroll to the bottom when a new expression result
        // is added (so the user can see the result
        this.expressionsVBox.heightProperty().addListener((observable, oldvalue, newValue) -> {
                this.expressionsScrollPane.setVvalue((Double)newValue );
        });

        Config.PARSER_USE_LOWERCASE_SYMBOLS = true;

        this.engine = new EvalEngine(true);
        this.exprEvaluator = new ExprEvaluator(
                this.engine,
                false, // Outlist disabled?
                100);  // History capacity


    }

    /**
     * Loading the javascript was removed from the constructor because it takes many
     * seconds to complete and causes the UI to lag. Lazily initialised by parseExpression().
     */
    /*private void loadJavascript() {
        scriptEngineManager = new ScriptEngineManager();
        scriptEngine = scriptEngineManager.getEngineByName("JavaScript");
        if (!(scriptEngine instanceof Invocable)) {
            throw new RuntimeException("Invoking methods is not supported.");
        }
        this.inv = (Invocable) scriptEngine;
        //String scriptPath = getClass().getResource("math.min.js").getPath();

        try {
            // This next line of code takes many seconds to execute
            // Make sure to use getResourceAsStream, otherwise the loading the javascript may work when loading
            // from IntelliJ, but NOT when deployed.
            // e.g. DO NOT USE scriptEngine.eval("load('" + scriptPath + "')");
            scriptEngine.eval(new InputStreamReader(getClass().getResourceAsStream("math.min.js")));
        } catch (Exception e) {
            //System.err.println(e.toString());
            throw new RuntimeException(e.toString());
        }

        this.mathJsObj = scriptEngine.get("math");

        // Get a math.js parser object (a parser object remembers variable/function
        // history)
        try {
            this.mathJsParserObj = inv.invokeMethod(mathJsObj, "parser");
        } catch (Exception e) {
            //System.err.println(e.toString());
            throw new RuntimeException(e.toString());
        }
    }*/

    /**
     * Grabs the user-entered expression from the GUI, parses it, and displays the result.
     */
    private void parseExpression() {

        System.out.println("parseExpression() called.");

        // Lazily initialise the javascript engine if this is the first time
        // parseExpression has been called
        /*if(this.mathJsObj == null) {
            this.loadJavascript();
        }*/


        // Grab the expression input text and store in local variable
        String expressionInputString = this.expressionInput.getText();

        System.out.println("***TextArea text = ***");
        System.out.print(expressionInputString);
        System.out.println("***End of TextArea text***");

        String expressionResult = "";
        //Expression expression = new Expression(expressionInputString);
        /*try {
            BigDecimal result = expression.eval();
            expressionResult = result.toString();
        } catch(RuntimeException e) {
            expressionResult = "ERROR: " + e.getMessage();
        }*/

        /*try {
            Object evalResult = inv.invokeMethod(mathJsParserObj, "eval", expressionInputString);
            System.out.println(evalResult.toString());
            expressionResult = evalResult.toString();
        } catch (ScriptException e) {
            // ScriptExceptions usually occur if there is an unrecognised
            // variable in the expression (or the syntax is just bad)
            System.err.println(e.toString());

            // We want to set the expression result to an error message. We
            // don't want to include the java.lang.RunTimeException... bit,
            // so just get the message part of the exception
            // Calling e.getCause().getMessage() provides a short error useful for displaying
            // to the user, without the filepath.
            expressionResult = e.getCause().getMessage();
        } catch (NoSuchMethodException e) {
            // This is a bad error! We shouldn't get this, as we know the
            // math.eval() function exists.
            System.err.println(e.toString());
            throw new RuntimeException(e.toString());
        }*/


        //expressionResult = new Expression(expressionInputString).eval().toPlainString();

        try {
            IExpr result = exprEvaluator.evaluate(expressionInputString);
            expressionResult = result.toString();
        }
        catch (SyntaxError e) {
            // catch Symja parser errors here
            System.out.println(e.getMessage());
        } catch (MathException me) {
            // catch Symja math errors here
            System.out.println(me.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }


        System.out.println("expressionResult = " + expressionResult);

        // Display the result of the expression to the user
        this.addExpressionResultToUI(expressionInputString, expressionResult);

        // Now we have added the result of the expression to the GUI, clear the
        // input for user to enter the next expression
        this.expressionInput.clear();

    }

    /***
     * Adds the provided result of an expression to the correct place in the VBox
     * which holds all the the expression history. Also shows what the user input in the first place
     * to get the result.
     */
    private void addExpressionResultToUI(String expressionInput, String expressionResult) {

        // Create a new UI object to display to the user
        TextArea textArea = new TextArea();

        // We also use a Text object so we can size each text area to the minimum height required to display
        // it's text contents
        Text textHolder = new Text();

        textArea.setMinHeight(20);

        // We don't want the user to be able to edit the previous expression displays
        textArea.setEditable(false);


        textHolder.textProperty().bind(textArea.textProperty());
        textHolder.layoutBoundsProperty().addListener((observable, oldValue, newValue) -> {
            //if (oldHeight != newValue.getHeight()) {
                System.out.println("newValue = " + newValue.getHeight());
                //oldHeight = newValue.getHeight();

                // Min height must be set here, otherwise scroll pane won't work correctly when there are too many
                // expression results to display in the viewport.
                textArea.setMinHeight(textHolder.getLayoutBounds().getHeight() + 40); // +40 is for paddings
                textArea.setMaxHeight(textHolder.getLayoutBounds().getHeight() + 40); // +40 is for paddings
            //}
        });

        // The text MUST be set after the text properties have been bound AND the listener has been added to the textHolder
        String textToDisplay = expressionInput + "\n\t" + expressionResult;
        textArea.setText(textToDisplay);

        //ScrollBar scrollBarv = (ScrollBar)textArea.lookup(".scroll-bar:vertical");
        //if(scrollBarv != null)
        //    scrollBarv.setDisable(true);

        /*TextAreaSkin textAreaSkin = (TextAreaSkin) textArea.getSkin();
        ScrollPane textAreaScrollPane = (ScrollPane) textAreaSkin.getChildren().get(0);
        textAreaScrollPane.setVbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);*/

        ObservableList<Node> vBoxChildren = this.expressionsVBox.getChildren();

        //Integer numVBoxChildren = vBoxChildren.size();

        // Insert new UI object as second to last object (last object being the text area
        // to enter new expressions into
        //vBoxChildren.add(numVBoxChildren - 1, textArea);
        vBoxChildren.add(textArea);

        //this.expressionsScrollPane.setVvalue(Double.MAX_VALUE);

        //ScrollBar scrollBarv = (ScrollBar)textArea.lookup(".scroll-bar:vertical");
        //if(scrollBarv != null)
        //scrollBarv.setDisable(true);

    }


}
