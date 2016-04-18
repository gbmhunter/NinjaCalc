
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
 * @author gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since 2015-11-02
 * @last-modified 2016-04-17
 */
public class OhmsLawCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private TextField textFieldVoltageValue;
    @FXML private RadioButton radioButtonVoltageIO;

    @FXML private TextField textFieldCurrentValue;
    @FXML private RadioButton radioButtonCurrentIO;

    @FXML private TextField textFieldResistanceValue;
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
                new String[]{ "Electronics", "Basic" },
                new String[]{"ohm", "resistor", "resistance", "voltage", "current", "law", "v=ir"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));


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
        //System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
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
            null,
            () -> {
                Double current = this.current.getRawVal();
                Double resistance = this.resistance.getRawVal();
                return current * resistance;
            },
            new NumberUnitMultiplier[]{
                //new NumberUnitMultiplier("mV", 1e-3),
                new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("kV", 1e3),
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

        this.voltage.setIsEngineeringNotationEnabled(true);

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
            null,
            () -> {
                Double voltage = this.voltage.getRawVal();
                Double resistance = this.resistance.getRawVal();
                return voltage / resistance;
            },
            new NumberUnitMultiplier[]{
                //new NumberUnitMultiplier("pA", 1e-12),
                //new NumberUnitMultiplier("nA", 1e-9),
                //new NumberUnitMultiplier("uA", 1e-6),
                //new NumberUnitMultiplier("mA", 1e-3),
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
            },
            4,
            () -> {
                if(radioButtonCurrentIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,
            "The current going through the resistor" // Help text
            );

        this.current.setIsEngineeringNotationEnabled(true);

        this.current.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.current.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.current);

        //===============================================================================================//
        //========================================== RESISTANCE =========================================//
        //===============================================================================================//


        this.resistance = new CalcVarNumerical(
            "resistance",
            textFieldResistanceValue,
            null,
            () -> {
                Double voltage = this.voltage.getRawVal();
                Double current = this.current.getRawVal();
                return voltage / current;
            },
            new NumberUnitMultiplier[]{
                //new NumberUnitMultiplier("mΩ", 1e-3),
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("kΩ", 1e3),
                //new NumberUnitMultiplier("MΩ", 1e6),
                //new NumberUnitMultiplier("GΩ", 1e9),
            },
            4,
            () -> {
                if(radioButtonResistanceIO.isSelected()) return CalcVarDirections.Output;
                else return CalcVarDirections.Input;
            },
            null,
            "The resistance of the resistor (or other circuit component)." // Help text
            );

        this.resistance.setIsEngineeringNotationEnabled(true);

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

