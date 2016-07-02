
package Calculators.Software.Crc;

// SYSTEM INCLUDES

import Core.CalcValidationLevels;
import Core.CalcValidationResult;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.ComboBox.CalcVarComboBox;
import Core.CalcVar.Generic.CalcVarGeneric;
import Core.CalcVar.RadioButtonGroup.CalcVarRadioButtonGroup;
import Core.CalcVar.Text.CalcVarText;
import Core.Calculator;
import Utility.Crc.Crc16XModem;
import Utility.Crc.CrcAlgorithmParameters;
import Utility.Crc.CrcCatalogue;
import Utility.Crc.CrcGeneric;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.util.Callback;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.zip.CRC32;

// USER INCLUDES

/**
 * CRC calculator. Calculates CRC values for input data using a range of popular CRC algorithms.
 *
 * @author gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified 2016-06-25
 * @since 2016-06-15
 */
public class CrcCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML
    @SuppressWarnings("unused")
    private TextField crcDataTextField;

    @FXML
    @SuppressWarnings("unused")
    private RadioButton asciiUnicode;

    @FXML
    @SuppressWarnings("unused")
    private RadioButton hex;

    @FXML
    @SuppressWarnings("unused")
    private GridPane crcValuesGridPane;

    @FXML
    @SuppressWarnings("unused")
    private TextField crc16XmodemTextField;

    @FXML
    @SuppressWarnings("unused")
    private TextField crc32TextField;

    @FXML
    @SuppressWarnings("unused")
    private WebView infoWebView;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarText crcDataCalcVar = new CalcVarText();
    public CalcVarRadioButtonGroup calcVarRadioButtonGroup = new CalcVarRadioButtonGroup();

    /**
     * This variable is used as an intermediary to convert the provided data string into a buffer of
     * integers, which the various CRC algorithms then use to calculate the CRC value from.
     */
    public CalcVarGeneric<List<Integer>> convertedCrcDataCalcVar = new CalcVarGeneric();

    /**
     * A sub-set of the total available preset CRC algorithms, of those that are important enough
     * to display in the CRC GridPane.
     */
    Set<CrcCatalogue.PresetCrcAlgorithmsIds> crcAlgorithmsToDisplayIndividually =
            EnumSet.of(
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_8_MAXIM,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_8_WCDMA,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_CCITT_FALSE,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_CDMA2000,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_GENIBUS,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_KERMIT_CCITT_TRUE,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_MAXIM,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_MODBUS,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_32_POSIX_CKSUM);

    CalcVarText userSelectableCrcValueCalcVar = new CalcVarText();

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
        crcDataCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Input;
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
        addCalcVar(calcVarRadioButtonGroup);

        //===============================================================================================//
        //============================= CONVERTED CRC DATA (hidden output) ==============================//
        //===============================================================================================//

        convertedCrcDataCalcVar.setName("convertedCrcDataCalcVar");
        convertedCrcDataCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Output;
        });
        convertedCrcDataCalcVar.setEquationFunction(() -> {

            String crcDataString = crcDataCalcVar.getValue();
            Toggle inputDataType = calcVarRadioButtonGroup.getValue();

            // Convert this string into a list of integers
            List<Integer> buffer = new ArrayList<>();

            if (inputDataType == asciiUnicode) {
                for (int i = 0; i < crcDataString.length(); i++) {
                    char currentChar = crcDataString.charAt(i);

                    // Convert the character into it's equivalent Unicode integer
                    // Note: Since Unicode is a complete superset of ASCII, this will
                    // work for ASCII characters to
                    buffer.add((int) currentChar);
                }
            } else if (inputDataType == hex) {

                // Note: i gets incremented each time by 2
                for (int i = 0; i < crcDataString.length(); i += 2) {

                    String hexByte;
                    // Special case if string length is odd, for the last value we
                    // have to extract just one character
                    if (crcDataString.length() - i == 1) {
                        hexByte = crcDataString.substring(i, i + 1);
                    } else {
                        // Extract 2-character strings from the CRC data
                        hexByte = crcDataString.substring(i, i + 2);
                    }

                    try {
                        Integer integerValueOfHex = Integer.parseInt(hexByte, 16);
                        buffer.add(integerValueOfHex);

                    } catch (NumberFormatException e) {
                        // We will get here if the input data is not valid hex, e.g. it has
                        // characters after f in the input
                        crcDataCalcVar.validationResults.add(
                                new CalcValidationResult(
                                        CalcValidationLevels.Error,
                                        "Input data is not valid. If in \"Hex\"mode, data must contain only the numerals 0-9 and the characters A-F. Do not add \"0x\"to the start of the hex number."));
                        crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Error;
                        crcDataCalcVar.updateUIBasedOnValidationResults();

                        return new ArrayList<Integer>();
                    }
                }
            }

            // If we make it to here, everything was o.k.
            crcDataCalcVar.validationResults.clear();
            crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
            crcDataCalcVar.updateUIBasedOnValidationResults();

            return buffer;
        });
        addCalcVar(convertedCrcDataCalcVar);

        //===============================================================================================//
        //=============================== GRIDPANE CRC VALUES (output) ================================//
        //===============================================================================================//

        // Start inserting CRC algorithm rows at row = 1, since the first row is the header
        // (header defined in .fxml file)
        int currGridPaneRow = 1;

        // Insert all important CRC algorithms into GridPane
        for(CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsIds : crcAlgorithmsToDisplayIndividually) {
            new CrcAlgorithmRow(
                    crcValuesGridPane,
                    currGridPaneRow++,
                    CrcCatalogue.get(presetCrcAlgorithmsIds),
                    convertedCrcDataCalcVar,
                    this);
        }

        //==============================================//
        //======== USER-SELECTABLE CRC ALGORITHM =======//
        //==============================================//

        ComboBox<CrcCatalogue.PresetCrcAlgorithmsIds> selectCrcAlgorithmComboBox = new ComboBox();

        crcValuesGridPane.add(selectCrcAlgorithmComboBox, 0, currGridPaneRow);

        for(CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsId : CrcCatalogue.PresetCrcAlgorithmsIds.values()) {

            if(!crcAlgorithmsToDisplayIndividually.contains(presetCrcAlgorithmsId)) {
                // CRC algorithm is NOT displayed individually, so lets add it too
                // the combobox
                selectCrcAlgorithmComboBox.getItems().add(presetCrcAlgorithmsId);
            }
        }


        // Configure how the ComboBox will display it's items
        selectCrcAlgorithmComboBox
                .setCellFactory(new Callback<ListView<CrcCatalogue.PresetCrcAlgorithmsIds>, ListCell<CrcCatalogue.PresetCrcAlgorithmsIds>>() {
                    @Override
                    public ListCell<CrcCatalogue.PresetCrcAlgorithmsIds> call(ListView<CrcCatalogue.PresetCrcAlgorithmsIds> param) {
                        final ListCell<CrcCatalogue.PresetCrcAlgorithmsIds> cell = new ListCell<CrcCatalogue.PresetCrcAlgorithmsIds>() {
                            {
                                super.setPrefWidth(100);
                            }

                            @Override
                            public void updateItem(CrcCatalogue.PresetCrcAlgorithmsIds item, boolean empty) {
                                super.updateItem(item, empty);
                                if (item != null) {
                                    setText(CrcCatalogue.get(item).name);
                                } else {
                                    setText(null);
                                }
                            }
                        };
                        return cell;
                    }
                });

        selectCrcAlgorithmComboBox.setValue(CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_X25_IBM_SLDC_ISO_HDLC);

        selectCrcAlgorithmComboBox.valueProperty().addListener(new ChangeListener<CrcCatalogue.PresetCrcAlgorithmsIds>() {
            @Override public void changed(ObservableValue ov, CrcCatalogue.PresetCrcAlgorithmsIds oldValue, CrcCatalogue.PresetCrcAlgorithmsIds newValue) {
                System.out.println("Changing user-selectable CRC algorithm...");
                userSelectableCrcValueCalcVar.calculate();
            }
        });

        // TEXT FIELD

        TextField userSelectableCrcValueTextField = new TextField();
        crcValuesGridPane.add(userSelectableCrcValueTextField, 1, currGridPaneRow);

        userSelectableCrcValueCalcVar.setName("crcValueCalcVar");
        userSelectableCrcValueCalcVar.setTextField(userSelectableCrcValueTextField);
        userSelectableCrcValueCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Output;
        });
        userSelectableCrcValueCalcVar.setEquationFunction(() -> {

            List<Integer> convertedCrcData = convertedCrcDataCalcVar.getValue();

            if (convertedCrcData == null) {
                return "";
            }

            CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsId = selectCrcAlgorithmComboBox.getValue();

            // Create a CRC engine
            CrcGeneric crcGeneric = new CrcGeneric(CrcCatalogue.get(presetCrcAlgorithmsId));

            for(Integer data : convertedCrcData) {
                crcGeneric.update(data);
            }

            //Integer crcResult = Crc16XModem.CalcFast(convertedCrcData);
            long crcResult = crcGeneric.getValue();

            // Convert to hex for display
            String crcResultAsHex = "0x" + String.format("%04X", crcResult);

            return crcResultAsHex;

        });
        userSelectableCrcValueCalcVar.setHelpText("The CRC result for the user-selectable algorithm.");
        addCalcVar(userSelectableCrcValueCalcVar);


        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

