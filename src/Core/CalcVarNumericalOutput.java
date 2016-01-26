package Core;

import javafx.scene.control.*;

/// <summary>
/// A specialisation of a generic CalcVar which is for variables which are always
/// an output. Removes the ability to add a input/output radio button, or a default value.
/// </summary>
class CalcVarNumericalOutput extends CalcVarNumerical {

    public CalcVarNumericalOutput(
        String name,
        TextField calcValTextBox,
        ComboBox unitsComboBox,
        IEquationFunction equation,
        NumberUnit[] units,
        int numDigitsToRound,
        String helpText) {

        super(
            name,
            calcValTextBox,
            unitsComboBox,
            //null,
            //null,
            equation,
            units,
            numDigitsToRound,
            // This is always going to be an output!
            () -> Directions.Output,
            0.0,
            helpText);

        if (equation == null) {
            throw new IllegalArgumentException("The equation provided to a CalVarNumericalOutput cannot be null.");
        }


    }

}
