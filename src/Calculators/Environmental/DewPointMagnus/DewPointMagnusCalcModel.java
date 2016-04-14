package Calculators.Environmental.DewPointMagnus;

// SYSTEM IMPORTS

import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.control.Toggle;
import javafx.scene.control.ToggleGroup;
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

    @FXML private TextField relativeHumidityTextField;
    @FXML private RadioButton relativeHumidityRadioButton;

    @FXML private TextField airTemperatureTextField;
    @FXML private RadioButton airTemperatureRadioButton;

    @FXML private TextField dewPointTextField;
    @FXML private RadioButton dewPointRadioButton;

    @FXML private WebView infoWebView;

    // ADJUSTABLE "CONSTANTS"
    @FXML private TextField bCoefficient;
    @FXML private TextField cCoefficient;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical relativeHumidity;
    public CalcVarNumerical airTemperature;
    public CalcVarNumerical dewPoint;

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
                //System.out.println("Listener called for radio button toggle group.");
                // old_toggle might be null if it is the first time something has been selected
                if(old_toggle != null) {
                    //System.out.println("oldToggle = \"" + old_toggle.toString() + "\".");
                } else {
                    //System.out.println("oldToggle is null.");
                }
                //System.out.println(" newToggle = \"" + new_toggle + "\".");

                this.refreshDirectionsAndUpdateUI();
                this.recalculateAllOutputs();
            }
        );

        //===============================================================================================//
        //====================================== R (resistance) (I/O)====================================//
        //===============================================================================================//

        this.relativeHumidity = new CalcVarNumerical(
            "relativeHumidity",                // Variable name (used for debugging)
                relativeHumidityTextField,             // Textbox for value (UI object)
            null,             // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double fc = this.dewPoint.getRawVal();
                Double c = this.airTemperature.getRawVal();

                return (1.0 / (2*Math.PI*fc*c));
            },
            new NumberUnit[]{   // units
                //new NumberUnit("mΩ", 1e-3),
                new NumberUnit("Ω", 1e0),
                //new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                //new NumberUnit("MΩ", 1e6),
                //new NumberUnit("GΩ", 1e9),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(relativeHumidityRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },   // Default direction
            null,               // Default value
            "The resistance of the resistor in the low-pass LC filter." // Help text
        );

        this.relativeHumidity.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.relativeHumidity.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.relativeHumidity.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.relativeHumidity);

        //===============================================================================================//
        //======================================= C (capacitance) (I/O) =================================//
        //===============================================================================================//

        this.airTemperature = new CalcVarNumerical(
            "airTemperature",                // Variable name (used for debugging)
                airTemperatureTextField,        // Textbox for value (UI object)
            null,        // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.relativeHumidity.getRawVal();
                Double fc = this.dewPoint.getRawVal();

                return (1.0 / (2 * Math.PI * fc * r));
            },
            new NumberUnit[]{   // units
                //new NumberUnit("pF", 1e-12),
                //new NumberUnit("nF", 1e-9, NumberPreference.DEFAULT),
                //new NumberUnit("uF", 1e-6),
                //new NumberUnit("mF", 1e-3),
                new NumberUnit("F", 1e0),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(airTemperatureRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The capacitance of the capacitor in the low-pass LC filter." // Help text
            );

        this.airTemperature.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.airTemperature.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.airTemperature.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.airTemperature);


        //===============================================================================================//
        //===================================== dewPoint (cut-off frequency) (I/O) ============================//
        //===============================================================================================//

        this.dewPoint = new CalcVarNumerical(
            "dewPoint",               // Variable name (used for debugging)
                dewPointTextField,       // Textbox for value (UI object)
            null,       // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.relativeHumidity.getRawVal();
                Double c = this.airTemperature.getRawVal();

                return (1.0 / (2 * Math.PI * r * c));
            },
            new NumberUnit[]{   // units
                //new NumberUnit("mHz", 1e-3),
                new NumberUnit("Hz", 1e0),
                //new NumberUnit("kHz", 1e3, NumberPreference.DEFAULT),
                //new NumberUnit("MHz", 1e6),
                //new NumberUnit("GHz", 1e9),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(dewPointRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.");

        this.dewPoint.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.dewPoint.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.dewPoint.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.dewPoint);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
