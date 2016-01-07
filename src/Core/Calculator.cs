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

        /// <summary>
        /// The name of the calculator. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Name {
            get;
            set;
        }

        /// <summary>
        /// A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Description {
            get;
            set;
        }

        /// <summary>
        /// A list holding all of the calculator variables for the calculator.
        /// </summary>
        public Dictionary<string, CalcVar> CalcVars {
            get;
            set;
        }

        public Uri IconImagePath {
            get;
            set;
        }

        /// <summary>
        /// Constructor for calculator.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Calculator(string name, string description, string iconImagePath) {
            this.Name = name;
            this.Description = description;
            this.CalcVars = new Dictionary<string, CalcVar>();

            // The following is implemented to that unit tests work, as constructing a calculator outside
            // of this project (i.e. inside Unit Test project instead) causes the URI pack scheme to fail
            const string scheme = "pack";
            if (UriParser.IsKnownScheme(scheme)) {
                this.IconImagePath = new Uri(iconImagePath);
            }
            else {
                Console.WriteLine("WARNING: \"pack\" scheme for image URI is not known, are you running unit tests?");
                //this.IconImagePath = "";
            }
            //this.IconImagePath = iconImagePath;
        }

        /// <summary>
        /// This needs to return a Grid which contains the calculators view. The Grid element will be inserted on the
        /// empty tab when a new instance of the calculator is created. 
        /// </summary>
        /// <returns></returns>
        public abstract Control GetView();

        /// <summary>
        /// This finds all the dependencies and dependants for all calculator variables,
        /// and populates the Dependancies and Dependants lists for each. Must be called after all
        /// variables have been added to the calcVars List.
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

        /// <summary>
        /// Forces all output variables in the calculator to re-calculate. Useful for bringing the calculator
        /// into a default state once all the variables have been set up correctly.
        /// </summary>
        public void RecalculateAllOutputs() {
            foreach (var calcVar in this.CalcVars) {
                // We only want to call Calculate() on outputs
                if (calcVar.Value.Direction == Direction_t.Output) {
                    // Call calculate, this will update the textboxes automatically
                    calcVar.Value.Calculate();
                }
            }
        }

    }
}
