package Core;


import java.util.*;




public abstract class CalcVarBase {

    public String Name;

    /// <summary>
    /// The possible directions are numerical calculator variable can be.
    /// </summary>
    public enum Directions {
        Input,
        Output
    }


    /// <summary>
    /// Use this to listen and act on the raw value being read from this calculator variable.
    /// </summary>
    //public event EventHandler RawValueRead;
    private List<ICalcVarBaseCallback> rawValueReadListeners = new ArrayList<ICalcVarBaseCallback>();

    public void addRawValueReadListener(ICalcVarBaseCallback toAdd) {
        rawValueReadListeners.add(toAdd);
    }

    protected void OnRawValueRead() {
        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback hl : rawValueReadListeners)
            hl.execute(this);
    }

    /// <summary>
    /// Use this to subscribe to the calculator variables "raw" value changing.
    /// </summary>
    /*public event EventHandler RawValueChanged;

    protected virtual void OnRawValueChanged(EventArgs e) {
        EventHandler handler = RawValueChanged;
        if (handler != null) {
            handler(this, e);
        }
    }*/

    private List<ICalcVarBaseCallback> rawValueChangedListeners = new ArrayList<ICalcVarBaseCallback>();

    public void addRawValueChangedListener(ICalcVarBaseCallback toAdd) {
        rawValueChangedListeners.add(toAdd);
    }

    protected void OnRawValueChanged() {
        // Notify everybody that may be interested.
        for (ICalcVarBaseCallback hl : rawValueChangedListeners)
            hl.execute(this);
    }


    /// <summary>
    /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
    /// but rather once all calculator variables and their equations have been added to the calculator.
    /// </summary>
    public ArrayList<CalcVarBase> Dependencies;

    /// <summary>
    /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
    /// but rather once all calculator variables and their equations have been added to the calculator.
    /// </summary>
    public ArrayList<CalcVarBase> Dependants;

    /// <summary>
    /// Set to true to disable the updating of the text box when this CalcVar's Calculate() method
    /// is called.
    /// </summary>
    public Boolean DisableUpdate;

    /// <summary>
    /// Gets and sets the equation function which is used to calculate the value
    /// of this calculator variable when it is an output.
    /// </summary>
    public IEquationFunction equationFunction;

    public Directions direction;

    public IDirectionFunction directionFunction;



    public void Calculate() {
        // Default implementation is to just return
        // (and do nothing)
        System.out.println("WARNING: BaseCalcVar.Calculate() called, this is an empty function.");
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
        this.Name = name;

        // Initialise empty lists to keep track of this calculators dependencies
        // and dependants
        this.Dependencies = new ArrayList<CalcVarBase>();
        this.Dependants = new ArrayList<CalcVarBase>();

        // Save equation function
        this.equationFunction = equationFunction;

        // Save direction function
        this.directionFunction = directionFunction;
    }


    public void ForceDependantOutputsToRecalculate() {
        System.out.println("ForceDependantOutputsToRecalculate() called.");
        // We need to re-calculate any this calculator variables dependants, if they are outputs
        for (int i = 0; i < this.Dependants.size(); i++) {
            if (this.Dependants.get(i).direction == Directions.Output) {
                System.out.println("Calling Calculate() on variable \"" + this.Dependants.get(i).Name + "\".");
                this.Dependants.get(i).Calculate();
            }
        }
    }

    public abstract void UpdateUIFromDirection();

}
