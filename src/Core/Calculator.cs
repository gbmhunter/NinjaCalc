using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc {
    /// <summary>
    /// Base calculator class. Designed to be inherited by actual calculator implementations.
    /// </summary>
    public abstract class Calculator {
        private string name;

        /// <summary>
        /// The name of the calculator. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Name {
            get {
                return name;
            }
            set {
                name = value;
            }
        }

        private string description;

        /// <summary>
        /// A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Description {
            get {
                return description;
            }
            set {
                description = value;
            }
        }

        private Dictionary<string, CalcVar> calcVars;

        /// <summary>
        /// A list holding all of the calculator variables for the calculator.
        /// </summary>
        public Dictionary<string, CalcVar> CalcVars {
            get {
                return calcVars;
            }
            set {
                calcVars = value;
            }
        }

        private Uri iconImagePath;

        public Uri IconImagePath {
            get {
                return this.iconImagePath;
            }
            set {
                this.iconImagePath = value;
            }
        }

        /// <summary>
        /// Constructor for calculator.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Calculator(string name, string description, Uri iconImagePath) {
            this.name = name;
            this.description = description;
            this.calcVars = new Dictionary<string, CalcVar>();
            this.IconImagePath = iconImagePath;
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
        protected void FindDependenciesAndDependants() {

            var dependencyList = new List<CalcVar>();

            EventHandler eventHandler = (object sender, EventArgs e) => {
                CalcVar calcVar = (CalcVar)sender;
                //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
                dependencyList.Add(calcVar);
            };

            // Attach event handlers onto the read-of-value for each calculator variable,
            // and also disable updating of the textboxes when we call Calculate().
            foreach (var pair in this.CalcVars) {
                pair.Value.RawValueRead += eventHandler;
                pair.Value.DisableUpdate = true;
            }


            foreach (var pair in this.CalcVars) {
                Console.WriteLine("Finding dependencies for CalcVar \"" + pair.Value.Name + "\".");
                dependencyList.Clear();

                // Invoke the equation, this will fire ReadRawValue events
                // for all variables it needs, and add to the dependancy list
                // DO NOT call pair.Value.Calculate() directly!
                pair.Value.Equation.Invoke(this.CalcVars);

                // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                for (int j = 0; j < dependencyList.Count; j++) {
                    Console.WriteLine("\"" + dependencyList[j].Name + "\" is a dependency of \"" + pair.Value.Name + "\".");
                    dependencyList[j].Dependants.Add(pair.Value);
                }

                Console.WriteLine("Finished finding dependencies for CalcVar \"" + pair.Value.Name + "\".");

                // Save the dependencies to the calculator variable
                pair.Value.Dependencies = dependencyList;
            }

            // Now remove event handler that we added at start of function, and
            // re-enable updates for all variables
            foreach (var pair in this.CalcVars) {
                pair.Value.RawValueRead -= eventHandler;
                pair.Value.DisableUpdate = false;

                Console.WriteLine("Dependants of \"" + pair.Value.Name + "\" are:");

                for (int j = 0; j < pair.Value.Dependants.Count; j++) {
                    Console.WriteLine("\t\"" + pair.Value.Dependants[j].Name + "\"");
                }
            }
        }

    }
}
