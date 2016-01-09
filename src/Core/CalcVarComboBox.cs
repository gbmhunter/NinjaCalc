using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc.Core {
    public class CalcVarComboBox : CalcVarBase {

        protected string rawVal;
        /// <summary>
        /// Holds the "raw" (unscaled, unrounded) value for this variable.
        /// </summary>
        public string RawVal {
            get {
                this.OnRawValueRead(EventArgs.Empty);
                return this.rawVal;
            }
            set {
                // Only change if different
                if (this.rawVal != value) {
                    this.rawVal = value;
                    this.OnRawValueChanged(EventArgs.Empty);
                }
            }
        }

        ComboBox CalculatorComboBox {
            get;
            set;
        }

        string[] ComboBoxOptions {
            get;
            set;
        }

        public CalcVarComboBox(
            string name,
            ComboBox comboBox,
            string[] comboBoxOptions) 
            : base(
            name,
            // Equation function is not used, should
            // we be passing null here instead???
            () => 0.0)
        {

            this.CalculatorComboBox = comboBox;
            this.ComboBoxOptions = comboBoxOptions;

            // Populate combobox
            this.CalculatorComboBox.ItemsSource = this.ComboBoxOptions;

            // Set-up event handler for combo-box
            this.CalculatorComboBox.SelectionChanged += this.ComboBoxChanged;

            // Select default (make sure this is done after event handler is installed!)
            this.CalculatorComboBox.SelectedItem = this.ComboBoxOptions[0];            

        }

        void ComboBoxChanged(object sender, EventArgs e) {

            ComboBox calculatorComboBox = (ComboBox)sender;
            Console.WriteLine("ComboBoxChanged() called. Selected item is now = \"" + (string)calculatorComboBox.SelectedItem + "\".");            

            // Set the raw value, this will raise the RawValueChanged event.
            this.RawVal = (string)calculatorComboBox.SelectedItem;

            // We need to notify all dependants
            // Should these be listening to the RawValueChanged event instead???
            this.ForceDependantOutputsToRecalculate();
        }

    }
}
