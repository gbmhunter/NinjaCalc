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
    private String name;
    public String getName() { return this.name; }
    public void setName(String value) { this.name = value; }

    //===============================================================================================//
    //============================================ EVENTS ===========================================//
    //===============================================================================================//

    //================== rawValueRead EVENT ==================//

    /**
     * Keeps track of all registered listeners to the calculator variable's value being read.
     */
    protected List<ICalcVarBaseCallback> valueReadListeners = new ArrayList<ICalcVarBaseCallback>();

    /**
     * Use this to subscribe to the calculator's raw value changing.
     * @param toAdd     The listener to add.
     */
    public void addValueReadListener(ICalcVarBaseCallback toAdd) {
        valueReadListeners.add(toAdd);
    }

    protected void onValueRead() {
        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback listener : valueReadListeners)
            listener.execute(this);
    }

    //================== valueChanged EVENT ==================//

    private List<ICalcVarBaseCallback> valueChangedListeners = new ArrayList<ICalcVarBaseCallback>();

    public void addValueChangedListener(ICalcVarBaseCallback toAdd) {
        valueChangedListeners.add(toAdd);
    }

    /**
     * Call when the calculator variable's has changed to notify all listeners.
     */
    protected void onValueChanged() {
        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback listener : valueChangedListeners)
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

    /**
     * Holds a list of all the validation results for this variables. This will be populated by the validate() method.
     */
    public ArrayList<CalcValidationResult> validationResults;


    /**
     * Stores the worst validation result for this calculator variable.
     * This variable controls the colour of various parts of the associated UI elements for this variable
     * (e.g. the border colour for a numerical variable in a TextField).
     */
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

    /**
     * Stores the direction of this variable (e.g. whether it is an input or an output variable).
     * Make private?
     */
    public CalcVarDirections direction;
    public CalcVarDirections getDirection() {
        return this.direction;
    }

    public IDirectionFunction directionFunction;


    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    /**
     * Default constructor for CalcVarBase.
     */
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



    public IEquationFunction getEquationFunction() { return equationFunction; }
    public void setEquationFunction(IEquationFunction equationFunction) { this.equationFunction = equationFunction; }

    public IDirectionFunction getDirectionFunction() { return directionFunction; }
    public void setDirectionFunction(IDirectionFunction directionFunction) { this.directionFunction = directionFunction; }

    public ArrayList<Validator> getValidators() { return validators; }
    public void setValidators(ArrayList<Validator> validators) { this.validators = validators; }

    //===============================================================================================//
    //======================================= GENERAL METHODS =======================================//
    //===============================================================================================//

    /**
     * Forces all calculator variables which are dependent on this one (and also currently outputs)
     * to re-calculate their value (which will also cause their displayed values on the UI to
     * update).
     */
    public void forceDependantOutputsToRecalculate() {
        //System.out.println(getClass().getName() + ".forceDependantOutputsToRecalculate() called.");
        // We need to re-calculate any this calculator variables dependants, if they are outputs
//        for (int i = 0; i < this.dependants.size(); i++) {
//            if (this.dependants.get(i).direction == CalcVarDirections.Output) {
//                //System.out.println("Calling calculate() on variable \"" + this.dependants.get(i).name + "\".");
//                this.dependants.get(i).calculate();
//            }
//        }
        for (CalcVarBase dependent : this.dependants) {
            if (dependent.direction == CalcVarDirections.Output) {
                //System.out.println("Calling calculate() on variable \"" + this.dependants.get(i).name + "\".");
                dependent.calculate();
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

    /**
     * All non-abstract variables classes must implement this method which re-calculates this
     * calculator variables value, based on it's equation function.
     */
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
