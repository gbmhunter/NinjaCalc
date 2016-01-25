
package Calculators.Electronics.Basic.OhmsLaw;

// SYSTEM INCLUDES


// USER INCLUDES

import Core.*;
import javafx.fxml.FXML;
import javafx.scene.control.*;




public class OhmsLawCalcModel extends Calculator {

    @FXML
    private TextField voltageValue;
    @FXML
    private ComboBox voltageUnits;
    @FXML
    private RadioButton voltageIO;
    public CalcVarNumerical Voltage;

    @FXML
    private TextField currentValue;
    @FXML
    private ComboBox currentUnits;
    @FXML
    private RadioButton currentIO;
    public CalcVarNumerical Current;

    @FXML
    private TextField resistanceValue;
    @FXML
    private ComboBox resistanceUnits;
    @FXML
    private RadioButton resistanceIO;
    public CalcVarNumerical Resistance;

    public OhmsLawCalcModel() {

        super( "Ohm's Law",
                "The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm's law.",
                "pack://application:,,,/Calculators/Electronics/Basic/OhmsLaw/grid-icon.png",
                new String[]{ "Electronics", "Basic" },
                new String[]{"ohm, resistor, resistance, voltage, current, law, vir"},
                new OhmsLawView());

        var view = (OhmsLawView)this.View;

        //===============================================================================================//
        //============================================ VOLTAGE ==========================================//
        //===============================================================================================//

        this.Voltage = new CalcVarNumerical(
                "voltage",
                voltageValue,
                voltageUnits,
                voltageIO,
                () -> {
                    Double current = this.Current.getRawVal();
                    Double resistance = this.Resistance.getRawVal();
                    return current * resistance;
                },
                new NumberUnit[]{
                    new NumberUnit("mV", 1e-3),
                    new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                    new NumberUnit("kV", 1e3),
                },
                4,
                CalcVarBase.Directions.Input,
                null,
                "The voltage across the resistor." // Help text
                );

        // Add validators
        this.Voltage.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Voltage.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.CalcVars.add(this.Voltage);

        //===============================================================================================//
        //============================================ CURRENT ==========================================//
        //===============================================================================================//


        this.Current = new CalcVarNumerical(
                "current",
                currentValue,
                currentUnits,
                currentIO,
                //this.CalcVars,
                () -> {
                    Double voltage = this.Voltage.getRawVal();
                    Double resistance = this.Resistance.getRawVal();
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
                CalcVarBase.Directions.Input,
                null,
                "The current going through the resistor" // Help text
                );

        this.Current.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Current.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.CalcVars.add(this.Current);

        //===============================================================================================//
        //========================================== RESISTANCE =========================================//
        //===============================================================================================//


        this.Resistance = new CalcVarNumerical(
                "resistance",
                resistanceValue,
                resistanceUnits,
                resistanceIO,
                () -> {
                    Double voltage = this.Voltage.getRawVal();
                    Double current = this.Current.getRawVal();
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
                CalcVarBase.Directions.Output,
                null,
                "The resistance of the resistor (or other circuit component)." // Help text
                );

        this.Resistance.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Resistance.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.CalcVars.add(this.Resistance);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.FindDependenciesAndDependants();
        this.RecalculateAllOutputs();
        this.ValidateAllVariables();

    }
}

