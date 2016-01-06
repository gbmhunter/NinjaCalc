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

            this.FindDependenciesAndDependants();


        }

        /// <summary>
        /// Returns the Ohm's Law calculator view.
        /// </summary>
        /// <returns></returns>
        public override Control GetView()
        {
            return view;
        }

        private void FindDependenciesAndDependants()
        {

            var dependencyList = new List<CalcVar>();

            EventHandler eventHandler = (object sender, EventArgs e) => {
                CalcVar calcVar = (CalcVar)sender;
                //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
                dependencyList.Add(calcVar);
            };

            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                //this.CalcVars[i].RawValueRead += this.RawValueRead;
                this.CalcVars[i].RawValueRead += eventHandler;
            }

            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                Console.WriteLine("Finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");
                dependencyList.Clear();

                // Call the calculate method, this will fire ReadRawValue events
                // for all variables it needs, and add to the dependancy list
                this.CalcVars[i].Calculate();

                // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                for (int j = 0; j < dependencyList.Count; j++ )
                {
                    Console.WriteLine("\"" + dependencyList[j].Name + "\" is a dependency of \"" + this.CalcVars[i].Name + "\".");
                    dependencyList[j].Dependants.Add(this.CalcVars[i]);
                }

                Console.WriteLine("Finished finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");

                // Save the dependencies to the calculator variable
                this.CalcVars[i].Dependencies = dependencyList;
            }

            // Now remove event handler that we added at start of function
            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                this.CalcVars[i].RawValueRead -= eventHandler;
                Console.WriteLine("Dependants of \"" + this.CalcVars[i].Name + "\" are:");

                for (int j = 0; j < this.CalcVars[i].Dependants.Count; j++)
                {
                    Console.WriteLine("\t\"" + this.CalcVars[i].Dependants[j].Name + "\"");
                }

            }
        }

    }
}
