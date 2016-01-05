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

        CalcVar voltage;
        CalcVar current;
        CalcVar resistance;

        Calculators.OhmsLawView view;

 

        public OhmsLaw() : base("Ohm's Law", "Ohm's law calculator.")
        {
            this.view = new Calculators.OhmsLawView();

            this.voltage = new CalcVar(view.TextBoxVoltageValue, () => current.RawVal*resistance.RawVal);
            this.current = new CalcVar(view.TextBoxCurrentValue, () => voltage.RawVal / resistance.RawVal);
            this.resistance = new CalcVar(view.TextBoxResistanceValue, () => voltage.RawVal / current.RawVal);
        }

        /// <summary>
        /// Returns the Ohm's Law calculator view.
        /// </summary>
        /// <returns></returns>
        public override Control GetView()
        {
            return view;
        }

    }
}
