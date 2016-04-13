package Core;

import java.util.*;

/**
 * The base class that all calculator variables inherit from.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public abstract class CalcVarBase {

    /**
     * The name of the calculator variable. Used when debugging.
     */
    public String name;

    /**
     * Keeps track of all registered listeners to the raw value being read.
     */
    private List<ICalcVarBaseCallback> rawValueReadListeners = new ArrayList<ICalcVarBaseCallback>();

    /**
     * Use this to subscribe to the calculator's raw value changing.
     * @param toAdd     The listener to add.
     */
    public void addRawValueReadListener(ICalcVarBaseCallback toAdd) {
        rawValueReadListeners.add(toAdd);
    }

    protected void OnRawValueRead() {
        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback listener : rawValueReadListeners)
            listener.execute(this);
    }


    private List<ICalcVarBaseCallback> rawValueChangedListeners = new ArrayList<ICalcVarBaseCallback>();

    public void addRawValueChangedListener(ICalcVarBaseCallback toAdd) {
        rawValueChangedListeners.add(toAdd);
    }

    protected void onRawValueChanged() {

        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback listener : rawValueChangedListeners)
            listener.execute(this);

    }

    /**
     * Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
     * but rather once all calculator variables and their equations have been added to the calculator.
     */
    public ArrayList<CalcVarBase> dependencies;

    /**
     * Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
     * but rather once all calculator variables and their equations have been added to the calculator.
     */
    public ArrayList<CalcVarBase> dependants;

    /**
     * Set to true to disable the updating of the text box when this CalcVar's calculate() method
     * is called.
     */
    public Boolean disableUpdate;

    /**
     * Gets and sets the equation function which is used to calculate the value
     * of this calculator variable when it is an output.
     */
    public IEquationFunction equationFunction;

    public CalcVarDirections direction;
    public CalcVarDirections getDirection() {
        return this.direction;
    }

    public IDirectionFunction directionFunction;



    public void calculate() {
        // Default implementation is to just return
        // (and do nothing)
        System.err.println("WARNING: BaseCalcVar.calculate() called, this is an empty function.");
        return;
    }


    /**
     * Constructor for CalcVarBase.
     * @param name                  The name of the calculator variable.
     * @param equationFunction      A function which calculates and returns the value that this calculator variable should be.
     * @param directionFunction     A function which determines the direction (input or output) of this calculator variable.
     */
    public CalcVarBase(String name, IEquationFunction equationFunction, IDirectionFunction directionFunction) {

        // Save the name
        this.name = name;

        // Initialise empty lists to keep track of this calculators dependencies
        // and dependants
        this.dependencies = new ArrayList<CalcVarBase>();
        this.dependants = new ArrayList<CalcVarBase>();

        // Save equation function
        this.equationFunction = equationFunction;

        // Save direction function
        this.directionFunction = directionFunction;
    }


    public void forceDependantOutputsToRecalculate() {
        //System.out.println("forceDependantOutputsToRecalculate() called.");
        // We need to re-calculate any this calculator variables dependants, if they are outputs
        for (int i = 0; i < this.dependants.size(); i++) {
            if (this.dependants.get(i).direction == CalcVarDirections.Output) {
                //System.out.println("Calling calculate() on variable \"" + this.dependants.get(i).name + "\".");
                this.dependants.get(i).calculate();
            }
        }
    }

    /**
     * All non-virtual calculator variables must implement this method which updates
     * the UI based on the current direction of the variable.
     */
    public abstract void updateUIFromDirection();

}
