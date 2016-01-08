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
    class CalcVarOutput : CalcVar {

        public CalcVarOutput(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,            
            //Dictionary<string, CalcVar> calcVars, 
            Func<double> equation,
            NumberUnit[] units)
            : base(
            name,
            calcValTextBox,
            unitsComboBox,
            null,
            //calcVars,
            equation,
            units,
            0.0) {

        }

    }
}
