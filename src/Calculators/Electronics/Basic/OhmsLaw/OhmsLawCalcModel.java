
package Calculators.Electronics.Basic.OhmsLaw;

// SYSTEM INCLUDES
import Core.CalcVarDirections;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;

// USER INCLUDES

import Core.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

/**
 * A simple Ohm's law calculator which allows you to calculate voltage, resistance or current.
 *
 * @author gbmhunter
 * @since 2015-11-02
 */
public class OhmsLawCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private TextField textFieldVoltageValue;
    @FXML private ComboBox comboBoxVoltageUnits;
    @FXML private RadioButton radioButtonVoltageIO;

    @FXML private TextField textFieldCurrentValue;
    @FXML private ComboBox comboBoxCurrentUnits;
    @FXML private RadioButton radioButtonCurrentIO;

    @FXML private TextField textFieldResistanceValue;
    @FXML private ComboBox comboBoxResistanceUnits;
    @FXML private RadioButton radioButtonResistanceIO;

    @FXML private WebView infoWebView;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical voltage;
    public CalcVarNumerical current;
    public CalcVarNumerical resistance;

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public OhmsLawCalcModel() {

        super( "Ohm's Law",
                "The hammer in any electrical engineers toolbox. calculate voltage, resistance and current using Ohm's law.",
                "/Calculators/Electronics/Basic/OhmsLaw/grid-icon.png",
                new String[]{ "Electronics", "Basic" },
                new String[]{"ohm, resistor, resistance, voltage, current, law, vir"});

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("OhmsLawCalcView.fxml"));
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
        radioButtonVoltageIO.setToggleGroup(toggleGroup);
        radioButtonCurrentIO.setToggleGroup(toggleGroup);
        radioButtonResistanceIO.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(radioButtonResistanceIO);

        // Following code provides lambda function which listens to radiobuttons changes and modifies direction accordingly
        System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                    System.out.println("Listener called for radio button toggle group.");
                    // old_toggle might be null if it is the first time something has been selected
                    if(old_toggle != null) {
                        System.out.println("oldToggle = \"" + old_toggle.toString() + "\".");
                    } else {
                        System.out.println("oldToggle is null.");
                    }
                    System.out.println(" newToggle = \"" + new_toggle + "\".");

                    this.refreshDirectionsAndUpdateUI();
                    this.recalculateAllOutputs();
                }
        );

        //===============================================================================================//
        //============================================ VOLTAGE ==========================================//
        //===============================================================================================//

        this.voltage = new CalcVarNumerical(
            "voltage",
            textFieldVoltageValue,
            comboBoxVoltageUnits,
            () -> {
                Double current = this.current.getRawVal();
                Double resistance = this.resistance.getRawVal();
                return current * resistance;
            },
            new NumberUnit[]{
                new NumberUnit("mV", 1e-3),
                new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                new NumberUnit("kV", 1e3),
            },
            4,
            () -> {
                if(radioButtonVoltageIO.isSelected())
                    return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,
            "The voltage across the resistor." // Help text
            );

        // Add validators
        this.voltage.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.voltage.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.voltage);

        //===============================================================================================//
        //============================================ CURRENT ==========================================//
        //===============================================================================================//


        this.current = new CalcVarNumerical(
            "current",
            textFieldCurrentValue,
            comboBoxCurrentUnits,
            () -> {
                Double voltage = this.voltage.getRawVal();
                Double resistance = this.resistance.getRawVal();
                return voltage / resistance;
            },
            new NumberUnit[]{
                new NumberUnit("pA", 1e-12),
                new NumberUnit("nA", 1e-9),
                new NumberUnit("uA", 1e-6),
                new NumberUnit("mA", 1e-3),
                new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
            },
            4,
            () -> {
                if(radioButtonCurrentIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,
            "The current going through the resistor" // Help text
            );

        this.current.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.current.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.current);

        //===============================================================================================//
        //========================================== RESISTANCE =========================================//
        //===============================================================================================//


        this.resistance = new CalcVarNumerical(
            "resistance",
            textFieldResistanceValue,
            comboBoxResistanceUnits,
            () -> {
                Double voltage = this.voltage.getRawVal();
                Double current = this.current.getRawVal();
                return voltage / current;
            },
            new NumberUnit[]{
                new NumberUnit("mΩ", 1e-3),
                new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                new NumberUnit("kΩ", 1e3),
                new NumberUnit("MΩ", 1e6),
                new NumberUnit("GΩ", 1e9),
            },
            4,
            () -> {
                if(radioButtonResistanceIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,
            "The resistance of the resistor (or other circuit component)." // Help text
            );

        this.resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.resistance);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

