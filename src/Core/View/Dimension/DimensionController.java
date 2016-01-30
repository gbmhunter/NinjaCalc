package Core.View.Dimension;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextField;
import javafx.scene.shape.Line;

/**
 * Controller for the Dimension UI object.
 *
 * @author gbmhunter
 * @since 2015-11-02
 */
public class DimensionController implements Initializable {

    @FXML
    Line mainLine;

    @FXML
    Line leftTopArrowLine;

    @FXML
    Line leftBotArrowLine;

    @FXML
    Line rightTopArrowLine;

    @FXML
    Line rightBotArrowLine;

    double length;
    double arrowSize;
    double lineThickness;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        //textField.setText("Just click the button!");
    }

    public void recalculateDimensions() {

        //===== MAIN LINE =====//
        mainLine.setStartX(0);
        mainLine.setStartY(0);

        mainLine.setEndX(length);
        mainLine.setEndY(0);

        //===== LEFT TOP ARROW SEGMENT =====//

        leftTopArrowLine.setStartX(0);
        leftTopArrowLine.setStartY(0);

        leftTopArrowLine.setEndX(arrowSize);
        leftTopArrowLine.setEndY(-arrowSize);

        //===== LEFT BOT ARROW SEGMENT =====//

        leftBotArrowLine.setStartX(0);
        leftBotArrowLine.setStartY(0);

        leftBotArrowLine.setEndX(arrowSize);
        leftBotArrowLine.setEndY(arrowSize);

        //===== RIGHT TOP ARROW SEGMENT =====//

        rightTopArrowLine.setStartX(length);
        rightTopArrowLine.setStartY(0);

        rightTopArrowLine.setEndX(length - arrowSize);
        rightTopArrowLine.setEndY(-arrowSize);

        //===== RIGHT BOT ARROW SEGMENT =====//

        rightBotArrowLine.setStartX(length);
        rightBotArrowLine.setStartY(0);

        rightBotArrowLine.setEndX(length - arrowSize);
        rightBotArrowLine.setEndY(arrowSize);
    }
}