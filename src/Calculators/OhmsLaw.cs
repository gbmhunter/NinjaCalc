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

            this.CalcVars.Add(
                new CalcVar(
                    "voltage",
                    view.TextBoxVoltageValue,
                    view.RadioButtonVoltage,
                    this.CalcVars,
                    (calcVars) => {
                        var current = calcVars[1].RawVal;
                        var resistance = calcVars[2].RawVal;
                        return current * resistance;
                    }));

            this.CalcVars.Add(
                new CalcVar(
                    "current",
                    view.TextBoxCurrentValue,
                    view.RadioButtonCurrent,
                    this.CalcVars,
                    (calcVars) => calcVars[0].RawVal / calcVars[2].RawVal));
            
            this.CalcVars.Add(
                new CalcVar(
                    "resistance",
                    view.TextBoxResistanceValue,
                    view.RadioButtonResistance,
                    this.CalcVars,
                    (calcVars) => calcVars[0].RawVal / calcVars[1].RawVal));

            this.CalcVars.Find(
                (calcVar) => { return calcVar.Name == "resistance"; }).Direction = Direction_t.Output;

            this.CalculateDependencies();


        }

        /// <summary>
        /// Returns the Ohm's Law calculator view.
        /// </summary>
        /// <returns></returns>
        public override Control GetView()
        {
            return view;
        }

        private void CalculateDependencies()
        {

            var dependencyList = new List<CalcVar>();

            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                //this.CalcVars[i].RawValueRead += this.RawValueRead;
                this.CalcVars[i].RawValueRead += (object sender, EventArgs e) => {
                    CalcVar calcVar = (CalcVar)sender;
                    //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
                    dependencyList.Add(calcVar);
                };
            }

            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                Console.WriteLine("Finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");
                dependencyList.Clear();

                // Call the calculate method, this will fire ReadRawValue events
                // for all variables it needs
                this.CalcVars[i].Calculate();

                for (int j = 0; j < dependencyList.Count; j++ )
                {
                    Console.WriteLine("\"" + dependencyList[j].Name + "\" is a dependency of \"" + this.CalcVars[i].Name + "\".");
                }

                Console.WriteLine("Finished finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");

                // Save the dependencies to the calculator variable
                this.CalcVars[i].Dependencies = dependencyList;
            }
        }

    }
}
