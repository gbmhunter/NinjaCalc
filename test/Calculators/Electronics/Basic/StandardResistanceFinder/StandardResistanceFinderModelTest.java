package Calculators.Electronics.Basic.StandardResistanceFinder;

import Utility.StandardResistanceFinder;
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
        // given:
        //rightClickOn("#desktop").moveTo("New").clickOn("Text Document");
        //write("myTextfile.txt").push(ENTER);

        // when:
        //drag(".file").dropTo("#trash-can");

        // then:
        //verifyThat("#desktop", hasChildren(0, ".file"));
        //verifyThat("#desktop", hasChildren(0, ".file"));
        //System.out.println("Setting desiredResistance.setRawVal().");
        standardResistanceFinderModel.desiredResistance.setRawVal(10.1);
        //System.out.println("Value = " + standardResistanceFinderModel.eSeries.getRawVal());

        // Set E-series
        standardResistanceFinderModel.eSeries.setRawVal("E12");


        assertEquals(10.0, standardResistanceFinderModel.actualResistance.getRawVal(), 0.0);
    }

    @Test
    public void e96SeriesTest246k() {
        standardResistanceFinderModel.desiredResistance.setRawVal(246);
        standardResistanceFinderModel.eSeries.setRawVal("E96");
        assertEquals(243, standardResistanceFinderModel.actualResistance.getRawVal(), 0.0);
    }

}