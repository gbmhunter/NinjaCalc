package Calculators.Scientific;

import Core.Calculator;
import com.udojava.evalex.Expression;
import javafx.beans.binding.Bindings;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Bounds;
import javafx.scene.Node;
import javafx.scene.control.TextArea;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.concurrent.Callable;

class JavaBridge {
    public void log(String text) {
        System.out.println(text);
    }
}

/**
 * Created by gbmhunter on 2016-04-09.
 */
public class ScientificCalcModel extends Calculator{

    @FXML
    private WebView calculatorWebView;

    @FXML private VBox expressionsVBox;

    @FXML private TextArea calculatorTextArea;

    public ScientificCalcModel() {

        super("Scientific Calculator",
                "A generic scientific calculator for doing basic calculations.",
                new String[]{"Scientific"},
                new String[]{"scientific, generic, general, mathematics, calculations, equations"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

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
        //================================ LOAD WEB VIEW FOR INFO SECTION ===============================//
        //===============================================================================================//

        /*WebEngine webEngine = this.calculatorWebView.getEngine();

        webEngine.documentProperty().addListener(new ChangeListener<Document>() {
            @Override public void changed(ObservableValue<? extends Document> prop, Document oldDoc, Document newDoc) {
                enableFirebug(webEngine);
            }
        });

        final String htmlFile= "calculatorWebView.html";
        URL url = getClass().getResource(htmlFile);
        webEngine.load(url.toExternalForm());

        this.calculatorTextArea.setText("Testing...");

        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");
        // read script file
        try {
            URL fileUrl = getClass().getResource("math.js");
            engine.eval(Files.newBufferedReader(Paths.get(fileUrl.toURI()),StandardCharsets.UTF_8));

        } catch (IOException e) {
            System.err.println("Could not read javascript file.");
        } catch (URISyntaxException e) {
            System.err.println("Could not read javascript file.");
        } catch (ScriptException e) {
            System.err.println("Javascript error occurred while parsing script.");
        }
        Invocable inv = (Invocable) engine;
        // call function from script file
        try {
            inv.invokeFunction("math.eval", "2+2");
        } catch (ScriptException e) {
            System.err.println("Javascript error occurred while trying to invoke function.");
        } catch (NoSuchMethodException e) {
            System.err.println("Desired javascript method does not exist.");
        }*/


        // Setup listener for text area
        calculatorTextArea.setOnKeyPressed((event) -> {
            //System.out.println("setOnKeyPressed(). called.");

            if(event.getCode() == KeyCode.ENTER) {
                //System.out.println("Enter key pressed.");
                this.parseExpression();
            }

        });

    }

    private void parseExpression() {

        System.out.println("parseExpression() called.");

        // We need to extract the last line of text from the text area.
        String calculatorText = this.calculatorTextArea.getText();

        System.out.println("***TextArea text = ***");
        System.out.print(calculatorText);
        System.out.println("***End of TextArea text***");



        Expression expression = new Expression(calculatorText);
        BigDecimal result = expression.eval();
        System.out.println("Result of expression = " + result.toString());
            //this.calculatorTextArea.setText(result.toString());

        this.addNewResultToUI(result.toString());

        // Now clear the text
        calculatorTextArea.clear();

    }

    /***
     * Adds the provided result of an expression (a UI object) to the correct place in the VBox
     * which holds all the the expression history.
     */
    private void addNewResultToUI(String expressionResult) {

        // Create a new UI object to display to the user
        TextArea textArea = new TextArea();
        Text textHolder = new Text();

        textArea.setMinHeight(20);

        textHolder.textProperty().bind(textArea.textProperty());

        textHolder.layoutBoundsProperty().addListener((observable, oldValue, newValue) -> {
            //if (oldHeight != newValue.getHeight()) {
                System.out.println("newValue = " + newValue.getHeight());
                //oldHeight = newValue.getHeight();
                textArea.setPrefHeight(textHolder.getLayoutBounds().getHeight() + 20); // +20 is for paddings
            //}
        });

        // The text MUST be set after the text properties have been bound AND the listener has been added to the textHolder
        textArea.setText(expressionResult);

        ObservableList<Node> vBoxChildren = this.expressionsVBox.getChildren();

        Integer numVBoxChildren = vBoxChildren.size();

        // Insert new UI object as second to last object (last object being the text area
        // to enter new expressions into
        vBoxChildren.add(numVBoxChildren - 1, textArea);
    }


}
