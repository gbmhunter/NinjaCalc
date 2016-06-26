package Core.CalcVar.Generic;

import Core.CalcVar.CalcVarBase;
import Core.CalcVar.CalcVarDirections;

/**
 * Created by gbmhu on 2016-06-26.
 */
public class CalcVarGeneric<E> extends CalcVarBase {

    /**
     * The "value" for this calculator variable. This is essentially the text string that this calculator variable
     * is currently equal to.
     */
    private E value;
    public E getValue() {
        // Notify any listeners that the value of this calculator variable is being read.
        onValueRead();
        return value;
    };
    public void setValue(E value) {
        this.value = value;
        // Notify any listeners
        onValueChanged();
    };

    @Override
    public void calculate() {
        System.out.println("CalcVarText.calculate() called for \"" + this.getName() + "\".");

        // Make sure this event only fires when this calculator variable is an output!
        if(this.getDirection() != CalcVarDirections.Output){
            throw new RuntimeException("calculate() was called for calculator variable " + this.getName() + " which is NOT an output.");
        }

        // This check is for output calculator variables which don't use the equation function to define
        // what there value is
        if(this.equationFunction == null) {
            return;
        }

        // Invoke the provided equation function,
        // which should return a String for this calculator variable
        value = (E)this.equationFunction.execute();

        // Validate this new value
        this.validate();

        // Force all calculator variables which are dependent on this one to recalculate.
        this.forceDependantOutputsToRecalculate();
        this.forceVariablesWithDependantValidatorsToRevalidate();
    }

    @Override
    public void updateUIFromDirection() {

    }

    @Override
    public void validate() {

    }


}
