using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc.Core {
    class InputCalcVar : CalcVar {

        public InputCalcVar(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,            
            Dictionary<string, CalcVar> calcVars,            
            NumberUnit[] units,
            double defaultRawValue)
            : base(
            name,
            calcValTextBox,
            unitsComboBox,
            null,
            calcVars,
            null,
            units,
            defaultRawValue) {

        }

    }
}
