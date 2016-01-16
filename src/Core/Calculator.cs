using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc.Core {
    /// <summary>
    /// Base calculator class. Designed to be inherited by actual calculator implementations, which then define their own variables.
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

        public Uri IconImagePath {
            get;
            set;
        }

        public string[] CategoryTree {
            get;
            set;
        }

        public string[] Tags {
            get;
            set;
        }

        /// <summary>
        /// This holds the "view" of the calculator, the WPF UserControl object which represents what
        /// the user can see and interact with.
        /// </summary>
        public UserControl View {
            get;
            set;
        }

        /// <summary>
        /// A list holding all of the calculator variables for the calculator.
        /// </summary>
        public List<CalcVarBase> CalcVars {
            get;
            set;
        }

        

        /// <summary>
        /// Constructor for calculator.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Calculator(
            string name,
            string description,
            string iconImagePath,
            string[] categoryTree,
            string[] tags,
            UserControl view) {

            this.Name = name;
            this.Description = description;

            //========== CATEGORY ==========//

            this.CategoryTree = categoryTree;

            //========== TAGS ==========//

            this.Tags = tags;

            //========== SELECTION GRID ICON ==========//

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

            //========== VIEW ==========//

            // Internally save reference to the view
            this.View = view;

            //========== MISC. ==========//

            // Initialise empty dictionary for the calculator variables
            // (these are not passed into the constructor for clarity reasons)
            this.CalcVars = new List<CalcVarBase>();
        }

        /// <summary>
        /// This finds all the dependencies and dependants for all calculator variables,
        /// and populates the Dependancies and Dependants lists for each. Must be called after all
        /// variables have been added to the calcVars List.
        /// </summary>
        protected void FindDependenciesAndDependants() {

            var dependencyList = new List<CalcVarBase>();

            EventHandler eventHandler = (object sender, EventArgs e) => {
                CalcVarBase calcVar = (CalcVarBase)sender;
                //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
                dependencyList.Add(calcVar);
            };

            // Attach event handlers onto the read-of-value for each calculator variable,
            // and also disable updating of the textboxes when we call Calculate().
            foreach (var calcVar in this.CalcVars) {
                calcVar.RawValueRead += eventHandler;
                calcVar.DisableUpdate = true;
            }


            foreach (var calcVar in this.CalcVars) {
                Console.WriteLine("Finding dependencies for CalcVar \"" + calcVar.Name + "\".");
                dependencyList.Clear();

                if (calcVar.Equation != null) {
                    // Invoke the equation, this will fire ReadRawValue events
                    // for all variables it needs, and add to the dependancy list
                    // DO NOT call pair.Value.Calculate() directly!
                    calcVar.Equation.Invoke();

                    // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                    for (int j = 0; j < dependencyList.Count; j++) {
                        Console.WriteLine("\"" + dependencyList[j].Name + "\" is a dependency of \"" + calcVar.Name + "\".");
                        dependencyList[j].Dependants.Add(calcVar);
                    }
                }
                else {
                    Console.WriteLine("Equation was null, so \"" + calcVar.Name + "\" has no dependancies.");
                }

                Console.WriteLine("Finished finding dependencies for CalcVar \"" + calcVar.Name + "\".");

                // Save the dependencies to the calculator variable
                calcVar.Dependencies = dependencyList;
            }

            // Now remove event handler that we added at start of function, and
            // re-enable updates for all variables
            foreach (var calcVar in this.CalcVars) {
                calcVar.RawValueRead -= eventHandler;
                calcVar.DisableUpdate = false;

                Console.WriteLine("Dependants of \"" + calcVar.Name + "\" are:");

                for (int j = 0; j < calcVar.Dependants.Count; j++) {
                    Console.WriteLine("\t\"" + calcVar.Dependants[j].Name + "\"");
                }
            }
        }

        /// <summary>
        /// Performs validation on every numerical calculator variable, and updates UI accordingly.
        /// Useful for bringing calculator into a default state.
        /// </summary>
        public void ValidateAllVariables() {
            foreach (var calcVar in this.CalcVars) {
                // We can only validate numerical calculator variables
                // (this may change in the future)
                if (calcVar is CalcVarNumerical) {
                    var calcVarNumerical = (CalcVarNumerical)calcVar;
                    calcVarNumerical.Validate();
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
                if (calcVar.Direction == Directions.Output) {
                    // Call calculate, this will update the textboxes automatically
                    calcVar.Calculate();
                }
            }
        }

    }
}
