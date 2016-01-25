package Core;


import java.util.*;

// An interface to be implemented by everyone interested in "Hello" events
interface HelloListener {
    void someoneSaidHello(CalcVarBase calcVarBase);
}


public class CalcVarBase extends Observable {

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
    private List<HelloListener> rawValueReadListeners = new ArrayList<HelloListener>();

    public void addRawValueReadListener(HelloListener toAdd) {
        rawValueReadListeners.add(toAdd);
    }

    protected void OnRawValueRead() {
        // Notify everybody that may be interested.
        for (HelloListener hl : rawValueReadListeners)
            hl.someoneSaidHello(this);
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

    private List<HelloListener> rawValueChangedListeners = new ArrayList<HelloListener>();

    public void addRawValueChangedListener(HelloListener toAdd) {
        rawValueChangedListeners.add(toAdd);
    }

    protected void OnRawValueChanged() {
        // Notify everybody that may be interested.
        for (HelloListener hl : rawValueChangedListeners)
            hl.someoneSaidHello();
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
    public IFunction Equation;

    public Directions Direction;

    public void Calculate() {
        // Default implementation is to just return
        // (and do nothing)
        System.out.println("WARNING: BaseCalcVar.Calculate() called, this is an empty function.");
        return;
    }



    public CalcVarBase(String name, IFunction equation) {
        this.Name = name;

        this.Dependencies = new ArrayList<CalcVarBase>();
        this.Dependants = new ArrayList<CalcVarBase>();

        this.Equation = equation;
    }


    public void ForceDependantOutputsToRecalculate() {
        System.out.println("ForceDependantOutputsToRecalculate() called.");
        // We need to re-calculate any this calculator variables dependants, if they are outputs
        for (int i = 0; i < this.Dependants.size(); i++) {
            if (this.Dependants.get(i).Direction == Directions.Output) {
                this.Dependants.get(i).Calculate();
            }
        }
    }

}
