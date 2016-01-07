using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;

namespace NinjaCalc {
    class OhmsLaw : Calculator {

        Calculators.OhmsLawView view;


        public OhmsLaw()
            : base(
            "Ohm's Law",
            "Ohm's law calculator.",
            new Uri("pack://application:,,,/Calculators/icon.png")) {

            // Create the view for this calculator
            this.view = new Calculators.OhmsLawView();

            //===============================================================================================//
            //============================================ VOLTAGE ==========================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "voltage",
                new CalcNumberVar(
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
            this.CalcVars["voltage"].AddValidator(Validator.IsNumber());
            this.CalcVars["voltage"].AddValidator(new Validator(
                (value) => {
                    if (value < 0) {
                        return CalcValidationResults.Error;
                    }
                    else {
                        return CalcValidationResults.Ok;
                    }
                }));

            //===============================================================================================//
            //============================================ CURRENT ==========================================//
            //===============================================================================================//

            this.CalcVars.Add(
                "current",
                new CalcNumberVar(
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

            //===============================================================================================//
            //========================================== RESISTANCE =========================================//
            //===============================================================================================//

            this.CalcVars.Add(
                "resistance",
                new CalcNumberVar(
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
                        new NumberUnit("mR", 0.001),
                        new NumberUnit("R", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            this.CalcVars["resistance"].Direction = Direction_t.Output;

            this.FindDependenciesAndDependants();

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
