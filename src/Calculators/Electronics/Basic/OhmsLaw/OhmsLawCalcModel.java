
package Calculators.Electronics.Basic.OhmsLaw;

// SYSTEM INCLUDES

import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.CalcVarNumerical;
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
 * @last-modified 2016-04-23
 * @since 2015-11-02
 */
public class OhmsLawCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML
    private TextField voltageValueTextField;
    @FXML
    private RadioButton voltageRadioButton;

    @FXML
    private TextField currentValueTextField;
    @FXML
    private RadioButton currentRadioButton;

    @FXML
    private TextField resistanceValueTextField;
    @FXML
    private RadioButton resistanceRadioButton;

    @FXML
    private WebView infoWebView;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumerical voltage = new CalcVarNumerical();
    public CalcVarNumerical current = new CalcVarNumerical();
    public CalcVarNumerical resistance = new CalcVarNumerical();

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public OhmsLawCalcModel() {

        super("Ohm's Law",
                "The hammer in any electrical engineers toolbox. calculate voltage, resistance and current using Ohm's law.",
                new String[]{"Electronics", "Basic"},
                new String[]{"ohm", "ohm's", "resistor", "resistance", "voltage", "current", "law", "v=ir", "power"});

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
        final String htmlFile = "info.html";
        URL url = getClass().getResource(htmlFile);
        engine.load(url.toExternalForm());

        //===============================================================================================//
        //================================ INPUT/OUTPUT TOGGLE GROUP ====================================//
        //===============================================================================================//

        ToggleGroup toggleGroup = new ToggleGroup();

        // Add all calculator variables to toggle group
        voltageRadioButton.setToggleGroup(toggleGroup);
        currentRadioButton.setToggleGroup(toggleGroup);
        resistanceRadioButton.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(resistanceRadioButton);

        // Following code provides lambda function which listens to radiobuttons changes and modifies direction accordingly
        //System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                    this.refreshDirectionsAndUpdateUI();
                    this.recalculateAllOutputs();
                }
        );

        //===============================================================================================//
        //========================================= VOLTAGE (i/o) =======================================//
        //===============================================================================================//

        /*this.voltage = new CalcVarNumerical(
                "voltage",
                voltageValueTextField,
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
                    if (voltageRadioButton.isSelected())
                        return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The voltage across the resistor." // Help text
        );
        this.voltage.setIsEngineeringNotationEnabled(true);*/

        this.voltage.setName("voltage");
        this.voltage.setValueTextField(this.voltageValueTextField);
        this.voltage.setEquationFunction(() -> {
            // Read dependency variables
            Double current = this.current.getRawVal();
            Double resistance = this.resistance.getRawVal();
            return current * resistance;
        });
        this.voltage.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
        });
        this.voltage.setNumDigitsToRound(4);
        this.voltage.setDirectionFunction(() -> {
            if (voltageRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.voltage.setDefaultRawValue(null);
        this.voltage.setHelpText("The voltage across the resistor.");
        this.voltage.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.voltage.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.voltage.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.voltage);

        //===============================================================================================//
        //============================================ CURRENT ==========================================//
        //===============================================================================================//


        /*this.current = new CalcVarNumerical(
                "current",
                currentValueTextField,
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
                    if (currentRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The current going through the resistor" // Help text
        );*/

        this.current.setName("current");
        this.current.setValueTextField(this.currentValueTextField);
        this.current.setEquationFunction(() -> {
            // Read dependency variables
            Double voltage = this.voltage.getRawVal();
            Double resistance = this.resistance.getRawVal();
            return voltage / resistance;
        });
        this.current.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
        });
        this.current.setNumDigitsToRound(4);
        this.current.setDirectionFunction(() -> {
            if (currentRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.current.setDefaultRawValue(null);
        this.current.setHelpText("The current going through the resistor");
        this.current.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.current.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.current.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.current);

        //===============================================================================================//
        //========================================== RESISTANCE =========================================//
        //===============================================================================================//


        /*this.resistance = new CalcVarNumerical(
                "resistance",
                resistanceValueTextField,
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
                    if (resistanceRadioButton.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the resistor (or other circuit component)." // Help text
        );*/

        this.resistance.setName("resistance");
        this.resistance.setValueTextField(this.resistanceValueTextField);
        this.resistance.setEquationFunction(() -> {
            // Read dependency variables
            Double voltage = this.voltage.getRawVal();
            Double current = this.current.getRawVal();
            return voltage / current;
        });
        this.resistance.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        this.resistance.setNumDigitsToRound(4);
        this.resistance.setDirectionFunction(() -> {
            if (resistanceRadioButton.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.resistance.setDefaultRawValue(null);
        this.resistance.setHelpText("The resistance of the resistor (or other resistive circuit component).");
        this.resistance.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
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

