using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc.Core {

    /// <summary>
    /// A specialisation of a generic CalcVar which is for variables which are always
    /// an output. Removes the ability to add a input/output radio button, or a default value.
    /// </summary>
    class CalcVarNumericalOutput : CalcVarNumerical {

        public CalcVarNumericalOutput(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,                         
            Func<double> equation,
            NumberUnit[] units,
            int numDigitsToRound)
            : base(
            name,
            calcValTextBox,
            unitsComboBox,            
            null,           
            equation,
            units,
            numDigitsToRound,
            // This is always going to be an output!
            Directions.Output,
            0.0) {

                if (equation == null) {
                    throw new System.ArgumentException("The equation provided to a CalVarNumericalOutput cannot be null.");
                }

        }

    }
}
