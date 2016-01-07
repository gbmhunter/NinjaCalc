using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
// Debug.Assert
using System.Diagnostics;

using System.Collections.ObjectModel;

namespace NinjaCalc.Core {


    class CalcNumberVar : CalcVar {

        private double dispVal;
        public double DispVal {
            get {
                return this.dispVal;
            }
            set {
                Console.WriteLine("DispVal.set() called.");
                this.dispVal = value;
                // We also need to update the raw value!
                this.RawVal = this.dispVal / this.selUnit.Multiplier;
            }
        }

        private ComboBox unitsComboBox;

        private List<NumberUnit> units;
        public List<NumberUnit> Units {
            get {
                return this.units;
            }
            set {
                this.units = value;
                // We also 
            }
        }

        /// <summary>
        /// Do NOT access this from anything put the SelectionChanged event handler for
        /// the ComboBox.
        /// </summary>
        private NumberUnit selUnit;

        /// <summary>
        /// Gets and sets the selected unit for this calculator variable. If set, it will also update
        /// the associated ComboBox on the UI.
        /// </summary>
        public NumberUnit SelUnit {
            get {
                return this.selUnit;
            }
            set {
                this.selUnit = value;
                // Anytime this is set, also update selected value in combobox
                this.unitsComboBox.SelectedItem = this.selUnit;
            }
        }

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
            NumberUnit defaultUnit = null;
            foreach(var unit in units) {
                this.units.Add(unit);     
                if(unit.Preference == NumberPreference.DEFAULT)
                {
                    defaultUnit = unit;
                }
            }
            this.unitsComboBox.ItemsSource = this.units;

            // Set current combobox selection to default unit
            if(defaultUnit != null) {
                this.SelUnit = defaultUnit;
            } else {
                this.SelUnit = this.units[0];
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

            // Need to update the selected unit, bypassing the property (otherwise
            // we will create an infinite loop)
            ComboBox units = (ComboBox)sender;
            this.selUnit = (NumberUnit)units.SelectedItem;

            Console.WriteLine("Selected unit is now \"" + this.selUnit + "\".");

            // If the variable is an input, we need to adjust the raw value, if the
            // variable is an output, we need to adjust the displayed value
            if (this.Direction == Direction_t.Input) {
                //this.RawVal = this.DispVal / 
            }
        }
    }


}
