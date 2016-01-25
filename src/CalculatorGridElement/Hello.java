package CalculatorGridElement;/**
 * Created by gbmhunter on 2016-01-25.
 */

import java.io.IOException;
import java.util.logging.Logger;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;

/**
 *
 * @author Vladislav Korecký
 */
public class Hello extends BorderPane {

    private static final Logger logger = Logger.getLogger(Hello.class.getName());
    @FXML
    private Label lblHello;

    public Hello() {
        super();
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("Hello.fxml"));
        fxmlLoader.setRoot(this);
        fxmlLoader.setController(this);
        try {
            fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }
    }

    // Handler for Button[id="btnHello"] onAction
    public void btnHelloOnAction(ActionEvent event) {
        lblHello.setText("Hello");
    }
}
