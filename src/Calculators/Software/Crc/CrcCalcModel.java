
package Calculators.Software.Crc;

// SYSTEM INCLUDES

import Core.*;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.RadioButtonGroup.CalcVarRadioButtonGroup;
import Core.CalcVar.Text.CalcVarText;
import Utility.Crc.Crc16XModem;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

// USER INCLUDES

/**
 * CRC calculator.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified   2016-06-25
 * @since           2016-06-15
 */
public class CrcCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//



    @FXML
    private TextField crcDataTextField;

    @FXML
    private RadioButton asciiUnicode;

    @FXML
    private RadioButton hex;

    @FXML
    private TextField crc16CcittValue;

    @FXML
    private WebView infoWebView;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarText crcDataCalcVar = new CalcVarText();
    public CalcVarRadioButtonGroup calcVarRadioButtonGroup = new CalcVarRadioButtonGroup();

    public CalcVarText crcResultCalcVar = new CalcVarText();

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public CrcCalcModel() {

        super("CRC Values",
                "Calculate various CRC values from provided data.",
                new String[]{"Software"},
                new String[]{"crc"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));


        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("CrcCalcView.fxml"));
        //fxmlLoader.setRoot(this.view);
        fxmlLoader.setController(this);
        try {
            // Create a UI node from the FXML file, and save it to the view variable.
            // This will be used by the main window to create a new instance of this calculator when
            // the "Open" button is clicked.
            this.view = fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        //===============================================================================================//
        //================================ LOAD WEB VIEW FOR INFO SECTION ===============================//
        //===============================================================================================//

        WebEngine engine = this.infoWebView.getEngine();
        final String htmlFile = "info.html";
        URL url = getClass().getResource(htmlFile);
        engine.load(url.toExternalForm());

        //===============================================================================================//
        //====================================== CRC DATA (input) =======================================//
        //===============================================================================================//

        crcDataCalcVar.setName("crcDataCalcVar");
        crcDataCalcVar.setTextField(crcDataTextField);
        crcDataCalcVar.setDirectionFunction(() -> { return CalcVarDirections.Input; });
        addCalcVar(crcDataCalcVar);

        //===============================================================================================//
        //================================= CRC DATA INPUT TYPE (input) =================================//
        //===============================================================================================//

        calcVarRadioButtonGroup.setName("calcVarRadioButtonGroup");
        calcVarRadioButtonGroup.addRadioButton(asciiUnicode);
        calcVarRadioButtonGroup.addRadioButton(hex);
        calcVarRadioButtonGroup.setValue(asciiUnicode);
        addCalcVar(calcVarRadioButtonGroup);

        //===============================================================================================//
        //====================================== CRC VALUE (output) =====================================//
        //===============================================================================================//

        crcResultCalcVar.setName("crcResultCalcVar");
        crcResultCalcVar.setTextField(crc16CcittValue);
        crcResultCalcVar.setDirectionFunction(() -> { return CalcVarDirections.Output; });
        crcResultCalcVar.setEquationFunction(() -> {
            String crcDataString = crcDataCalcVar.getValue();
            Toggle inputDataType = calcVarRadioButtonGroup.getValue();

            // Convert this string into a list of integers
            List<Integer> buffer = new ArrayList<>();

            if(inputDataType == asciiUnicode) {
                for (int i = 0; i < crcDataString.length(); i++) {
                    char currentChar = crcDataString.charAt(i);

                    // Convert the character into it's equivalent Unicode integer
                    // Note: Since Unicode is a complete superset of ASCII, this will
                    // work for ASCII characters to
                    buffer.add((int) currentChar);
                }
            } else if(inputDataType == hex) {

            }

            Integer crcResult = Crc16XModem.CalcFast(buffer);

            // Convert to hex for display
            String crcResultAsHex = "0x" + Integer.toHexString(crcResult);

            return crcResultAsHex;
        });
        addCalcVar(crcResultCalcVar);

//        this.voltage.setName("voltage");
//        this.voltage.setTextField(this.voltageValueTextField);
//        this.voltage.setEquationFunction((IEquationFunction & Serializable)() -> {
//            // Read dependency variables
//            Double current = this.current.getRawVal();
//            Double resistance = this.resistance.getRawVal();
//            return current * resistance;
//        });
//        this.voltage.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
//        });
//        this.voltage.setNumDigitsToRound(4);
//        this.voltage.setDirectionFunction(() -> {
//            if (voltageRadioButton.isSelected()) return CalcVarDirections.Output;
//            else return CalcVarDirections.Input;
//        });
//        this.voltage.setDefaultRawValue(null);
//        this.voltage.setHelpText("The voltage across the resistor.");
//        this.voltage.setIsEngineeringNotationEnabled(true);
//
//        //====================== VALIDATORS ===================//
//        this.voltage.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.voltage.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        addCalcVar(this.voltage);



        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

