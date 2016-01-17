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

    /// <summary>
    /// The possible directions are numerical calculator variable can be.
    /// </summary>
    public enum Directions {
        Input,
        Output
    }

    /// <summary>
    /// Encapsulates a single numerical variable in a NinjaCalc calculator (inherits from CalcVarBase).
    /// Stores the variable name, it's equation, it's state (input or output).
    /// Is further inherited by specialised input and output variable classes.
    /// </summary>
    public class CalcVarNumerical : CalcVarBase {

        //===============================================================================================//
        //==================================== VARIABLES AND PROPERTIES =================================//
        //===============================================================================================//

        //============================================= RAW VAL =========================================//

        protected double rawVal;

        /// <summary>
        /// Gets or sets the the "raw" (unscaled, unrounded) value for this variable. Setting will cause the displayed value, textbox, and all
        /// dependant variables to update.
        /// </summary>
        public double RawVal {
            get {
                this.OnRawValueRead(EventArgs.Empty);

                return this.rawVal;
            }

            set {
                // Only set if new value is different from current
                if (this.rawVal != value) {
                    this.rawVal = value;
                    // Fire the RawValueChanged event handler
                    this.OnRawValueChanged(EventArgs.Empty);
                }
            }
        }

        private event EventHandler RawValueChanged;

        /// <summary>
        /// Fires the RawValueChanged event handler (as long as it's not null).
        /// </summary>
        /// <param name="e">The event arguments you wish to provide to listening methods.</param>
        public virtual void OnRawValueChanged(EventArgs e) {
            EventHandler handler = RawValueChanged;
            if (handler != null) {
                handler(this, e);
            }
        }

        //============================================ DISP VAL =========================================//

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

        private TextBox calcValTextBox;
        private RadioButton ioRadioButton;

        //private Dictionary<string, CalcVar> calcVars;

        private Directions direction;

        public override Directions Direction {
            get {
                return this.direction;
            }
            set {
                this.direction = value;
                if (value == Directions.Output) {
                    // If this calc variable is being set as an output,
                    // we need to disable the input text box, check the radio button,
                    // and remove the event handler
                    //this.calcValTextBox.IsEnabled = false;
                    this.calcValTextBox.IsReadOnly = true;
                    this.calcValTextBox.BorderThickness = new System.Windows.Thickness(0);

                    this.calcValTextBox.TextChanged -= this.TextBoxChanged;
                    if (this.ioRadioButton != null) {
                        this.ioRadioButton.IsChecked = true;
                    }

                }
                else if (value == Directions.Input) {
                    //this.calcValTextBox.IsEnabled = true;
                    this.calcValTextBox.IsReadOnly = false;
                    this.calcValTextBox.BorderThickness = new System.Windows.Thickness(3);

                    this.calcValTextBox.TextChanged += this.TextBoxChanged;
                    if (this.ioRadioButton != null) {
                        this.ioRadioButton.IsChecked = false;
                    }
                }

            }
        }

        private List<Validator> validators;

        public List<CalcValidationResult> ValidationResults;

        private CalcValidationLevel validationResult;

        /// <summary>
        /// Gets or sets the validation result for this calculator variable.
        /// Will also change the border colour of the associated text box.
        /// </summary>
        public CalcValidationLevel WorstValidationLevel {
            get {
                return this.validationResult;
            }
            set
            {
                this.validationResult = value;
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

        public int NumDigitsToRound;

        //===============================================================================================//
        //========================================== CONSTRUCTORS =======================================//
        //===============================================================================================//

        /// <summary>
        /// Base constructor. Requires all possible arguments.
        /// </summary>
        /// <param name="calcValTextBox">The text box that displays this calculator variables value.</param>
        /// <param name="equation">An expression tree of a function which calculates this variables value from the other variables.</param>
        /// <param name="defaultRawValue">Default number for raw value to be set to. Can also be set to null, in which case the displayed text will be empty.</param>
        public CalcVarNumerical(
            String name,
            TextBox calcValTextBox,
            ComboBox unitsComboBox,
            RadioButton ioRadioButton,            
            Func<double> equation,
            NumberUnit[] units,     
            int numDigitsToRound,
            Directions defaultDirection,
            System.Nullable<double> defaultRawValue) : base(name, equation) {

            this.calcValTextBox = calcValTextBox;            
            // The next line sets the delay before the tooltip is shown for the textboxes.
            // The delay (2nd argument) is in milli-seconds
            ToolTipService.SetInitialShowDelay(this.calcValTextBox, 50);
            // We want to show the tooltip for disabled textboxes (textboxes belonging
            // to output calculator variables are disabled)
            ToolTipService.SetShowOnDisabled(this.calcValTextBox, true);      

            this.ioRadioButton = ioRadioButton;
            // Setup event handlers. Note that Checked and Unchecked have their own handlers. In this
            // case we point them to the same handler function and inspect state there.
            // Note that the radio button is optional, and could be null!
            if (this.ioRadioButton != null) {
                this.ioRadioButton.Checked += this.RadioButtonChanged;
                this.ioRadioButton.Unchecked += this.RadioButtonChanged;
            }

            // Initialise empty validators list
            this.validators = new List<Validator>();

            // Initialise empty validation results list
            this.ValidationResults = new List<CalcValidationResult>();

            // Setup default direction
            this.Direction = defaultDirection;

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

            this.NumDigitsToRound = numDigitsToRound;

            // Assign the default raw value
            if (defaultRawValue.HasValue) {
                this.rawVal = defaultRawValue.Value;
                this.dispVal = this.rawVal * this.selUnit.Multiplier;
                this.calcValTextBox.Text = this.dispVal.ToString();
            }
            else {
                // Provided default value was null, so lets make
                // the textbox empty
                this.rawVal = Double.NaN;
                this.dispVal = Double.NaN;
                this.calcValTextBox.Text = "";
            }           

            // Install event handlers
            this.RawValueChanged += (sender, EventArgs) => {
                // Update displayed value
                this.dispVal = this.rawVal * this.selUnit.Multiplier;
                // Update textbox
                this.calcValTextBox.Text = this.dispVal.ToString();
            };
            

        }

        //===============================================================================================//
        //============================================ METHODS ==========================================//
        //===============================================================================================//

        /// <summary>
        /// This should only be called for output variables.
        /// </summary>
        public override void Calculate() {
            // Make sure this event only fires when this calculator variable is an output!
            Debug.Assert(this.Direction == Directions.Output);

            Console.WriteLine("CalcVar.Calculate() called for \"" + this.Name + "\".");

            // Invoke the provided equation function,
            // which should return the raw value for this calculator variable
            this.rawVal = this.Equation.Invoke();
            this.dispVal = this.rawVal / this.selUnit.Multiplier;
            this.calcValTextBox.Text = this.dispVal.ToString();

            // Validation is done in the TextBoxChanged event handler
            this.Validate();

            this.ForceDependantOutputsToRecalculate();
        }

        public void RadioButtonChanged(object sender, EventArgs e) {
            RadioButton radioButton = (RadioButton)sender;
            Console.WriteLine("RadioButtonChanged() event called for \"" + radioButton.Name + "\".");

            if (radioButton.IsChecked == true) {
                this.Direction = Directions.Output;
            }
            else {
                this.Direction = Directions.Input;
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
        /// that have been added through calling AddValidator(), and populate ValidationResults with the
        /// results. Also updates UI based on these results.
        /// </summary>
        public void Validate() {
            Console.WriteLine("Validate() called from \"" + this.Name + "\" with this.RawVal = \"" + this.RawVal.ToString() + "\".");

            // Clear the old validation results
            this.ValidationResults.Clear();

            CalcValidationLevel worstValidationResult = CalcValidationLevels.Ok;

            // Validate this value (if validators are provided)
            foreach (var validator in this.validators) {
                // Run the validation function
                CalcValidationLevel validationLevel = validator.ValidationFunction.Invoke(this.RawVal);

                // Save this validation result
                this.ValidationResults.Add(new CalcValidationResult(validationLevel, validator.Message));

                // Logic for keeping track of the worst validation resut
                // (error worse than warning worse than ok)
                if (validationLevel == CalcValidationLevels.Warning && worstValidationResult == CalcValidationLevels.Ok) {
                    worstValidationResult = CalcValidationLevels.Warning;
                }
                else if (validationLevel == CalcValidationLevels.Error) {
                    worstValidationResult = CalcValidationLevels.Error;
                }
            }

            Console.WriteLine("Validation result was \"" + worstValidationResult.ToString() + "\".");

            // Save this to the internal variable
            this.WorstValidationLevel = worstValidationResult;

            // Finally, force an update of the UI based on these validation results
            this.UpdateUIBasedOnValidationResults();
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
            Debug.Assert(this.Direction == Directions.Input);

            TextBox textBox = (TextBox)sender;
            Console.WriteLine("TextBox \"" + textBox.Name + "\" changed. Text now equals = \"" + textBox.Text + "\".");

            // Save this to the raw value
            // (bypass setting the property as we don't want to update the TextBox)
            // This could throw a System.FormatException if the value can't be converted into a double,
            // for example, if it had letters (a2) or was just a negative sign (-).
            try {
                this.dispVal = Convert.ToDouble(textBox.Text);
                this.rawVal = this.dispVal * this.selUnit.Multiplier;
            }
            catch (System.FormatException exception) {
                this.dispVal = Double.NaN;
                this.rawVal = Double.NaN;
            }

            this.Validate();

            // We need to re-calculate any this calculator variables dependants, if they are outputs
            this.ForceDependantOutputsToRecalculate();
            /*for (int i = 0; i < this.Dependants.Count; i++) {
                if (this.Dependants[i].Direction == Directions.Output) {
                    this.Dependants[i].Calculate();
                }
            }*/
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
            if (this.Direction == Directions.Input) {
                this.rawVal = this.DispVal * this.selUnit.Multiplier;
                Console.WriteLine("rawVal re-scaled to \"" + this.rawVal.ToString() + "\".");

                // Since the raw value has changed, we also need to re-validate this variable
                this.Validate();

                // We also need to force a recalculation of any dependants (which are also outputs)
                // of this variable
                this.ForceDependantOutputsToRecalculate();

            }
            else if(this.Direction == Directions.Output) {
                // Recalculate dispVal and update textbox
                // We don't need to validate again if the units are changed for an input,
                // as the actual value (raw value) does not change.
                this.dispVal = this.rawVal / this.selUnit.Multiplier;
                this.calcValTextBox.Text = this.dispVal.ToString();
            }
        }

        public void UpdateUIBasedOnValidationResults() {
            // Change the textbox's border colour
            this.calcValTextBox.BorderBrush = this.validationResult.BorderBrush;
            this.calcValTextBox.Background = this.validationResult.BackgroundBrush;

            // Build up string from all of the validators which are at the same validation
            // level as the worse one
            String validationMsg = "";
            if (this.WorstValidationLevel != CalcValidationLevels.Ok) {
                foreach (var validationResult in this.ValidationResults) {
                    // Check to see if this validation result was just as bad as the worse one
                    // (i.e. the same level of validation)
                    if (validationResult.CalcValidationLevel == this.WorstValidationLevel) {
                        validationMsg += validationResult.Message + " ";
                    }
                }
            }
            else {
                // Validation must of been o.k., so in this case we display a stock-standard message
                validationMsg = "Value is o.k.";
            }

            var toolTip = new System.Windows.Controls.Label();
            toolTip.Content = validationMsg;
            this.calcValTextBox.ToolTip = toolTip;
        }

        /// <summary>
        /// Set the selected unit for this calculator variable by passing in a unit name. If the unit can't be found in
        /// the units array, a System.ArgumentException exception will be thrown.
        /// </summary>
        /// <param name="unitName">The name (i.e. whats displayed in the combobox) of the unit you wish to be selected.</param>
        public void SetUnits(string unitName) {

            Core.NumberUnit foundUnit = null;

            foreach (var unit in this.Units) {
                if (unit.Name == unitName) {
                    foundUnit = unit;
                    break;
                }
            }

            if (foundUnit == null) {
                throw new System.ArgumentException("Unit name was not found in unit array.", "unitName");
            }

            // Valid unit in unit array found, so lets set it to the currently
            // selected unit
            this.SelUnit = foundUnit;

        }


        

    }

}
