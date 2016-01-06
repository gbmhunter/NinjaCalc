using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc
{
    /// <summary>
    /// Base calculator class. Designed to be inherited by actual calculator implementations.
    /// </summary>
    public abstract class Calculator
    {
        private string name;

        /// <summary>
        /// The name of the calculator. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }

        private string description;

        /// <summary>
        /// A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Description
        {
            get
            {
                return description;
            }
            set
            {
                description = value;
            }
        }

        private List<CalcVar> calcVars;

        /// <summary>
        /// A list holding all of the calculator variables for the calculator.
        /// </summary>
        public List<CalcVar> CalcVars
        {
            get
            {
                return calcVars;
            }
            set
            {
                calcVars = value;
            }
        }

        /// <summary>
        /// Constructor for calculator.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Calculator(string name, string description)
        {            
            this.name = name;
            this.description = description;
            this.calcVars = new List<CalcVar>();
        }

        /// <summary>
        /// This needs to return a Grid which contains the calculators view. The Grid element will be inserted on the
        /// empty tab when a new instance of the calculator is created. 
        /// </summary>
        /// <returns></returns>
        public abstract Control GetView();

        /// <summary>
        /// This finds all the dependencies and dependants for all calculator variables,
        /// and populates the Dependancies and Dependants lists for each.
        /// </summary>
        protected void FindDependenciesAndDependants()
        {

            var dependencyList = new List<CalcVar>();

            EventHandler eventHandler = (object sender, EventArgs e) =>
            {
                CalcVar calcVar = (CalcVar)sender;
                //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
                dependencyList.Add(calcVar);
            };

            // Attach event handlers onto the read-of-value for each calculator variable,
            // and also disable updating of the textboxes when we call Calculate().
            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                //this.CalcVars[i].RawValueRead += this.RawValueRead;
                this.CalcVars[i].RawValueRead += eventHandler;
                this.CalcVars[i].DisableUpdate = true;
            }

            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                Console.WriteLine("Finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");
                dependencyList.Clear();

                // Call the calculate method, this will fire ReadRawValue events
                // for all variables it needs, and add to the dependancy list
                this.CalcVars[i].Calculate();

                // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                for (int j = 0; j < dependencyList.Count; j++)
                {
                    Console.WriteLine("\"" + dependencyList[j].Name + "\" is a dependency of \"" + this.CalcVars[i].Name + "\".");
                    dependencyList[j].Dependants.Add(this.CalcVars[i]);
                }

                Console.WriteLine("Finished finding dependencies for CalcVar \"" + this.CalcVars[i].Name + "\".");

                // Save the dependencies to the calculator variable
                this.CalcVars[i].Dependencies = dependencyList;
            }

            // Now remove event handler that we added at start of function, and
            // re-enable updates for all variables
            for (int i = 0; i < this.CalcVars.Count; i++)
            {
                this.CalcVars[i].RawValueRead -= eventHandler;
                this.CalcVars[i].DisableUpdate = false;

                Console.WriteLine("Dependants of \"" + this.CalcVars[i].Name + "\" are:");

                for (int j = 0; j < this.CalcVars[i].Dependants.Count; j++)
                {
                    Console.WriteLine("\t\"" + this.CalcVars[i].Dependants[j].Name + "\"");
                }

            }
        }

    }
}
