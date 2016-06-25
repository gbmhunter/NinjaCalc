package Core.CalcVar;

import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.junit.Test;
import org.testfx.framework.junit.ApplicationTest;

import static org.junit.Assert.assertEquals;

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
    public void textFieldUpdatesCalculatorVariableValueTest() {

        CalcVarText calcVarText = new CalcVarText();

        // Create a new TextField (JavaFX UI object)
        TextField textField = new TextField();

        // Attach the TextField to the calculator variable
        calcVarText.setTextField(textField);

        textField.setText("Testing");

        // Make sure the "value" of the calculator variable got updated to be the
        // same text as the TextField
        assertEquals("Testing", calcVarText.getValue());

    }

}
