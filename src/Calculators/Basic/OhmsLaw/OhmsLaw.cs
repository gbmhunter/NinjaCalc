using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;

namespace NinjaCalc {
    public class OhmsLawCalculator : Calculator {

        public OhmsLawCalculator()
            : base(
            "Ohm's Law",
            "Ohm's law calculator.",
            "pack://application:,,,/Calculators/Basic/OhmsLaw/icon.png",
            new Calculators.OhmsLawView()) {

            Calculators.OhmsLawView view = (Calculators.OhmsLawView)this.View;

            //===============================================================================================//
            //============================================ VOLTAGE ==========================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "voltage",
                new CalcVar(
                    "voltage",
                    view.TextBoxVoltageValue,
                    view.VoltageUnits,
                    view.RadioButtonVoltage,
                    this.CalcVars,
                    (calcVars) => {
                        var current = calcVars["current"].RawVal;
                        var resistance = calcVars["resistance"].RawVal;
                        return current * resistance;
                    },
                    new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                    },
                    0.0));

            // Add validators
            this.CalcVars["voltage"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["voltage"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            //===============================================================================================//
            //============================================ CURRENT ==========================================//
            //===============================================================================================//

            this.CalcVars.Add(
                "current",
                new CalcVar(
                    "current",
                    view.TextBoxCurrentValue,
                    view.CurrentUnits,
                    view.RadioButtonCurrent,
                    this.CalcVars,
                    (calcVars) => {
                        var voltage = calcVars["voltage"].RawVal;
                        var resistance = calcVars["resistance"].RawVal;
                        return voltage / resistance;
                    },
                    new NumberUnit[]{
                        new NumberUnit("pA", 1e-12),
                        new NumberUnit("nA", 1e-9),
                        new NumberUnit("uA", 1e-6),
                        new NumberUnit("mA", 1e-3),
                        new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
                    },
                    0.0));

            this.CalcVars["current"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["current"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            //===============================================================================================//
            //========================================== RESISTANCE =========================================//
            //===============================================================================================//

            this.CalcVars.Add(
                "resistance",
                new CalcVar(
                    "resistance",
                    view.TextBoxResistanceValue,
                    view.ResistanceUnits,
                    view.RadioButtonResistance,
                    this.CalcVars,
                    (calcVars) => {
                        var voltage = calcVars["voltage"].RawVal;
                        var current = calcVars["current"].RawVal;
                        return voltage / current;
                    },
                    new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kΩ", 1e3),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                    },
                    0.0));

            this.CalcVars["resistance"].Direction = Direction_t.Output;
            this.CalcVars["resistance"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["resistance"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.FindDependenciesAndDependants();

            // Bring the calculator into a default, stable state
            this.RecalculateAllOutputs();

        }
    }
}
