
package Calculators.Software.Crc;

// SYSTEM INCLUDES

import Core.*;
import Core.CalcVar.CalcVarBase;
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
        crcDataCalcVar.addValueChangedListener((CalcVarBase calcVarBase) -> {
            calculateAll();
        });
        crcDataCalcVar.setHelpText("Input the data you wish to calculate the CRC for here.");
        addCalcVar(crcDataCalcVar);

        //===============================================================================================//
        //================================= CRC DATA INPUT TYPE (input) =================================//
        //===============================================================================================//

        calcVarRadioButtonGroup.setName("calcVarRadioButtonGroup");
        calcVarRadioButtonGroup.addRadioButton(asciiUnicode);
        calcVarRadioButtonGroup.addRadioButton(hex);
        calcVarRadioButtonGroup.setValue(asciiUnicode);
        calcVarRadioButtonGroup.addValueChangedListener((CalcVarBase calcVarBase) -> {
            calculateAll();
        });
        addCalcVar(calcVarRadioButtonGroup);

        //===============================================================================================//
        //====================================== CRC VALUE (output) =====================================//
        //===============================================================================================//

        crcResultCalcVar.setName("crcResultCalcVar");
        crcResultCalcVar.setTextField(crc16CcittValue);
        crcResultCalcVar.setDirectionFunction(() -> { return CalcVarDirections.Output; });
        crcResultCalcVar.setHelpText("The CRC result using the CRC-16-CCITT algorithm.");
        addCalcVar(crcResultCalcVar);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

    public void calculateAll() {

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

            // Note: i gets incremented each time by 2
            for (int i = 0; i < crcDataString.length(); i += 2) {

                String hexByte;
                // Special case if string length is odd, for the last value we
                // have to extract just one character
                if(crcDataString.length() - i == 1) {
                    hexByte = crcDataString.substring(i, i + 1);
                } else {
                    // Extract 2-character strings from the CRC data
                    hexByte = crcDataString.substring(i, i + 2);
                }

                try {
                    Integer integerValueOfHex = Integer.parseInt(hexByte, 16);
                    buffer.add(integerValueOfHex);

                } catch(NumberFormatException e) {
                    // We will get here if the input data is not valid hex, e.g. it has
                    // characters after f in the input
                    crcDataCalcVar.validationResults.add(
                            new CalcValidationResult(
                                    CalcValidationLevels.Error,
                                    "Input data is not valid. If in \"Hex\"mode, data must contain only the numerals 0-9 and the characters A-F. Do not add \"0x\"to the start of the hex number."));
                    crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Error;
                    crcDataCalcVar.updateUIBasedOnValidationResults();

                    return;

                }
            }
        }

        Integer crcResult = Crc16XModem.CalcFast(buffer);

        // Convert to hex for display
        String crcResultAsHex = "0x" + String.format("%04X", crcResult);

        crcResultCalcVar.setValue(crcResultAsHex);

        // If we make it to here, everything was o.k.
        crcDataCalcVar.validationResults.clear();
        crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
        crcDataCalcVar.updateUIBasedOnValidationResults();

        crcResultCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
        crcResultCalcVar.updateUIBasedOnValidationResults();

        //return crcResultAsHex;

    }

}

