using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
// So we can use expression trees
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
// Debug.Assert
using System.Diagnostics;

using NinjaCalc.Core;

namespace NinjaCalc {

    public enum Direction_t {
        Input,
        Output
    }

    /// <summary>
    /// Encapsulates a single variable in a NinjaCalc calculator. Stores the variable name, it's equation, it's state (input or output).
    /// Designed to be used as a base class for particular calculator variable types (e.g. number, boolean, e.t.c).
    /// </summary>
    public class CalcVar {
        //===============================================================================================//
        //==================================== VARIABLES AND PROPERTIES =================================//
        //===============================================================================================//

        protected double rawVal;

        /// <summary>
        /// Holds the "raw" (unscaled, unrounded) value for this variable.
        /// </summary>
        public double RawVal {
            get {
                // Do we want to do something here so we can work out
                // the dependants
                if (RawValueRead != null) {
                    RawValueRead(this, EventArgs.Empty);
                }

                return this.rawVal;
            }

            set {
                this.rawVal = value;                
                if (!this.DisableUpdate) {
                    this.calcValTextBox.Text = this.rawVal.ToString();
                }
            }
        }

        private double dispVal;
        public double DispVal {
            get {
                return this.dispVal;
            }
            set {
                Console.WriteLine("DispVal.set() called.");
                this.dispVal = value;
                // We also need to update the raw value!
                //this.RawVal = this.dispVal / this.selUnit.Multiplier;
            }
        }

        /// <summary>
        /// Use this to listen and act on the raw value being read from this calculator variable.
        /// </summary>
        public event EventHandler RawValueRead;

        private String name;

        public String Name {
            get {
                return name;
            }
            set {
                name = value;
            }
        }

        private TextBox calcValTextBox;
        private RadioButton ioRadioButton;

        private Dictionary<string, CalcVar> calcVars;

        private Func<Dictionary<string, CalcVar>, double> equation;
        /// <summary>
        /// Gets and sets the equation function which is used to calculate the value
        /// of this calculator variable when it is an output.
        /// </summary>
        public Func<Dictionary<string, CalcVar>, double> Equation {
            get {
                return this.equation;
            }
            set {
                this.equation = value;
            }
        }

        private Direction_t direction;

        public Direction_t Direction {
            get {
                return this.direction;
            }
            set {
                this.direction = value;
                if (value == Direction_t.Output) {
                    // If this calc variable is being set as an output,
                    // we need to disable the input text box, check the radio button,
                    // and remove the event handler
                    this.calcValTextBox.IsEnabled = false;
                    this.calcValTextBox.TextChanged -= this.TextBoxChanged;
                    this.ioRadioButton.IsChecked = true;

                }
                else if (value == Direction_t.Input) {
                    this.calcValTextBox.IsEnabled = true;
                    this.calcValTextBox.TextChanged += this.TextBoxChanged;
                    this.ioRadioButton.IsChecked = false;
                }

            }
        }

        private List<CalcVar> dependencies;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVar> Dependencies {
            get {
                return this.dependencies;
            }
            set {
                this.dependencies = value;
            }
        }

        protected List<CalcVar> dependants;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVar> Dependants {
            get {
                return this.dependants;
            }
            set {
                this.dependants = value;
            }
        }

        private bool disableUpdate;

        /// <summary>
        /// Set to true to disable the updating of the text box when this CalcVar's Calculate() method
        /// is called.
        /// </summary>
        public bool DisableUpdate {
            get {
                return this.disableUpdate;
            }
            set {
                this.disableUpdate = value;
            }
        }

        private List<Validator> validators;

        private CalcValidationResult validationResult;

