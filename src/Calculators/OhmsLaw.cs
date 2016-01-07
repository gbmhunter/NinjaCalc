using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;

namespace NinjaCalc {
    public class OhmsLawCalculator : Calculator {

        Calculators.OhmsLawView view;


        public OhmsLawCalculator()
            : base(
            "Ohm's Law",
            "Ohm's law calculator.",
            "pack://application:,,,/Calculators/icon.png") {

            // Create the view for this calculator
            this.view = new Calculators.OhmsLawView();

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
                        new NumberUnit("mV", 0.001),
                        new NumberUnit("V", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            // Add validators
            this.CalcVars["voltage"].AddValidator(Validator.IsNumber(CalcValidationResults.Error));
            this.CalcVars["voltage"].AddValidator(Validator.IsGreaterThanZero(CalcValidationResults.Error));

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
                        new NumberUnit("mA", 0.001),
                        new NumberUnit("A", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            this.CalcVars["current"].AddValidator(Validator.IsNumber(CalcValidationResults.Error));
            this.CalcVars["current"].AddValidator(Validator.IsGreaterThanZero(CalcValidationResults.Error));

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
                        new NumberUnit("mΩ", 0.001),
                        new NumberUnit("Ω", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            this.CalcVars["resistance"].Direction = Direction_t.Output;
            this.CalcVars["resistance"].AddValidator(Validator.IsNumber(CalcValidationResults.Error));
            this.CalcVars["resistance"].AddValidator(Validator.IsGreaterThanZero(CalcValidationResults.Error));

            this.FindDependenciesAndDependants();

            // Bring the calculator into a default, stable state
            this.RecalculateAllOutputs();

        }

        /// <summary>
        /// Returns the Ohm's Law calculator view.
        /// </summary>
        /// <returns></returns>
        /// @todo Turn into parameter?
        public override Control GetView() {
            return view;
        }



    }
}
