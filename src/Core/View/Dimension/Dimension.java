package Core.View.Dimension;

import java.io.IOException;

import javafx.beans.property.DoubleProperty;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.layout.Pane;
import javafx.util.Callback;

/***
 * This is the model for the dimension UI object.
 */
public class Dimension extends Pane {

    private Node view;
    private DimensionController controller;

    public Dimension() {
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("Dimension.fxml"));
        fxmlLoader.setControllerFactory(new Callback<Class<?>, Object>() {
            @Override
            public Object call(Class<?> param) {
                return controller = new DimensionController();
            }
        });
        try {
            view = (Node) fxmlLoader.load();

        } catch (IOException ex) {
        }
        getChildren().add(view);
    }

    public void setLength(Double length) {
        controller.length = length;
        controller.recalculateDimensions();
    }

    public Double getLength() {
        return controller.length;
    }

    public DoubleProperty lengthProperty() {
        return controller.mainLine.endXProperty();
    }

    public Double getArrowSize() {
        return controller.arrowSize;
    }

    public void setArrowSize(Double arrowSize) {
        controller.arrowSize = arrowSize;
        controller.recalculateDimensions();
    }

    public Double getLineThickness() {
        return controller.lineThickness;
    }

    public void setLineThickness(Double lineThickness) {
        controller.lineThickness = lineThickness;
        controller.mainLine.setStrokeWidth(lineThickness);
        controller.leftTopArrowLine.setStrokeWidth(lineThickness);
        controller.leftBotArrowLine.setStrokeWidth(lineThickness);
        controller.rightTopArrowLine.setStrokeWidth(lineThickness);
        controller.rightBotArrowLine.setStrokeWidth(lineThickness);
    }
}