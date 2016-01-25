package MainWindow;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.layout.*;

import CalculatorGridElement.CalculatorGridElementController;

public class Controller {

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private GridPane calcGridOverlay;

    @FXML
    private TilePane calculatorGridTilePane;

    public void handleButtonOnAction(ActionEvent actionEvent) {
        //Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "blah");
        //alert.showAndWait();

        // Show the calculator grid overlay
        calcGridOverlay.setVisible(true);

        CalculatorGridElementController gridElement = new CalculatorGridElementController();
        calculatorGridTilePane.getChildren().add(gridElement);

    }

    /*private Pane getOverlay() {
        StackPane p = new StackPane();
        Rectangle r = RectangleBuilder.create()
                .height(100).width(100)
                .arcHeight(40).arcWidth(40)
                .stroke(Color.RED)
                .fill(Color.web("red", 0.1))
                .build();

        Text txt= TextBuilder.create().text("Overlay")
                .font(Font.font("Arial", FontWeight.BOLD, 18))
                .fill(Color.BLUE)
                .build();
        p.getChildren().addAll(r, txt);
        return p;
    }*/
}
