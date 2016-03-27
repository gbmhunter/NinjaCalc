package Calculators.Electronics.Basic.StandardResistanceFinder;

import javafx.scene.Scene;
import javafx.stage.Stage;
import org.junit.Test;
import org.testfx.framework.junit.ApplicationTest;

import static org.junit.Assert.*;

public class StandardResistanceFinderModelTest extends ApplicationTest {

    StandardResistanceFinderModel standardResistanceFinderModel;

    @Override
    public void start(Stage stage) {
        standardResistanceFinderModel =  new StandardResistanceFinderModel();
        Scene scene = new Scene(standardResistanceFinderModel.view, 800, 600);
        stage.setScene(scene);
        stage.show();
    }

    @Test
    public void e12SeriesTest10k0() {
        standardResistanceFinderModel.desiredResistance.setRawVal(10.1);
        assertEquals("10", standardResistanceFinderModel.e12Resistance.getDispValAsString());
        assertEquals("0.99", standardResistanceFinderModel.e12Error.getDispValAsString());
    }

    @Test
    public void e96SeriesTest246k() {
        standardResistanceFinderModel.desiredResistance.setRawVal(246);
        assertEquals("249", standardResistanceFinderModel.e96Resistance.getDispValAsString());
        assertEquals("1.22", standardResistanceFinderModel.e96Error.getDispValAsString());
    }

}