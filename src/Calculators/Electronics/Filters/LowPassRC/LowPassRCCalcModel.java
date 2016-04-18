package Calculators.Electronics.Filters.LowPassRC;

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
 * The model (code behind) for the low-pass RC filter calculator.
 *
 * @author gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since 2014-05-22
 * @last-modified 2016-04-12
 */
public class LowPassRCCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private TextField rValue;
    @FXML private RadioButton rIO;

    @FXML private TextField cValue;
    @FXML private RadioButton cIO;

    @FXML private TextField fcValue;
    @FXML private RadioButton fcIO;

    @FXML private WebView infoWebView;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical r;
    public CalcVarNumerical c;
    public CalcVarNumerical fc;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public LowPassRCCalcModel() {

        super(
            "Low-pass RC Filter",
            "The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering and adding to the output of a PWM signal to make a cheap DAC.",
            new String[] { "Electronics", "Filters" },
            new String[] { "rc", "filters", "low-pass", "adc", "signal", "conditioning" });

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
        rIO.setToggleGroup(toggleGroup);
        cIO.setToggleGroup(toggleGroup);
        fcIO.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(fcIO);

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

        this.r = new CalcVarNumerical(
            "r",                // Variable name (used for debugging)
            rValue,             // Textbox for value (UI object)
            null,             // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double fc = this.fc.getRawVal();
                Double c = this.c.getRawVal();

                return (1.0 / (2*Math.PI*fc*c));
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
                if(rIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },   // Default direction
            null,               // Default value
            "The resistance of the resistor in the low-pass LC filter." // Help text
        );

        this.r.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.r.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.r.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.r);

        //===============================================================================================//
        //======================================= C (capacitance) (I/O) =================================//
        //===============================================================================================//

        this.c = new CalcVarNumerical(
            "c",                // Variable name (used for debugging)
            cValue,        // Textbox for value (UI object)
            null,        // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.r.getRawVal();
                Double fc = this.fc.getRawVal();

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
                if(cIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The capacitance of the capacitor in the low-pass LC filter." // Help text
            );

        this.c.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.c.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.c.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.c);


        //===============================================================================================//
        //===================================== fc (cut-off frequency) (I/O) ============================//
        //===============================================================================================//

        this.fc = new CalcVarNumerical(
            "fc",               // Variable name (used for debugging)
            fcValue,       // Textbox for value (UI object)
            null,       // Combobox for units (UI object)
            () -> {             // Equation when an output
                Double r = this.r.getRawVal();
                Double c = this.c.getRawVal();

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
                if(fcIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,               // Default value
            "The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.");

        this.fc.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.fc.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.fc.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.fc);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
