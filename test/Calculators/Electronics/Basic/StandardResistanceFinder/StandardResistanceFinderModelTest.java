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
        //System.out.println("Setting desiredResistance.setRawVal().");
        standardResistanceFinderModel.desiredResistance.setRawVal(10.1);
        //System.out.println("Value = " + standardResistanceFinderModel.eSeries.getRawVal());
        // Set E-series
        //standardResistanceFinderModel.eSeries.setRawVal("E12");
        assertEquals(10.0, standardResistanceFinderModel.e6Resistance.getRawVal(), 0.0);
    }

    @Test
    public void e96SeriesTest246k() {
        standardResistanceFinderModel.desiredResistance.setRawVal(246);
        System.out.println("Calling eSeries.setRawVal()...");
        //standardResistanceFinderModel.eSeries.setRawVal("E96");
        //
        //assertEquals(249, standardResistanceFinderModel.e6Resistance.getRawVal(), 0.01);
    }

}