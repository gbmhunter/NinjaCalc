using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
// Debug.Assert
using System.Diagnostics;

namespace NinjaCalc.Core {
    class CalcNumberVar : CalcVar {


        private ComboBox unitsComboBox;
        private List<NumberUnit> units;

        public CalcNumberVar(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,
            RadioButton ioRadioButton,
            Dictionary<string, CalcVar> calcVars,
            Func<Dictionary<string, CalcVar>, double> equation,
            NumberUnit[] units,
            double defaultRawValue)
            : base(
                name,
                calcValTextBox,
                ioRadioButton,
                calcVars,
                equation,
                defaultRawValue) {

            // Internally save reference to the units combo box
            this.unitsComboBox = unitsComboBox;

            // Attach event handler to the selection change for the units combo box
            this.unitsComboBox.SelectionChanged += this.UnitsComboBox_SelectionChanged;

            // Initialise empty units list
            this.units = new List<NumberUnit>();

            // Internally save the units
            // Note we can't implictly convert from an array of NumberUnit to a List<NumberUnit>
            foreach(var unit in units) {
                this.units.Add(unit);
            }
                
        }

        /// <summary>
        /// Event handler for when the calculator variables textbox (e.g. it's value) changes. Assigned
        /// to the .TextChanged event of the TextBox in this class's constructor. Should only be called
        /// when this calculator variable is an input.
        /// </summary>
        /// <param name="sender">Should be of type TextBox.</param>
        /// <param name="e"></param>
        public override void TextBoxChanged(object sender, EventArgs e) {
            // Make sure this event only fires when this variable is an input!
            Debug.Assert(this.Direction == Direction_t.Input);

            TextBox textBox = (TextBox)sender;
            Console.WriteLine("TextBox \"" + textBox.Name + "\" changed. Text now equals = \"" + textBox.Text + "\".");

            // Save this to the raw value
            // (bypass setting the property as we don't want to update the TextBox)
            // This could throw a System.FormatException if the value can't be converted into a double,
            // for example, if it had letters (a2) or was just a negative sign (-).
            try {
                this.rawVal = Convert.ToDouble(textBox.Text);
            }
            catch (System.FormatException exception) {
                this.rawVal = Double.NaN;
            }

            this.Validate();

            // We need to re-calculate any this calculator variables dependants, if they are outputs
            for (int i = 0; i < this.dependants.Count; i++) {
                if (this.dependants[i].Direction == Direction_t.Output) {
                    this.dependants[i].Calculate();
                }
            }
        }

        public void UnitsComboBox_SelectionChanged(object sender, EventArgs e) {
            Console.WriteLine("UnitsComboBox_Changed() called.");
        }
    }


}
