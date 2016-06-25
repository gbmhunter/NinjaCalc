package Core.CalcVar;

import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.junit.Test;
import org.testfx.framework.junit.ApplicationTest;

/**
 * Unit tests for the CalcVarTest class.
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (mbedded.ninja)
 * @since           2016-06-25
 * @last-modified   2016-06-25
 */
public class CalcVarTextTest extends ApplicationTest {

    @Override
    public void start(Stage stage) {
        //standardResistanceFinderCalcModel =  new StandardResistanceFinderCalcModel();
        //Scene scene = new Scene(standardResistanceFinderCalcModel.view, 800, 600);
        //stage.setScene(scene);
        //stage.show();
    }

    @Test
    public void constructorWorksTest() {
        CalcVarText calcVarText = new CalcVarText();
        // If we get here, constructor worked
        assert(true);
    }

    @Test
    public void canAttachTextFieldTest() {
        CalcVarText calcVarText = new CalcVarText();
        calcVarText.setTextField(new TextField());
        assert(true);
    }

}
