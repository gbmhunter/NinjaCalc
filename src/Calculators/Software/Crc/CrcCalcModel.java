
package Calculators.Software.Crc;

// SYSTEM INCLUDES

import Core.*;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Generic.CalcVarGeneric;
import Core.CalcVar.Numerical.CalcVarNumerical;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Core.CalcVar.RadioButtonGroup.CalcVarRadioButtonGroup;
import Core.CalcVar.Text.CalcVarText;
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
import javafx.util.StringConverter;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

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
    private WebView infoWebView;

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

    //==============================================//
    //======== USER-SELECTED CRC ALGORITHM =========//
    //==============================================//

    @FXML
    private ComboBox<CrcCatalogue.PresetCrcAlgorithmsIds> selectCrcAlgorithmComboBox;

    @FXML
    private TextField selectedCrcAlgorithmCrcValue;

    // Additional information

    @FXML
    private Label selectedCrcNameLabel;
    @FXML
    private Label crcWidthLabel;
    @FXML
    private Label generatorPolynomialLabel;
    @FXML
    private Label selectedCrcInitValueLabel;
    @FXML
    private Label selectedCrcReflectDataInLabel;
    @FXML
    private Label selectedCrcReflectCrcOutLabel;
    @FXML
    private Label selectedCrcXorOutLabel;
    @FXML
    private Label selectedCrcCheckLabel;

    //==============================================//
    //============ CUSTOM CRC ALGORITHM ============//
    //==============================================//

    @FXML
    private TextField customCrcWidthTextField;
    @FXML
    private TextField customCrcGeneratorPolynomialTextField;
    @FXML
    private TextField customCrcInitValueTextField;
    @FXML
    private CheckBox customCrcReflectDataInCheckBox;
    @FXML
    private CheckBox customCrcReflectCrcOutCheckBox;
    @FXML
    private TextField customCrcXorOutTextField;
    @FXML
    private TextField customCrcValueTextField;

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
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_8_SMBUS,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_CCITT_FALSE,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_KERMIT_CCITT_TRUE,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_MAXIM,
                    CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_MODBUS);

    CalcVarText userSelectableCrcValueCalcVar = new CalcVarText();

    //==============================================//
    //============== CUSTOM CRC ALGORITHM ==========//
    //==============================================//

    CalcVarNumericalInput customCrcWidthCalcVar = new CalcVarNumericalInput();
    CalcVarText customCrcGeneratorPolynomialCalcVar = new CalcVarText();
    CalcVarText customCrcInitCalcVar = new CalcVarText();
    CalcVarText customCrcXorOutCalcVar = new CalcVarText();
    CalcVarText customCrcValueCalcVar = new CalcVarText();

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public CrcCalcModel() {

        super("CRC Values",
                "Calculate CRC values from either a large number of popular CRC algorithms or define one yourself.",
                new String[]{"Software"},
                new String[]{"crc", "cycle redundancy check", "smbus", "comms", "bus", "embedded", "messaging", "networking", "parity", "bits", "xor"});

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
        //======================================= COMMON CRC ALGORITHMS =================================//
        //===============================================================================================//

        // Start inserting CRC algorithm rows at row = 1, since the first row is the header
        // (header defined in .fxml file)
        int currGridPaneRow = 1;

        // Insert all important CRC algorithms into GridPane
        for (CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsIds : crcAlgorithmsToDisplayIndividually) {
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

        for (CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsId : CrcCatalogue.PresetCrcAlgorithmsIds.values()) {
            selectCrcAlgorithmComboBox.getItems().add(presetCrcAlgorithmsId);
        }


        // Configure how the ComboBox will display it's items (NOT selected item, but items
        // in dropdown)
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
                                    // This next line sets the display string in the combobox
                                    setText(CrcCatalogue.get(item).name);
                                } else {
                                    setText(null);
                                }
                            }
                        };
                        return cell;
                    }
                });

        // Configure how the ComboBox will display the selected item
        selectCrcAlgorithmComboBox.setConverter(new StringConverter<CrcCatalogue.PresetCrcAlgorithmsIds>() {
            @Override
            public String toString(CrcCatalogue.PresetCrcAlgorithmsIds item) {
                if (item == null) {
                    return null;
                } else {
                    return CrcCatalogue.get(item).name;
                }
            }

            @Override
            public CrcCatalogue.PresetCrcAlgorithmsIds fromString(String item) {
                return null;
            }
        });

        //selectCrcAlgorithmComboBox.setValue(CrcCatalogue.PresetCrcAlgorithmsIds.CRC_16_X25_IBM_SLDC_ISO_HDLC);
        selectCrcAlgorithmComboBox.setValue(null);

        selectCrcAlgorithmComboBox.valueProperty().addListener(new ChangeListener<CrcCatalogue.PresetCrcAlgorithmsIds>() {
            @Override
            public void changed(ObservableValue ov, CrcCatalogue.PresetCrcAlgorithmsIds oldValue, CrcCatalogue.PresetCrcAlgorithmsIds newValue) {
                System.out.println("Changing user-selectable CRC algorithm...");
                userSelectableCrcValueCalcVar.calculate();

                CrcAlgorithmParameters crcAlgorithmParameters = CrcCatalogue.get(newValue);

                // Update all info about new CRC algorithm
                selectedCrcNameLabel.setText(crcAlgorithmParameters.name);
                crcWidthLabel.setText(Integer.toString(crcAlgorithmParameters.crcWidthBits));
                generatorPolynomialLabel.setText(String.format("0x%0" + (crcAlgorithmParameters.crcWidthBits + 3) / 4 + "X", crcAlgorithmParameters.crcPolynomial));
                selectedCrcInitValueLabel.setText(String.format("0x%0" + (crcAlgorithmParameters.crcWidthBits + 3) / 4 + "X", crcAlgorithmParameters.startingValue));
                selectedCrcReflectDataInLabel.setText(Boolean.toString(crcAlgorithmParameters.reflectData));
                selectedCrcReflectCrcOutLabel.setText(Boolean.toString(crcAlgorithmParameters.reflectRemainder));
                selectedCrcXorOutLabel.setText(String.format("0x%0" + (crcAlgorithmParameters.crcWidthBits + 3) / 4 + "X", crcAlgorithmParameters.finalXorValue));
                selectedCrcCheckLabel.setText(String.format("0x%0" + (crcAlgorithmParameters.crcWidthBits + 3) / 4 + "X", crcAlgorithmParameters.checkValue));

            }
        });

        // TEXT FIELD

        userSelectableCrcValueCalcVar.setName("crcValueCalcVar");
        userSelectableCrcValueCalcVar.setTextField(selectedCrcAlgorithmCrcValue);
        userSelectableCrcValueCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Output;
        });
        userSelectableCrcValueCalcVar.setEquationFunction(() -> {

            List<Integer> convertedCrcData = convertedCrcDataCalcVar.getValue();

            if (convertedCrcData == null) {
                return "";
            }

            CrcCatalogue.PresetCrcAlgorithmsIds presetCrcAlgorithmsId = selectCrcAlgorithmComboBox.getValue();

            if (presetCrcAlgorithmsId == null) {
                return "";
            }

            // Create a CRC engine
            CrcAlgorithmParameters crcAlgorithmParameters = CrcCatalogue.get(presetCrcAlgorithmsId);
            CrcGeneric crcGeneric = new CrcGeneric(crcAlgorithmParameters);

            for (Integer data : convertedCrcData) {
                crcGeneric.update(data);
            }

            //Integer crcResult = Crc16XModem.CalcFast(convertedCrcData);
            long crcResult = crcGeneric.getValue();

            // Convert to hex for display
            String crcResultAsHex = String.format("0x%0" + ((crcAlgorithmParameters.crcWidthBits + 3) / 4)  + "X", crcResult);

            return crcResultAsHex;

        });
        userSelectableCrcValueCalcVar.setHelpText("The CRC result for the user-selectable algorithm.");
        addCalcVar(userSelectableCrcValueCalcVar);

        //===============================================================================================//
        //===================================== CUSTOM CRC ALGORITHM ====================================//
        //===============================================================================================//

        customCrcWidthCalcVar.setName("customCrcWidthCalcVar");
        customCrcWidthCalcVar.setValueTextField(customCrcWidthTextField);
        customCrcWidthCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1e0, NumberPreference.DEFAULT),
        });
        customCrcWidthCalcVar.setHelpText("The width of the CRC generator polynomial (and resulting CRC value).");
        customCrcWidthCalcVar.setIsEngineeringNotationEnabled(false);
        customCrcWidthCalcVar.addValidator(CalcVarNumerical.PrebuiltValidators.IS_INTEGER);
        customCrcWidthCalcVar.addValidator(CalcVarNumerical.PrebuiltValidators.IS_GREATER_THAN_0);
        customCrcWidthCalcVar.addValidator(
                new Validator(() -> {
                    if (customCrcWidthCalcVar.getRawVal() > 64) {
                        return CalcValidationLevels.Error;
                    } else {
                        return CalcValidationLevels.Ok;
                    }
                },
                        "Width of CRC must not be bigger than 64 bits (due to limitations of the CRC engine)."));
        addCalcVar(customCrcWidthCalcVar);


        customCrcGeneratorPolynomialCalcVar.setName("crcDataCalcVar");
        customCrcGeneratorPolynomialCalcVar.setTextField(customCrcGeneratorPolynomialTextField);
        customCrcGeneratorPolynomialCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Input;
        });
        customCrcGeneratorPolynomialCalcVar.setHelpText("The generator polynomial for the CRC, in hex. Please describe this in standard form, i.e. by excluding the MSB of the polynomial, and not reversing the bit order. The generator polynomial cannot have more bits than the width of the CRC.");
        customCrcGeneratorPolynomialCalcVar.addValidator(CalcVarText.PrebuiltValidators.MUST_BE_HEX);
        customCrcGeneratorPolynomialCalcVar.addValidator(
                new Validator(() -> {

                    long generatorPolynomial;
                    try {
                        generatorPolynomial = Long.parseLong(customCrcGeneratorPolynomialCalcVar.getValue(), 16);
                    } catch (NumberFormatException e) {
                        return CalcValidationLevels.Error;
                    }

                    if (generatorPolynomial > Math.pow(2, customCrcWidthCalcVar.getRawVal())) {
                        return CalcValidationLevels.Error;
                    } else {
                        return CalcValidationLevels.Ok;
                    }
                },
                        "Generator polynomial cannot have more bits that the width of the CRC."));
        addCalcVar(customCrcGeneratorPolynomialCalcVar);


        customCrcInitCalcVar.setName("customCrcInitCalcVar");
        customCrcInitCalcVar.setTextField(customCrcInitValueTextField);
        customCrcInitCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Input;
        });
        customCrcInitCalcVar.setHelpText("The initial value for the CRC, in hex. This cannot have more bits than the width CRC.");
        customCrcInitCalcVar.addValidator(CalcVarText.PrebuiltValidators.MUST_BE_HEX);
        customCrcInitCalcVar.addValidator(
                new Validator(() -> {

                    long initValue;
                    try {
                        initValue = Long.parseLong(customCrcInitCalcVar.getValue(), 16);
                    } catch (NumberFormatException e) {
                        return CalcValidationLevels.Error;
                    }

                    if (initValue > Math.pow(2, customCrcWidthCalcVar.getRawVal())) {
                        return CalcValidationLevels.Error;
                    } else {
                        return CalcValidationLevels.Ok;
                    }
                },
                        "Init value cannot have more bits that the width of the CRC."));
        addCalcVar(customCrcInitCalcVar);


        customCrcReflectDataInCheckBox.selectedProperty().addListener(
                (ObservableValue<? extends Boolean> ov, Boolean oldValue, Boolean newValue) -> {
                    customCrcValueCalcVar.calculate();
                }
        );


        customCrcReflectCrcOutCheckBox.selectedProperty().addListener(
                (ObservableValue<? extends Boolean> ov, Boolean oldValue, Boolean newValue) -> {
                    customCrcValueCalcVar.calculate();
                }
        );


        customCrcXorOutCalcVar.setName("customCrcXorOutCalcVar");
        customCrcXorOutCalcVar.setTextField(customCrcXorOutTextField);
        customCrcXorOutCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Input;
        });
        customCrcXorOutCalcVar.setHelpText("The XOR out value for the CRC.");
        customCrcXorOutCalcVar.addValidator(CalcVarText.PrebuiltValidators.MUST_BE_HEX);
        customCrcXorOutCalcVar.addValidator(
                new Validator(() -> {

                    long xorOut;
                    try {
                        xorOut = Long.parseLong(customCrcXorOutCalcVar.getValue(), 16);
                    } catch (NumberFormatException e) {
                        return CalcValidationLevels.Error;
                    }

                    if (xorOut > Math.pow(2, customCrcWidthCalcVar.getRawVal())) {
                        return CalcValidationLevels.Error;
                    } else {
                        return CalcValidationLevels.Ok;
                    }
                },
                        "XOR out value cannot have more bits that the width of the CRC."));
        addCalcVar(customCrcXorOutCalcVar);

        customCrcValueCalcVar.setName("customCrcValueCalcVar");
        customCrcValueCalcVar.setTextField(customCrcValueTextField);
        customCrcValueCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Output;
        });
        customCrcValueCalcVar.setEquationFunction(() -> {

            // Read dependencies
            List<Integer> crcData = convertedCrcDataCalcVar.getValue();
            Integer crcWidth = (int) customCrcWidthCalcVar.getRawVal();
            String crcGeneratorPolynomial = customCrcGeneratorPolynomialCalcVar.getValue();
            String crcInitialValue = customCrcInitCalcVar.getValue();
            Boolean reflectDataIn = customCrcReflectDataInCheckBox.isSelected();
            Boolean reflectCrcOut = customCrcReflectCrcOutCheckBox.isSelected();
            String crcXorOut = customCrcXorOutCalcVar.getValue();

            // Convert dependencies as necessary
            Long generatorPolynomialAsLong;
            Long initialValueAsLong;
            Long xorOutAsLong;
            try {
                generatorPolynomialAsLong = Long.parseLong(crcGeneratorPolynomial, 16);
                initialValueAsLong = Long.parseLong(crcInitialValue, 16);
                xorOutAsLong = Long.parseLong(crcXorOut, 16);
            } catch (NumberFormatException e) {
                //System.err.println("Could not convert data!");
                return "";
            }

            // Generate a CRC engine from the information we have obtained
            CrcGeneric crcGeneric = new CrcGeneric(
                    crcWidth,
                    generatorPolynomialAsLong,
                    initialValueAsLong,
                    xorOutAsLong,
                    reflectDataIn,
                    reflectCrcOut);

            // Process the given data with the CRC engine
            for (Integer data : crcData) {
                crcGeneric.update(data);
            }

            //Integer crcResult = Crc16XModem.CalcFast(convertedCrcData);
            long crcResult = crcGeneric.getValue();

            // Convert to hex for display. +3 is to "round up" to next hex digit.
            String crcResultAsHex = String.format("0x%0" + (crcWidth + 3) / 4 + "X", crcResult);

            return crcResultAsHex;

        });
        addCalcVar(customCrcValueCalcVar);


        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

