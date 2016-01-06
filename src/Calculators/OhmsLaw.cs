using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;



namespace NinjaCalc
{
    class OhmsLaw : Calculator
    {

        Calculators.OhmsLawView view;


        public OhmsLaw() : base("Ohm's Law", "Ohm's law calculator.")
        {
            // Create the view for this calculator
            this.view = new Calculators.OhmsLawView();

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "voltage",
                new CalcVar(
                    "voltage",
                    view.TextBoxVoltageValue,
                    view.RadioButtonVoltage,
                    this.CalcVars,
                    (calcVars) => {
                        var current = calcVars["current"].RawVal;
                        var resistance = calcVars["resistance"].RawVal;
                        return current * resistance;
                    },
                    0.0));

            this.CalcVars["voltage"].AddValidator();

            this.CalcVars.Add(
                "current",
                new CalcVar(
                    "current",
                    view.TextBoxCurrentValue,
                    view.RadioButtonCurrent,
                    this.CalcVars,
                    (calcVars) => {
                        var voltage = calcVars["voltage"].RawVal;
                        var resistance = calcVars["resistance"].RawVal;
                        return voltage / resistance;
                    },
                    0.0));
            
            this.CalcVars.Add(
                "resistance",
                new CalcVar(
                    "resistance",
                    view.TextBoxResistanceValue,
                    view.RadioButtonResistance,
                    this.CalcVars,
                    (calcVars) => {
                        var voltage = calcVars["voltage"].RawVal;
                        var current = calcVars["current"].RawVal;
                        return voltage / current;
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
        public override Control GetView()
        {
            return view;
        }

      

    }
}
