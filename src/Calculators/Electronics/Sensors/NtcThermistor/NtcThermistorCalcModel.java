package Calculators.Electronics.Sensors.NtcThermistor;

// SYSTEM IMPORTS

import Core.*;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

// USER IMPORTS

/**
 * The model (code behind) for the NTC thermistor calculator.
 *
 * This uses the beta equation in the form:
 * 1/T = 1/T_0 + (1/b)*ln(R/R_0)
 *
 * @author          gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since           2016-04-14
 * @last-modified   2016-04-14
 */
public class NtcThermistorCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private WebView infoWebView;

    @FXML private TextField betaTextField;
    @FXML private RadioButton betaRadioButton;
    @FXML private ComboBox betaComboBox;

    @FXML private TextField referenceResistanceTextField;
    @FXML private RadioButton referenceResistanceRadioButton;
    @FXML private ComboBox referenceResistanceComboBox;

    @FXML private TextField referenceTemperatureTextField;
    @FXML private RadioButton referenceTemperatureRadioButton;
    @FXML private ComboBox referenceTemperatureComboBox;

    @FXML private TextField thermistorResistanceTextField;
    @FXML private RadioButton thermistorResistanceRadioButton;
    @FXML private ComboBox thermistorResistanceComboBox;

    @FXML private TextField thermistorTemperatureTextField;
    @FXML private RadioButton thermistorTemperatureRadioButton;
    @FXML private ComboBox thermistorTemperatureComboBox;



    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical beta;
    public CalcVarNumerical referenceResistance;
    public CalcVarNumerical referenceTemperature;
    public CalcVarNumerical thermistorResistance;
    public CalcVarNumerical thermistorTemperature;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public NtcThermistorCalcModel() {

        super(
            "NTC Thermistor Temperature",
            "Calculate the temperature of a NTC thermistor given it's resistance.",
            new String[] { "Electronics", "Sensors" },
            new String[] { "temperature", "thermistor", "ntc", "negative", "coefficient", "sensor", "resistor" });

        super.setIconImagePath(getClass().getResource("grid-icon.jpg"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("NtcThermistorCalcView.fxml"));
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
        final String htmlFile= "info.html";
        URL url = getClass().getResource(htmlFile);
        engine.load(url.toExternalForm());

        //===============================================================================================//
        //================================ INPUT/OUTPUT TOGGLE GROUP ====================================//
        //===============================================================================================//

        ToggleGroup toggleGroup = new ToggleGroup();

        // Add all calculator variables to toggle group
        this.betaRadioButton.setToggleGroup(toggleGroup);
        this.referenceResistanceRadioButton.setToggleGroup(toggleGroup);
        this.referenceTemperatureRadioButton.setToggleGroup(toggleGroup);
        this.thermistorResistanceRadioButton.setToggleGroup(toggleGroup);
        this.thermistorTemperatureRadioButton.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(this.thermistorTemperatureRadioButton);

        // Following code provides lambda function which listens to radiobuttons changes and modifies direction accordingly
        //System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                this.refreshDirectionsAndUpdateUI();
                this.recalculateAllOutputs();
            }
        );

        //===============================================================================================//
        //============================================ BETA (I/O) =======================================//
        //===============================================================================================//

        this.beta = new CalcVarNumerical(
            "beta",                // Variable name (used for debugging)
            this.betaTextField,        // Textbox for value (UI object)
            this.betaComboBox,        // Combobox for units (UI object)
            () -> {             // Equation when an output

               return 0.0;
            },
            new NumberUnitMultiplier[]{   // units
                new NumberUnitMultiplier("no unit", 1e0),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(betaRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The temperature of the air. This must be the same temperature at which the relative humidity was measured at." // Help text
            );

        this.beta.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.beta.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.beta.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.beta);

        //===============================================================================================//
        //==================================== REFERENCE RESISTANCE (I/O) ===============================//
        //===============================================================================================//

        this.referenceResistance = new CalcVarNumerical(
                "referenceResistance",                // Variable name (used for debugging)
                this.referenceResistanceTextField,          // Textbox for value (UI object)
                this.referenceResistanceComboBox,             // Combobox for units (UI object)
                () -> {             // Equation when an output
                    // Read dependency variables
                    return 0.0;
                },
                new NumberUnitMultiplier[]{   // units
                        new NumberUnitMultiplier("Ω", 1e0),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(referenceResistanceRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },   // Default direction
                null,               // Default value
                "The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature." // Help text
        );

        this.referenceResistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.referenceResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.referenceResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.referenceResistance);

        //===============================================================================================//
        //==================================== REFERENCE TEMPERATURE (I/O) ==============================//
        //===============================================================================================//

        this.referenceTemperature = new CalcVarNumerical(
                "referenceTemperature",               // Variable name (used for debugging)
                this.referenceTemperatureTextField,       // Textbox for value (UI object)
                this.referenceTemperatureComboBox,       // Combobox for units (UI object)
                () -> {             // Equation when an output

                    // Read dependency variables
                    return 0.0;
                },
                new NumberUnit[]{   // units
                        new NumberUnitFunction("°C", (value) -> { return value - 273.15; }, (value) -> { return value + 273.15; }),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(referenceTemperatureRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,               // Default value
                "If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.");

        this.referenceTemperature.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.referenceTemperature.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        //this.referenceTemperature.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.referenceTemperature);

        //===============================================================================================//
        //==================================== THERMISTOR RESISTANCE (I/O) ==============================//
        //===============================================================================================//

        this.thermistorResistance = new CalcVarNumerical(
                "thermistorResistance",                // Variable name (used for debugging)
                this.thermistorResistanceTextField,          // Textbox for value (UI object)
                this.thermistorResistanceComboBox,            // Combobox for units (UI object)
                () -> {             // Equation when an output
                    // Read dependency variables
                    return 0.0;
                },
                new NumberUnitMultiplier[]{   // units
                        new NumberUnitMultiplier("Ω", 1e0),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(this.thermistorResistanceRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },   // Default direction
                null,               // Default value
                "The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature." // Help text
        );

        this.thermistorResistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.thermistorResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.thermistorResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.thermistorResistance);

        //===============================================================================================//
        //==================================== THERMISTOR TEMPERATURE (I/O) =============================//
        //===============================================================================================//

        this.thermistorTemperature = new CalcVarNumerical(
                "thermistorTemperature",               // Variable name (used for debugging)
                this.thermistorTemperatureTextField,       // Textbox for value (UI object)
                this.thermistorTemperatureComboBox,       // Combobox for units (UI object)
                () -> {             // Equation when an output

                    // Read dependency variables
                    Double beta_NoUnit = this.beta.getRawVal();
                    Double referenceResistance_Ohms = this.referenceResistance.getRawVal();
                    Double referenceTemperature_DegC = this.referenceTemperature.getRawVal();
                    Double thermistorResistance_Ohms = this.thermistorResistance.getRawVal();

                    Double thermistorTemperature_DegC = 1.0/(1.0/referenceTemperature_DegC + (1.0/beta_NoUnit)*Math.log(thermistorResistance_Ohms/referenceResistance_Ohms));
                    return thermistorTemperature_DegC;
                },
                new NumberUnit[]{   // units
                        new NumberUnitFunction("°C", (value) -> { return value - 273.15; }, (value) -> { return value + 273.15; }),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(thermistorTemperatureRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,               // Default value
                "If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.");

        this.thermistorTemperature.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.thermistorTemperature.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        //this.referenceTemperature.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.thermistorTemperature);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
