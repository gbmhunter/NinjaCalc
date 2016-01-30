package Core;

import javafx.scene.layout.*;

import java.util.ArrayList;

/**
 * Base calculator class. Designed to be inherited by actual calculator implementations, which then define their own variables.
 * @author gbmhunter
 * @since 2015-11-02
 */
public abstract class Calculator {

    /**
     * The name of the calculator. This is shown in the "choose calculator" grid.
     */
    public String name;

    /**
     * A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
     */
    public String description;

    public String iconImagePath;

    public String[] categoryTree;

    public String[] tags;

    /**
     * This holds the "view" of the calculator, the javafx layout object which represents what
     * the user can see and interact with.
     */
    public Region view;

    /**
     * A list holding all of the calculator variables for the calculator.
     */
    public ArrayList<CalcVarBase> calcVars;

    /**
     * Default (and only) constructor for a calculator.
     * @param name              The name of the calculator. This will be displayed in the selection grid.
     * @param description       The description for the calculator. This will be displayed in the selection grid.
     * @param iconImagePath     Path to the image you wish to be displayed in the selection grid for this calculator.
     * @param categoryTree      An array of strings corresponding to the branch you wish this calculator to be inserted into on the category tree.
     * @param tags              Relevant word-based tags for this calculator, to be used when searching.
     */
    public Calculator(
            String name,
            String description,
            String iconImagePath,
            String[] categoryTree,
            String[] tags) {

        this.name = name;
        this.description = description;

        //========== CATEGORY ==========//

        this.categoryTree = categoryTree;

        //========== TAGS ==========//

        this.tags = tags;

        //========== SELECTION GRID ICON ==========//

        this.iconImagePath = iconImagePath;

        //========== MISC. ==========//

        // Initialise empty dictionary for the calculator variables
        // (these are not passed into the constructor for clarity reasons)
        this.calcVars = new ArrayList<CalcVarBase>();
    }

    /**
     * This finds all the dependencies and dependants for all calculator variables,
     * and populates the Dependancies and dependants lists for each. Must be called after all
     * variables have been added to the calcVars List.
     */
    protected void findDependenciesAndDependants() {

        System.out.println("findDependenciesAndDependants() called for calculator \"" + this.name + "\".");

        ArrayList<CalcVarBase> dependencyList = new ArrayList<CalcVarBase>();

        /*EventHandler eventHandler = (object sender, EventArgs e) => {
            CalcVarBase calcVar = (CalcVarBase)sender;
            //Console.WriteLine("CalcVar \"" + calcVar.name + "\" was read.");
            dependencyList.Add(calcVar);
        };*/

        // Attach event handlers onto the read-of-value for each calculator variable,
        // and also disable updating of the textboxes when we call Calculate().
        for (CalcVarBase calcVar : this.calcVars) {
            //calcVar.RawValueRead += eventHandler;
            calcVar.addRawValueReadListener((calcVarBase) -> {
                System.out.println("CalcVar \"" + calcVar.name + "\" was read.");
                dependencyList.add(calcVar);
            });
            calcVar.disableUpdate = true;
        }


        for(CalcVarBase calcVar : this.calcVars) {
            System.out.println("Finding dependencies for CalcVar \"" + calcVar.name + "\".");
            dependencyList.clear();

            if (calcVar.equationFunction != null) {
                // Invoke the equation, this will fire ReadRawValue events
                // for all variables it needs, and add to the dependancy list
                // DO NOT call pair.Value.Calculate() directly!
                calcVar.equationFunction.execute();

                // Go through the dependency list, and add this calculator variable to each one's DEPENDANTS list
                for (int j = 0; j < dependencyList.size(); j++) {
                    System.out.println("\"" + dependencyList.get(j).name + "\" is a dependency of \"" + calcVar.name + "\".");
                    dependencyList.get(j).dependants.add(calcVar);
                }
            }
            else {
                System.out.println("equationFunction was null, so \"" + calcVar.name + "\" has no dependancies.");
            }

            System.out.println("Finished finding dependencies for CalcVar \"" + calcVar.name + "\".");

            // Save the dependencies to the calculator variable
            calcVar.dependencies = dependencyList;
        }

        // Now remove event handler that we added at start of function, and
        // re-enable updates for all variables
        for(CalcVarBase calcVar : this.calcVars) {
            //calcVar.RawValueRead -= eventHandler;
            calcVar.disableUpdate = false;

            System.out.println("dependants of \"" + calcVar.name + "\" are:");

            for (int j = 0; j < calcVar.dependants.size(); j++) {
                System.out.println("\t\"" + calcVar.dependants.get(j).name + "\"");
            }
        }
    }

    /**
     * Performs validation on every numerical calculator variable, and updates UI accordingly.
     * Useful for bringing calculator into a default state.
     */
    public void validateAllVariables() {
        System.out.println("validateAllVariables() called for calculator \"" + this.name + "\".");
        for(CalcVarBase calcVar : this.calcVars) {
            // We can only validate numerical calculator variables
            // (this may change in the future)
            if (calcVar instanceof CalcVarNumerical) {
                CalcVarNumerical calcVarNumerical = (CalcVarNumerical)calcVar;
                calcVarNumerical.Validate();
            }
        }
    }

    /**
     * Forces all output variables in the calculator to re-calculate. Useful for bringing the calculator
     * into a default state once all the variables have been set up correctly.
     */
    public void recalculateAllOutputs() {
        System.out.println("recalculateAllOutputs() called for calculator \"" + this.name + "\".");
        for(CalcVarBase calcVar : this.calcVars) {
            // We only want to call Calculate() on outputs
            if (calcVar.direction == CalcVarDirections.Output) {
                // Call calculate, this will update the textboxes automatically
                calcVar.Calculate();
            }
        }
    }

    /**
     * Call this to re-calculate the direction for each calculator variable, and then update the UI
     * based upon this result.
     */
    public void refreshDirectionsAndUpdateUI() {
        System.out.println("refreshDirectionsAndUpdateUI() called for calculator \"" + this.name + "\".");
        for(CalcVarBase calcVar : this.calcVars) {
            calcVar.direction = calcVar.directionFunction.execute();
            calcVar.updateUIFromDirection();
        }
    }

}