        /// <summary>
        /// Gets or sets the validation result for this calculator variable.
        /// Will also change the border colour of the associated text box.
        /// </summary>
        public CalcValidationResult ValidationResult {
            get {
                return this.validationResult;
            }
            set
            {
                this.validationResult = value;
                // Change the textbox's border colour
                this.calcValTextBox.BorderBrush = this.validationResult.BorderBrush;
                this.calcValTextBox.Background = this.validationResult.BackgroundBrush;
                var toolTip = new System.Windows.Controls.Label();
                toolTip.Content = "Testing";
                this.calcValTextBox.ToolTip = toolTip;
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

        //===============================================================================================//
        //============================================ METHODS ==========================================//
        //===============================================================================================//

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="calcValTextBox">The text box that displays this calculator variables value.</param>
        /// <param name="equation">An expression tree of a function which calculates this variables value from the other variables.</param>
        public CalcVar(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,
            RadioButton ioRadioButton,
            Dictionary<string, CalcVar> calcVars,
            Func<Dictionary<string, CalcVar>, double> equation,
            NumberUnit[] units,
            double defaultRawValue) {

            this.name = name;

            this.calcValTextBox = calcValTextBox;
            // Setup event handler for when textbox text changes
            //this.calcValTextBox.TextChanged += this.TextBoxChanged;

            this.ioRadioButton = ioRadioButton;
            // Setup event handlers. Note that Checked and Unchecked have their own handlers. In this
            // case we point them to the same handler function and inspect state there.
            this.ioRadioButton.Checked += this.RadioButtonChanged;
            this.ioRadioButton.Unchecked += this.RadioButtonChanged;

            this.calcVars = calcVars;

            this.equation = equation;

            // Initialise the dependency and dependant lists
            this.dependencies = new List<CalcVar>();
            this.dependants = new List<CalcVar>();

            // Initialise empty validators list
            this.validators = new List<Validator>();

            // Default direction is an input
            this.Direction = Direction_t.Input;

            // Internally save reference to the units combo box
            this.unitsComboBox = unitsComboBox;

            // Attach event handler to the selection change for the units combo box
            this.unitsComboBox.SelectionChanged += this.UnitsComboBox_SelectionChanged;

            // Initialise empty units list
            this.units = new List<NumberUnit>();

            // Internally save the units
            // Note we can't implictly convert from an array of NumberUnit to a List<NumberUnit>
            NumberUnit defaultUnit = null;
            foreach (var unit in units) {
                this.units.Add(unit);
                if (unit.Preference == NumberPreference.DEFAULT) {
                    defaultUnit = unit;
                }
            }
            this.unitsComboBox.ItemsSource = this.units;

            // Set current combobox selection to default unit
            if (defaultUnit != null) {
                this.SelUnit = defaultUnit;
            }
            else {
                this.SelUnit = this.units[0];
            }

            // Assign the default raw value
            this.rawVal = defaultRawValue;
            this.dispVal = this.rawVal * this.selUnit.Multiplier;
            this.calcValTextBox.Text = this.dispVal.ToString();
            //this.calcValTextBox.Text = this.rawVal.ToString();

            

        }

        /// <summary>
        /// This should only be called for output variables.
        /// </summary>
        public void Calculate() {
            // Make sure this event only fires when this calculator variable is an output!
            Debug.Assert(this.Direction == Direction_t.Output);

            Console.WriteLine("CalcVar.Calculate() called for \"" + this.Name + "\".");

            // Invoke the provided equation function,
            // which should return the raw value for this calculator variable
            this.rawVal = equation.Invoke(this.calcVars);
            this.dispVal = this.rawVal / this.selUnit.Multiplier;
            this.calcValTextBox.Text = this.dispVal.ToString();

            // Validation is done in the TextBoxChanged event handler
            this.Validate();
        }

        public void RadioButtonChanged(object sender, EventArgs e) {
            RadioButton radioButton = (RadioButton)sender;
            Console.WriteLine("RadioButtonChanged() event called for \"" + radioButton.Name + "\".");

            if (radioButton.IsChecked == true) {
                this.Direction = Direction_t.Output;
            }
            else {
                this.Direction = Direction_t.Input;
            }

        }

        /// <summary>
        /// Use this to add a specific validator to this calculator variable.
        /// </summary>
        public void AddValidator(Validator validator) {
            // Add provided validator to the internal list
            this.validators.Add(validator);
        }

        /// <summary>
        /// Call this to perform validation on this calculator variable. Will run all validators
        /// that have been added through calling AddValidator().
        /// </summary>
        public void Validate() {
            Console.WriteLine("Validate() called from \"" + this.Name + "\" with this.RawVal = \"" + this.RawVal.ToString() + "\".");

            CalcValidationResult worstValidationResult = CalcValidationResults.Ok;

            // Validate this value (if validators are provided)
            foreach (var validator in this.validators) {
                // Run the validation function
                CalcValidationResult validationResult = validator.ValidationFunction.Invoke(this.RawVal);

                // Logic for keeping track of the worst validation resut
                // (error worse than warning worse than ok)
                if (validationResult == CalcValidationResults.Warning && worstValidationResult == CalcValidationResults.Ok) {
                    worstValidationResult = CalcValidationResults.Warning;
                }
                else if (validationResult == CalcValidationResults.Error) {
                    worstValidationResult = CalcValidationResults.Error;
                }
            }

            Console.WriteLine("Validation result was \"" + worstValidationResult.ToString() + "\".");

            // Save this to the internal variable
            this.ValidationResult = worstValidationResult;
        }

        /// <summary>
        /// Event handler for when the calculator variables textbox (e.g. it's value) changes. Assigned
        /// to the .TextChanged event of the TextBox in this class's constructor. Should only be called
        /// when this calculator variable is an input.
        /// </summary>
        /// <param name="sender">Should be of type TextBox.</param>
        /// <param name="e"></param>
        public void TextBoxChanged(object sender, EventArgs e) {
            // Make sure this event only fires when this variable is an input!
            Debug.Assert(this.Direction == Direction_t.Input);

            TextBox textBox = (TextBox)sender;
            Console.WriteLine("TextBox \"" + textBox.Name + "\" changed. Text now equals = \"" + textBox.Text + "\".");

            // Save this to the raw value
            // (bypass setting the property as we don't want to update the TextBox)
            // This could throw a System.FormatException if the value can't be converted into a double,
            // for example, if it had letters (a2) or was just a negative sign (-).
            try {
                this.dispVal = Convert.ToDouble(textBox.Text);
                this.rawVal = this.dispVal / this.selUnit.Multiplier;
            }
            catch (System.FormatException exception) {
                this.dispVal = Double.NaN;
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
                this.rawVal = this.DispVal * this.selUnit.Multiplier;
                Console.WriteLine("rawVal re-scaled to \"" + this.rawVal.ToString() + "\".");
                // We also need to force a recalculation of any dependants (which are also outputs)
                // of this variable
                this.ForceDependantOutputsToRecalculate();

            }
            else if(this.Direction == Direction_t.Output) {
                // Recalculate dispVal and update textbox
                this.dispVal = this.rawVal / this.selUnit.Multiplier;
                this.calcValTextBox.Text = this.dispVal.ToString();
            }
        }

        public void ForceDependantOutputsToRecalculate() {
            Console.WriteLine("ForceDependantOutputsToRecalculate() called.");
            // We need to re-calculate any this calculator variables dependants, if they are outputs
            for (int i = 0; i < this.dependants.Count; i++) {
                if (this.dependants[i].Direction == Direction_t.Output) {
                    this.dependants[i].Calculate();
                }
            }
        }
    }
}
