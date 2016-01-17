using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc.Core {

    /// <summary>
    /// A specialisation of a generic CalcVar which is for variables which are always
    /// an input. Removes the ability to add a input/output radio button and provide
    /// an equation.
    /// </summary>
    class CalcVarNumericalInput : CalcVarNumerical {

        /// <summary>
        /// Base constructor, which requires all possible arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="calcValTextBox"></param>
        /// <param name="unitsComboBox"></param>
        /// <param name="units"></param>
        /// <param name="defaultRawValue"></param>
        public CalcVarNumericalInput(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,                                    
            NumberUnit[] units,
            int numDigitsToRound,
            System.Nullable<double> defaultRawValue)
            : base(
            name,
            calcValTextBox,
            unitsComboBox,
            null,            
            null,
            units,           
            numDigitsToRound,
            Directions.Input,            
            defaultRawValue) {

        }      

    }
}
