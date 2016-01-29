package CalculatorGridElement;/**
 * Created by gbmhunter on 2016-01-25.
 */

import java.io.IOException;
import java.util.logging.Logger;

import Core.IOpenCalcListener;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;

/**
 *
 */
public class CalculatorGridElementController extends GridPane {

    private static final Logger logger = Logger.getLogger(CalculatorGridElementController.class.getName());



    @FXML
    private ImageView calculatorIcon;

    @FXML
    private Label labelCalculatorName;

    @FXML
    private Label calculatorDescription;

    IOpenCalcListener openCalcListener;

    String calculatorName;

    public CalculatorGridElementController(
            String gridIconImageUrl,
            String calculatorName,
            String calculatorDescription,
            IOpenCalcListener openCalcListener) {
        super();

        // The first thing we need to is load the FXML file
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("CalculatorGridElementView.fxml"));
        fxmlLoader.setRoot(this);
        fxmlLoader.setController(this);
        try {
            fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        // Now FXML file is loaded, we should be able to access UI elements

        // ICON

        calculatorIcon.setImage(new Image(gridIconImageUrl));

        // NAME
        labelCalculatorName.setText(calculatorName);
        this.calculatorName = calculatorName;

        // DESCRIPTION
        this.calculatorDescription.setText(calculatorDescription);

        this.openCalcListener = openCalcListener;
    }

    /**
     * Event handler for the "Open" button
     * @param event
     */
    public void btnOpenOnAction(ActionEvent event) {

        //lblHello.setText("CalculatorGridElementController");
        this.openCalcListener.execute(this.calculatorName);
    }
}
