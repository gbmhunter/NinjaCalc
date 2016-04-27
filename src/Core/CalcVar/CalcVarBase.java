package Core.CalcVar;

import Core.*;

import java.io.Serializable;
import java.util.*;

/**
 * The base class that all calculator variables inherit from.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-23
 */
public abstract class CalcVarBase implements Serializable {

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

    protected void onRawValueRead() {
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

    /***
     * A list of all the validators that the calculator variable has.
     */
    protected ArrayList<Validator> validators;

    public ArrayList<CalcValidationResult> validationResults;

    /// <summary>
    /// Gets or sets the validation result for this calculator variable.
    /// Will also change the border colour of the associated text box.
    /// </summary>
    public CalcValidationLevel worstValidationLevel;

    /***
     * Gets populated with a list of all validators in a calculator which are dependent of this calculator variables
     * value.
     */
    public ArrayList<CalcVarBase> varsWithDependantValidators;

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


    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    protected CalcVarBase() {
        // Initialise empty lists to keep track of this calculators dependencies
        // and dependants
        this.dependencies = new ArrayList<CalcVarBase>();
        this.dependants = new ArrayList<CalcVarBase>();

        this.validators = new ArrayList<>();

        this.varsWithDependantValidators = new ArrayList<>();
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

        this.validators = new ArrayList<>();

        this.varsWithDependantValidators = new ArrayList<>();

        // Save equation function
        this.equationFunction = equationFunction;

        // Save direction function
        this.directionFunction = directionFunction;
    }

    //===============================================================================================//
    //======================================== GETTERS/SETTERS ======================================//
    //===============================================================================================//

    public String getName() { return this.name; }
    public void setName(String value) { this.name = value; }

    public IEquationFunction getEquationFunction() { return equationFunction; }
    public void setEquationFunction(IEquationFunction equationFunction) { this.equationFunction = equationFunction; }

    public IDirectionFunction getDirectionFunction() { return directionFunction; }
    public void setDirectionFunction(IDirectionFunction directionFunction) { this.directionFunction = directionFunction; }

    public ArrayList<Validator> getValidators() { return validators; }
    public void setValidators(ArrayList<Validator> validators) { this.validators = validators; }

    //===============================================================================================//
    //======================================= GENERAL METHODS =======================================//
    //===============================================================================================//




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
     * Forces all calculator variables which have registered that they have a validator that is dependent
     * on this calculator variables value to re-validate. This should be called anytime the raw-value for this
     * calculator variable changes.
     */
    protected void forceVariablesWithDependantValidatorsToRevalidate() {
        //System.out.println("CalcVarBase.forceVariablesWithDependantValidatorsToRevalidate() called for " + this.name + ".");

        for(CalcVarBase calcVar : this.varsWithDependantValidators) {
            calcVar.validate();
        }

    }

    //===============================================================================================//
    //======================================= ABSTRACT METHODS ======================================//
    //===============================================================================================//

    public abstract void calculate();

    /**
     * All non-virtual calculator variables must implement this method which updates
     * the UI based on the current direction of the variable.
     */
    public abstract void updateUIFromDirection();

    /**
     * All non-abstract calculator variable classes must implement this method which
     * "validates" the calculator variable. For example, numerical calculator variables
     * might check to see if it's value is within certain numerical bounds.
     */
    public abstract void validate();

}
