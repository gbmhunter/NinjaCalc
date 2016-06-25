package Calculators.Electronics.Filters.LowPassRC;

// SYSTEM IMPORTS
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Numerical.CalcVarNumerical;
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
 * The model (code behind) for the low-pass RC filter calculator.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2014-05-22
 * @last-modified   2016-04-23
 */
public class LowPassRCCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private WebView infoWebView;

    @FXML private TextField resistorTextField;
    @FXML private RadioButton resistorRadioButton;

    @FXML private TextField capacitorTextField;
    @FXML private RadioButton capacitorRadioButton;

    @FXML private TextField cutOffFrequencyTextField;
    @FXML private RadioButton cutOffFrequencyRadioButton;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical resistor = new CalcVarNumerical();
    public CalcVarNumerical capacitor = new CalcVarNumerical();
    public CalcVarNumerical cutOffFrequency = new CalcVarNumerical();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public LowPassRCCalcModel() {

        super(
            "Low-pass RC Filter",
            "The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering and adding to the output of a PWM signal to make a cheap DAC.",
            new String[] { "Electronics", "Filters" },
            new String[] { "rc", "filters", "filtering", "low-pass", "adc", "signal", "conditioning", "processing" });

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("LowPassRCCalcView.fxml"));
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
        resistorRadioButton.setToggleGroup(toggleGroup);
        capacitorRadioButton.setToggleGroup(toggleGroup);
        cutOffFrequencyRadioButton.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(cutOffFrequencyRadioButton);

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

        /*this.resistor = new CalcVarNumerical(
            "resistor",                // Variable name (used for debugging)
                resistorTextField,             // Textbox for value (UI object)
            null,             // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double cutOffFrequency = this.cutOffFrequency.getRawVal();
                Double capacitor = this.capacitor.getRawVal();

                return (1.0 / (2*Math.PI*cutOffFrequency*capacitor));
            },
            new NumberUnitMultiplier[]{   // units
                //new NumberUnitMultiplier("mΩ", 1e-3),
                new NumberUnitMultiplier("Ω", 1e0),
                //new NumberUnitMultiplier("kΩ", 1e3, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("MΩ", 1e6),
                //new NumberUnitMultiplier("GΩ", 1e9),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(resistorRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },   // Default direction
            null,               // Default value
            "The resistance of the resistor in the low-pass LC filter." // Help text
        );*/

        this.resistor.setName("resistor");
        this.resistor.setValueTextField(this.resistorTextField);
        this.resistor.setEquationFunction(() -> {
            // Read dependency variables
            Double fc = this.cutOffFrequency.getRawVal();
            Double c = this.capacitor.getRawVal();

            return (1.0 / (2*Math.PI*fc*c));
        });
        this.resistor.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0),
        });
        this.resistor.setNumDigitsToRound(4);
        this.resistor.setDirectionFunction(() -> {
            if (resistorRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.resistor.setDefaultRawValue(null);
        this.resistor.setHelpText("The resistance of the resistor in the low-pass LC filter.");
        this.resistor.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.resistor.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.resistor.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.resistor);

        //===============================================================================================//
        //======================================= C (capacitance) (I/O) =================================//
        //===============================================================================================//

        /*this.capacitor = new CalcVarNumerical(
            "capacitor",                // Variable name (used for debugging)
                capacitorTextField,        // Textbox for value (UI object)
            null,        // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.resistor.getRawVal();
                Double fc = this.cutOffFrequency.getRawVal();

                return (1.0 / (2 * Math.PI * fc * r));
            },
            new NumberUnitMultiplier[]{   // units
                //new NumberUnitMultiplier("pF", 1e-12),
                //new NumberUnitMultiplier("nF", 1e-9, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("uF", 1e-6),
                //new NumberUnitMultiplier("mF", 1e-3),
                new NumberUnitMultiplier("F", 1e0),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(capacitorRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The capacitance of the capacitor in the low-pass LC filter." // Help text
            );*/

        this.capacitor.setName("capacitor");
        this.capacitor.setValueTextField(this.capacitorTextField);
        this.capacitor.setEquationFunction(() -> {
            // Read dependency variables
            Double r = this.resistor.getRawVal();
            Double fc = this.cutOffFrequency.getRawVal();

            return (1.0 / (2 * Math.PI * fc * r));
        });
        this.capacitor.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("F", 1e0),
        });
        this.capacitor.setNumDigitsToRound(4);
        this.capacitor.setDirectionFunction(() -> {
            if (this.capacitorRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.capacitor.setDefaultRawValue(null);
        this.capacitor.setHelpText("The capacitance of the capacitor in the low-pass LC filter.");
        this.capacitor.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.capacitor.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.capacitor.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.capacitor);


        //===============================================================================================//
        //===================================== cutOffFrequency (cut-off frequency) (I/O) ============================//
        //===============================================================================================//

        /*this.cutOffFrequency = new CalcVarNumerical(
            "cutOffFrequency",               // Variable name (used for debugging)
                cutOffFrequencyTextField,       // Textbox for value (UI object)
            null,       // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.resistor.getRawVal();
                Double c = this.capacitor.getRawVal();

                return (1.0 / (2 * Math.PI * r * c));
            },
            new NumberUnitMultiplier[]{   // units
                //new NumberUnitMultiplier("mHz", 1e-3),
                new NumberUnitMultiplier("Hz", 1e0),
                //new NumberUnitMultiplier("kHz", 1e3, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("MHz", 1e6),
                //new NumberUnitMultiplier("GHz", 1e9),
            },
            4,                  // Num. digits to round to
            () -> {             // Direction-determining function
                if(cutOffFrequencyRadioButton.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.");*/

        this.cutOffFrequency.setName("cutOffFrequency");
        this.cutOffFrequency.setValueTextField(this.cutOffFrequencyTextField);
        this.cutOffFrequency.setEquationFunction(() -> {
            // Read dependency variables
            Double r = this.resistor.getRawVal();
            Double c = this.capacitor.getRawVal();

            return (1.0 / (2 * Math.PI * r * c));
        });
        this.cutOffFrequency.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Hz", 1e0),
        });
        this.cutOffFrequency.setNumDigitsToRound(4);
        this.cutOffFrequency.setDirectionFunction(() -> {
            if (cutOffFrequencyRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.cutOffFrequency.setDefaultRawValue(null);
        this.cutOffFrequency.setHelpText("The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.");
        this.cutOffFrequency.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.cutOffFrequency.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.cutOffFrequency.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.cutOffFrequency);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
