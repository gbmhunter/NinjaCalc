package Calculators.Scientific;

import Core.Calculator;
import com.udojava.evalex.Expression;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.TextArea;
import javafx.scene.input.KeyCode;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.math.BigDecimal;

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


        Expression expression = new Expression("2+2");
        BigDecimal result = expression.eval();
        this.calculatorTextArea.setText(result.toString());

        // Setup listener for text area
        calculatorTextArea.textProperty().addListener((observable, oldValue, newValue) -> {
            System.out.println("TextField Text Changed (newValue: " + newValue + ")");
        });

        /*calculatorTextArea.setOnKeyTyped((event) -> {
            System.out.println("setOnKeyTyped() called with event = " + event.toString());
        });*/

        calculatorTextArea.setOnKeyPressed((event) -> {
            System.out.println("setOnKeyPressed(). called.");

            if(event.getCode() == KeyCode.ENTER) {
                System.out.println("Enter key pressed.");
                this.processLastLineInCalculatorTextArea();
            }

        });

    }

    private void processLastLineInCalculatorTextArea() {

        System.out.println("processLastLineInCalculatorTextArea() called.");

        // We need to extract the last line of text from the text area.
        String calculatorText = this.calculatorTextArea.getText();

        System.out.println("***TextArea text = ***");
        System.out.print(calculatorText);
        System.out.println("***End of TextArea text***");

        // Search backwards from end of string and find first enter character
        Integer indexOfLastEnterChar = calculatorText.lastIndexOf("\n");

        System.out.println("indexOfLastEnterChar = " + indexOfLastEnterChar);

        if(indexOfLastEnterChar > 0) {
            // Extract last line, excluding the newline character that was found
            String lastLine = calculatorText.substring(indexOfLastEnterChar + 1);
            System.out.println("lastLine = \"" + lastLine + "\".");

            Expression expression = new Expression(lastLine);
            BigDecimal result = expression.eval();
            System.out.println("Result of expression = " + result.toString());
            //this.calculatorTextArea.setText(result.toString());
        }

    }
}
