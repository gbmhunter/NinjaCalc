package Calculators.Electronics.Sensors.DewPointMagnus;

// SYSTEM IMPORTS

import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

// USER IMPORTS

import Core.*;

/**
 * The model (code behind) for the dew-point calculator based upon the Magnus equation.
 *
 * RH: =100*(EXP((17.625*TD)/(243.04+TD))/EXP((17.625*T)/(243.04+T))
 * T: =243.04*(((17.625*TD)/(243.04+TD))-LN(RH/100))/(17.625+LN(RH/100)-((17.625*TD)/(243.04+TD)))
 * TD: =243.04*(LN(RH/100)+((17.625*T)/(243.04+T)))/(17.625-LN(RH/100)-((17.625*T)/(243.04+T)))
 *
 * RH is expressed as a percentage, T and TD are both in degrees Celcius
 *
 * @author          gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since           2016-04-14
 * @last-modified   2016-04-14
 */
public class DewPointMagnusCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private WebView infoWebView;

    @FXML private TextField airTemperatureTextField;
    @FXML private RadioButton airTemperatureRadioButton;
    @FXML private ComboBox airTemperatureComboBox;

    @FXML private TextField relativeHumidityTextField;
    @FXML private RadioButton relativeHumidityRadioButton;
    @FXML private ComboBox relativeHumidityComboBox;

    @FXML private TextField dewPointTextField;
    @FXML private RadioButton dewPointRadioButton;
    @FXML private ComboBox dewPointComboBox;
    
    // ADJUSTABLE "CONSTANTS"
    @FXML private TextField bCoefficientTextField;
    @FXML private TextField cCoefficientTextField;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical airTemperature = new CalcVarNumerical();
    public CalcVarNumerical relativeHumidity = new CalcVarNumerical();
    public CalcVarNumerical dewPoint = new CalcVarNumerical();

    public CalcVarNumericalInput bCoefficient = new CalcVarNumericalInput();
    public CalcVarNumericalInput cCoefficient =  new CalcVarNumericalInput();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public DewPointMagnusCalcModel() {

        super(
            "Dew Point (Magnus Equation)",
            "Calculate the dew point using the Magnus equation.",
            new String[] { "Environmental" },
            new String[] { "dew", "point", "magnus", "temperature", "humidity", "condensation", "pressure" });

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("DewPointMagnusCalcView.fxml"));
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
        relativeHumidityRadioButton.setToggleGroup(toggleGroup);
        airTemperatureRadioButton.setToggleGroup(toggleGroup);
        dewPointRadioButton.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(dewPointRadioButton);

        // Following code provides lambda function which listens to radiobuttons changes and modifies direction accordingly
        //System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                this.refreshDirectionsAndUpdateUI();
                this.recalculateAllOutputs();
            }
        );

        //===============================================================================================//
        //======================================= Air Temperature (I/O) =================================//
        //===============================================================================================//

        /*this.airTemperature = new CalcVarNumerical(
            "airTemperature",                // Variable name (used for debugging)
            this.airTemperatureTextField,        // Textbox for value (UI object)
            this.airTemperatureComboBox,        // Combobox for units (UI object)
            () -> {             // Equation when an output

                // Read dependency variables
                Double relativeHumidity = this.relativeHumidity.getRawVal();
                Double dewPoint = this.dewPoint.getRawVal();

                Double bCoefficient = this.bCoefficient.getRawVal();
                Double cCoefficient = this.cCoefficient.getRawVal();

                return cCoefficient*(((bCoefficient*dewPoint)/(cCoefficient+dewPoint))-Math.log(relativeHumidity/100.0))/(bCoefficient+Math.log(relativeHumidity/100.0)-((bCoefficient*dewPoint)/(cCoefficient+dewPoint)));
            },
            new NumberUnitMultiplier[]{   // units
                new NumberUnitMultiplier("°C", 1e0),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(airTemperatureRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The temperature of the air. This must be the same temperature at which the relative humidity was measured at." // Help text
            );*/

        this.airTemperature.init();
        this.airTemperature.setName("airTemperature");
        this.airTemperature.setValueTextField(this.airTemperatureTextField);
        this.airTemperature.setUnitsComboBox(this.airTemperatureComboBox);
        this.airTemperature.setEquationFunction(() -> {
            // Read dependency variables
            Double relativeHumidity = this.relativeHumidity.getRawVal();
            Double dewPoint = this.dewPoint.getRawVal();

            Double bCoefficient = this.bCoefficient.getRawVal();
            Double cCoefficient = this.cCoefficient.getRawVal();

            return cCoefficient*(((bCoefficient*dewPoint)/(cCoefficient+dewPoint))-Math.log(relativeHumidity/100.0))/(bCoefficient+Math.log(relativeHumidity/100.0)-((bCoefficient*dewPoint)/(cCoefficient+dewPoint)));
        });
        this.airTemperature.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0),
        });
        this.airTemperature.setNumDigitsToRound(4);
        this.airTemperature.setDirectionFunction(() -> {
            if (airTemperatureRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.airTemperature.setHelpText("The temperature of the air. This must be the same temperature at which the relative humidity was measured at.");
        this.airTemperature.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.airTemperature.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.airTemperature.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.airTemperature);

        //===============================================================================================//
        //====================================== Relative Humidity (I/O) ================================//
        //===============================================================================================//

        /*this.relativeHumidity = new CalcVarNumerical(
                "relativeHumidity",                // Variable name (used for debugging)
                this.relativeHumidityTextField,          // Textbox for value (UI object)
                this.relativeHumidityComboBox,             // Combobox for units (UI object)
                () -> {             // Equation when an output
                    // Read dependency variables
                    Double airTemperature_DegC = this.airTemperature.getRawVal();
                    Double dewPoint_DegC = this.dewPoint.getRawVal();

                    Double bCoefficient = this.bCoefficient.getRawVal();
                    Double cCoefficient = this.cCoefficient.getRawVal();

                    return 100.0*(Math.exp((bCoefficient*dewPoint_DegC)/(cCoefficient+dewPoint_DegC))/Math.exp((bCoefficient*airTemperature_DegC)/(cCoefficient+airTemperature_DegC)));
                },
                new NumberUnitMultiplier[]{   // units
                        new NumberUnitMultiplier("%", 1e0),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(relativeHumidityRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },   // Default direction
                null,               // Default value
                "The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature." // Help text
        );*/

        this.relativeHumidity.init();
        this.relativeHumidity.setName("relativeHumidity");
        this.relativeHumidity.setValueTextField(this.relativeHumidityTextField);
        this.relativeHumidity.setUnitsComboBox(this.relativeHumidityComboBox);
        this.relativeHumidity.setEquationFunction(() -> {
            // Read dependency variables
            Double airTemperature_DegC = this.airTemperature.getRawVal();
            Double dewPoint_DegC = this.dewPoint.getRawVal();

            Double bCoefficient = this.bCoefficient.getRawVal();
            Double cCoefficient = this.cCoefficient.getRawVal();

            return 100.0*(Math.exp((bCoefficient*dewPoint_DegC)/(cCoefficient+dewPoint_DegC))/Math.exp((bCoefficient*airTemperature_DegC)/(cCoefficient+airTemperature_DegC)));
        });
        this.relativeHumidity.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("%", 1e0),
        });
        this.relativeHumidity.setNumDigitsToRound(4);
        this.relativeHumidity.setDirectionFunction(() -> {
            if (relativeHumidityRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.relativeHumidity.setHelpText("The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature.");
        this.relativeHumidity.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.relativeHumidity.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.relativeHumidity.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.relativeHumidity);

        //===============================================================================================//
        //=========================================== Dew Point (I/O) ===================================//
        //===============================================================================================//

        /*this.dewPoint = new CalcVarNumerical(
                "dewPoint",               // Variable name (used for debugging)
                this.dewPointTextField,       // Textbox for value (UI object)
                this.dewPointComboBox,       // Combobox for units (UI object)
                () -> {             // Equation when an output

                    // Read dependency variables
                    Double airTemperature_DegC = this.airTemperature.getRawVal();
                    Double relativeHumidity_Perc = this.relativeHumidity.getRawVal();

                    Double bCoefficient = this.bCoefficient.getRawVal();
                    Double cCoefficient = this.cCoefficient.getRawVal();

                    //Math.log(rh/100*6.112/6.1078*Math.exp((17.67*temp)/(temp-0+243.5)));
                    Double dewPointNumerator = cCoefficient*(Math.log(relativeHumidity_Perc/100.0)+((bCoefficient*airTemperature_DegC)/(airTemperature_DegC+cCoefficient)));
                    Double dewPointDenominator = bCoefficient-Math.log(relativeHumidity_Perc/100.0)-((bCoefficient*airTemperature_DegC)/(airTemperature_DegC+cCoefficient));
                    Double dewPoint_DegC = dewPointNumerator/dewPointDenominator;

                    return dewPoint_DegC;
                },
                new NumberUnitMultiplier[]{   // units
                        new NumberUnitMultiplier("°C", 1e0),
                },
                4,                  // Num. digits to round to
                () -> {             // Direction-determining function
                    if(dewPointRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,               // Default value
                "If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.");*/

        this.dewPoint.init();
        this.dewPoint.setName("dewPoint");
        this.dewPoint.setValueTextField(this.dewPointTextField);
        this.dewPoint.setUnitsComboBox(this.dewPointComboBox);
        this.dewPoint.setEquationFunction(() -> {
            // Read dependency variables
            Double airTemperature_DegC = this.airTemperature.getRawVal();
            Double relativeHumidity_Perc = this.relativeHumidity.getRawVal();

            Double bCoefficient = this.bCoefficient.getRawVal();
            Double cCoefficient = this.cCoefficient.getRawVal();

            //Math.log(rh/100*6.112/6.1078*Math.exp((17.67*temp)/(temp-0+243.5)));
            Double dewPointNumerator = cCoefficient*(Math.log(relativeHumidity_Perc/100.0)+((bCoefficient*airTemperature_DegC)/(airTemperature_DegC+cCoefficient)));
            Double dewPointDenominator = bCoefficient-Math.log(relativeHumidity_Perc/100.0)-((bCoefficient*airTemperature_DegC)/(airTemperature_DegC+cCoefficient));
            Double dewPoint_DegC = dewPointNumerator/dewPointDenominator;

            return dewPoint_DegC;
        });
        this.dewPoint.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0),
        });
        this.dewPoint.setNumDigitsToRound(4);
        this.dewPoint.setDirectionFunction(() -> {
            if (dewPointRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.dewPoint.setHelpText("If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.");
        this.dewPoint.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.dewPoint.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        //this.dewPoint.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.dewPoint);

        //===============================================================================================//
        //===================================== B Coefficient (INPUT) ===================================//
        //===============================================================================================//

        /*this.bCoefficient = new CalcVarNumericalInput(
                "bCoefficient",          // Variable name (used for debugging)
                this.bCoefficientTextField,       // Textbox for value (UI object)
                null,               // Combobox for units (UI object)
                new NumberUnitMultiplier[]{   // units
                    new NumberUnitMultiplier("no unit", 1e0),
                },
                5,                  // Num. digits to round to
                17.625,               // Default value
                "The b coefficient of the Magnus equation.");*/

        this.bCoefficient.init();
        this.bCoefficient.setName("bCoefficient");
        this.bCoefficient.setValueTextField(this.bCoefficientTextField);
        this.bCoefficient.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1e0),
        });
        this.bCoefficient.setNumDigitsToRound(5);
        this.bCoefficient.setDefaultRawValue(17.625);
        this.bCoefficient.setHelpText("The b coefficient of the Magnus equation.");
        this.bCoefficient.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.bCoefficient.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.bCoefficient);

        //===============================================================================================//
        //===================================== C Coefficient (INPUT) ===================================//
        //===============================================================================================//

        /*this.cCoefficient = new CalcVarNumericalInput(
                "cCoefficient",          // Variable name (used for debugging)
                this.cCoefficientTextField,       // Textbox for value (UI object)
                null,       // Combobox for units (UI object)
                new NumberUnitMultiplier[]{   // units
                        new NumberUnitMultiplier("°C", 1e0),
                },
                5,                  // Num. digits to round to
                243.04,              // Default value
                "The c coefficient of the Magnus equation.");*/

        this.cCoefficient.init();
        this.cCoefficient.setName("cCoefficient");
        this.cCoefficient.setValueTextField(this.cCoefficientTextField);
        this.cCoefficient.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0),
        });
        this.cCoefficient.setNumDigitsToRound(5);
        this.cCoefficient.setDefaultRawValue(243.04);
        this.cCoefficient.setHelpText("The c coefficient of the Magnus equation.");
        this.cCoefficient.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.cCoefficient.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.cCoefficient);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
