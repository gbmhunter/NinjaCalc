
package Core;

import javafx.scene.layout.*;

import java.util.ArrayList;
import java.util.function.Function;

/// <summary>
/// Base calculator class. Designed to be inherited by actual calculator implementations, which then define their own variables.
/// </summary>
public abstract class Calculator {

    /// <summary>
    /// The name of the calculator. This is shown in the "choose calculator" grid.
    /// </summary>
    public String Name;

    /// <summary>
    /// A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
    /// </summary>
    public String Description;

    public String IconImagePath;

    public String[] CategoryTree;

    public String[] Tags;

    /// <summary>
    /// This holds the "view" of the calculator, the WPF UserControl object which represents what
    /// the user can see and interact with.
    /// </summary>
    public GridPane View;

    /// <summary>
    /// A list holding all of the calculator variables for the calculator.
    /// </summary>
    public ArrayList<CalcVarBase> CalcVars;



    /// <summary>
    /// Constructor for calculator.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="description"></param>
    public Calculator(
        String name,
        String description,
        String iconImagePath,
        String[] categoryTree,
        String[] tags,
        GridPane view) {

        this.Name = name;
        this.Description = description;

        //========== CATEGORY ==========//

        this.CategoryTree = categoryTree;

        //========== TAGS ==========//

        this.Tags = tags;

        //========== SELECTION GRID ICON ==========//

        this.IconImagePath = iconImagePath;

        //========== VIEW ==========//

        // Internally save reference to the view
        this.View = view;

        //========== MISC. ==========//

        // Initialise empty dictionary for the calculator variables
        // (these are not passed into the constructor for clarity reasons)
        this.CalcVars = new ArrayList<CalcVarBase>();
    }

    /// <summary>
    /// This finds all the dependencies and dependants for all calculator variables,
    /// and populates the Dependancies and Dependants lists for each. Must be called after all
    /// variables have been added to the calcVars List.
    /// </summary>
    protected void FindDependenciesAndDependants() {

        System.out.println("FindDependenciesAndDependants() called for calculator.Name = \"" + this.Name + "\".");

        ArrayList<CalcVarBase> dependencyList = new ArrayList<CalcVarBase>();

        /*EventHandler eventHandler = (object sender, EventArgs e) => {
            CalcVarBase calcVar = (CalcVarBase)sender;
            //Console.WriteLine("CalcVar \"" + calcVar.Name + "\" was read.");
            dependencyList.Add(calcVar);
        };*/

        // Attach event handlers onto the read-of-value for each calculator variable,
        // and also disable updating of the textboxes when we call Calculate().
        for (CalcVarBase calcVar : this.CalcVars) {
            //calcVar.RawValueRead += eventHandler;
            calcVar.addRawValueReadListener((calcVarBase) -> {
                System.out.println("CalcVar \"" + calcVar.Name + "\" was read.");
                dependencyList.add(calcVar);
            });
            calcVar.DisableUpdate = true;
        }


        for(CalcVarBase calcVar : this.CalcVars) {
            System.out.println("Finding dependencies for CalcVar \"" + calcVar.Name + "\".");
            dependencyList.clear();

            if (calcVar.Equation != null) {
                // Invoke the equation, this will fire ReadRawValue events
                // for all variables it needs, and add to the dependancy list
                // DO NOT call pair.Value.Calculate() directly!
                calcVar.Equation.execute();

                // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                for (int j = 0; j < dependencyList.size(); j++) {
                    System.out.println("\"" + dependencyList.get(j).Name + "\" is a dependency of \"" + calcVar.Name + "\".");
                    dependencyList.get(j).Dependants.add(calcVar);
                }
            }
            else {
                System.out.println("Equation was null, so \"" + calcVar.Name + "\" has no dependancies.");
            }

            System.out.println("Finished finding dependencies for CalcVar \"" + calcVar.Name + "\".");

            // Save the dependencies to the calculator variable
            calcVar.Dependencies = dependencyList;
        }

        // Now remove event handler that we added at start of function, and
        // re-enable updates for all variables
        for(CalcVarBase calcVar : this.CalcVars) {
            //calcVar.RawValueRead -= eventHandler;
            calcVar.DisableUpdate = false;

            System.out.println("Dependants of \"" + calcVar.Name + "\" are:");

            for (int j = 0; j < calcVar.Dependants.size(); j++) {
                System.out.println("\t\"" + calcVar.Dependants.get(j).Name + "\"");
            }
        }
    }

    /// <summary>
    /// Performs validation on every numerical calculator variable, and updates UI accordingly.
    /// Useful for bringing calculator into a default state.
    /// </summary>
    public void ValidateAllVariables() {
        for(CalcVarBase calcVar : this.CalcVars) {
            // We can only validate numerical calculator variables
            // (this may change in the future)
            if (calcVar instanceof CalcVarNumerical) {
                CalcVarNumerical calcVarNumerical = (CalcVarNumerical)calcVar;
                calcVarNumerical.Validate();
            }
        }
    }

    /// <summary>
    /// Forces all output variables in the calculator to re-calculate. Useful for bringing the calculator
    /// into a default state once all the variables have been set up correctly.
    /// </summary>
    public void RecalculateAllOutputs() {
        for(CalcVarBase calcVar : this.CalcVars) {
            // We only want to call Calculate() on outputs
            if (calcVar.Direction == CalcVarBase.Directions.Output) {
                // Call calculate, this will update the textboxes automatically
                calcVar.Calculate();
            }
        }
    }

}

