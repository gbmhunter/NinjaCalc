package Calculators.Scientific;

import Core.Calculator;
import com.udojava.evalex.Expression;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.control.TextArea;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebEvent;
import javafx.scene.web.WebView;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.events.Event;
import org.w3c.dom.events.EventListener;
import org.w3c.dom.events.EventTarget;
import org.w3c.dom.html.HTMLAnchorElement;

import java.awt.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import netscape.javascript.JSObject;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import static java.nio.charset.StandardCharsets.UTF_8;

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

        calculatorTextArea.setOnKeyTyped((event) -> {
            System.out.println("setOnKeyTyped");
        });

    }
}
