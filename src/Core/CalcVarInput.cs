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
    class CalcVarInput : CalcVarNumerical {

        public CalcVarInput(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,            
            //Dictionary<string, CalcVar> calcVars,            
            NumberUnit[] units,
            double defaultRawValue)
            : base(
            name,
            calcValTextBox,
            unitsComboBox,
            null,
            //calcVars,
            null,
            units,
            defaultRawValue) {

        }

    }
}