//    public void calculateAll() {
//
//        String crcDataString = crcDataCalcVar.getValue();
//        Toggle inputDataType = calcVarRadioButtonGroup.getValue();
//
//        // Convert this string into a list of integers
//        List<Integer> buffer = new ArrayList<>();
//
//        if(inputDataType == asciiUnicode) {
//            for (int i = 0; i < crcDataString.length(); i++) {
//                char currentChar = crcDataString.charAt(i);
//
//                // Convert the character into it's equivalent Unicode integer
//                // Note: Since Unicode is a complete superset of ASCII, this will
//                // work for ASCII characters to
//                buffer.add((int) currentChar);
//            }
//        } else if(inputDataType == hex) {
//
//            // Note: i gets incremented each time by 2
//            for (int i = 0; i < crcDataString.length(); i += 2) {
//
//                String hexByte;
//                // Special case if string length is odd, for the last value we
//                // have to extract just one character
//                if(crcDataString.length() - i == 1) {
//                    hexByte = crcDataString.substring(i, i + 1);
//                } else {
//                    // Extract 2-character strings from the CRC data
//                    hexByte = crcDataString.substring(i, i + 2);
//                }
//
//                try {
//                    Integer integerValueOfHex = Integer.parseInt(hexByte, 16);
//                    buffer.add(integerValueOfHex);
//
//                } catch(NumberFormatException e) {
//                    // We will get here if the input data is not valid hex, e.g. it has
//                    // characters after f in the input
//                    crcDataCalcVar.validationResults.add(
//                            new CalcValidationResult(
//                                    CalcValidationLevels.Error,
//                                    "Input data is not valid. If in \"Hex\"mode, data must contain only the numerals 0-9 and the characters A-F. Do not add \"0x\"to the start of the hex number."));
//                    crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Error;
//                    crcDataCalcVar.updateUIBasedOnValidationResults();
//
//                    return;
//
//                }
//            }
//        }
//
//        Integer crcResult = Crc16XModem.CalcFast(buffer);
//
//        // Convert to hex for display
//        String crcResultAsHex = "0x" + String.format("%04X", crcResult);
//
//        crc16XmodemCalcVar.setValue(crcResultAsHex);
//
//        // If we make it to here, everything was o.k.
//        crcDataCalcVar.validationResults.clear();
//        crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
//        crcDataCalcVar.updateUIBasedOnValidationResults();
//
//        crc16XmodemCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
//        crc16XmodemCalcVar.updateUIBasedOnValidationResults();
//
//        //return crcResultAsHex;
//
//    }

}

