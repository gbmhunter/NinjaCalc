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

namespace NinjaCalc
{

    public enum Direction_t {
        Input,
        Output
    }


    /// <summary>
    /// Encapsulates a single variable in a NinjaCalc calculator. Stores the variable name, it's equation, it's state (input or output).
    /// </summary>
    public class CalcVar
    {
        //===============================================================================================//
        //==================================== VARIABLES AND PROPERTIES =================================//
        //===============================================================================================//

        private double rawVal;

        /// <summary>
        /// Holds the "raw" (unscaled, unrounded) value for this variable.
        /// </summary>
        public double RawVal
        {
            get
            {
                // Do we want to do something here so we can work out
                // the dependants
                if (RawValueRead != null)
                {
                    RawValueRead(this, EventArgs.Empty);
                }

                return this.rawVal;
            }

            set
            {
                this.rawVal = value;
                // Should we also update the text box here?
                if(!this.DisableUpdate){
                    this.calcValTextBox.Text = this.rawVal.ToString();
                }
            }
        }

        public event EventHandler RawValueRead;

        private String name;

        public String Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }

        private TextBox calcValTextBox;
        private RadioButton ioRadioButton;
        
        private Dictionary<string, CalcVar> calcVars;

        private Func<Dictionary<string, CalcVar>, double> equation;

        private Direction_t direction;

        public Direction_t Direction
        {
            get
            {
                return this.direction;
            }
            set
            {
                this.direction = value;
                if(value == Direction_t.Output) {
                    // If this calc variable is being set as an output,
                    // we need to disable the input text box and check the radio button
                    this.calcValTextBox.IsEnabled = false;
                    this.ioRadioButton.IsChecked = true; 
                } else if(value == Direction_t.Input)
                {
                    this.calcValTextBox.IsEnabled = true;
                    this.ioRadioButton.IsChecked = false; 
                }
                
            }
        }

        private List<CalcVar> dependencies;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVar> Dependencies
        {
            get
            {
                return this.dependencies;
            }
            set
            {
                this.dependencies = value;
            }
        }

        private List<CalcVar> dependants;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVar> Dependants
        {
            get
            {
                return this.dependants;
            }
            set
            {
                this.dependants = value;
            }
        }

        private bool disableUpdate;

        /// <summary>
        /// Set to true to disable the updating of the text box when this CalcVar's Calculate() method
        /// is called.
        /// </summary>
        public bool DisableUpdate
        {
            get
            {
                return this.disableUpdate;
            }
            set
            {
                this.disableUpdate = value;
            }
        }

        private List<Validator> validators;

        private ValidationResult_t validationResult;

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
            RadioButton ioRadioButton,
            Dictionary<string, CalcVar> calcVars,
            Func<Dictionary<string, CalcVar>, double> equation,
            double defaultRawValue)
        {

            this.name = name;

            this.calcValTextBox = calcValTextBox;
            // Setup event handler for when textbox text changes
            this.calcValTextBox.TextChanged += this.TextBoxChanged;

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

            // Assign the default raw value
            this.RawVal = defaultRawValue;
            //this.calcValTextBox.Text = this.rawVal.ToString();

            
        }
        
        
        /// <summary>
        /// This should only be called for output variables.
        /// </summary>
        public void Calculate()
        {
            Console.WriteLine("CalcVar.Calculate() called for \"" + this.Name + "\".");

            // Invoke the provided equation function,
            // which should return the raw value for this calculator variable
            this.RawVal = equation.Invoke(this.calcVars);

            this.Validate();
        }

        /// <summary>
        /// Event handler for when the calculator variables textbox (e.g. it's value) changes. Assigned
        /// to the .TextChanged event of the TextBox in this class's constructor.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void TextBoxChanged(object sender, EventArgs e)
        {
            //Debug.Assert(this.Direction == Direction_t.Input);

            TextBox textBox = (TextBox)sender;
            Console.WriteLine("TextBox \"" + textBox.Name + "\" changed. Text now equals = \"" + textBox.Text + "\".");

            // Save this to the raw value
            // (bypass setting the property as we don't want to update the TextBox)
            // This could throw a System.FormatException if the value can't be converted into a double,
            // for example, if it had letters (a2) or was just a negative sign (-).
            try
            {
                this.rawVal = Convert.ToDouble(textBox.Text);
            }
            catch(System.FormatException exception)
            {
                this.rawVal = Double.NaN;
            }

            this.Validate();

            // We need to re-calculate any this calculator variables dependants, if they are outputs
            for (int i = 0; i < this.dependants.Count; i++)
            {
                if (this.dependants[i].Direction == Direction_t.Output)
                {
                    this.dependants[i].Calculate();
                }
            }


        }

        public void RadioButtonChanged(object sender, EventArgs e)
        {
            RadioButton radioButton = (RadioButton)sender;
            Console.WriteLine("RadioButtonChanged() event called for \"" + radioButton.Name + "\".");

            if(radioButton.IsChecked == true)
            {
                this.Direction = Direction_t.Output;
            }
            else
            {
                this.Direction = Direction_t.Input;
            }
            
        }

        /// <summary>
        /// Use this to add a specific validator to this calculator variable.
        /// </summary>
        public void AddValidator(Validator validator)
        {
            // Add provided validator to the internal list
            this.validators.Add(validator);
        }

        /// <summary>
        /// Call this to perform validation on this calculator variable. Will run all validators
        /// that have been added through calling AddValidator().
        /// </summary>
        public void Validate()
        {
            Console.WriteLine("Validate() called from \"" + this.Name + "\" with this.RawVal = \"" + this.RawVal.ToString() + "\".");

            ValidationResult_t worstValidationResult = ValidationResult_t.Ok;

            // Validate this value (if validators are provided)
            foreach (var validator in this.validators)
            {
                // Run the validation function
                ValidationResult_t validationResult = validator.ValidationFunction.Invoke(this.RawVal);

                // Logic for keeping track of the worst validation resut
                // (error worse than warning worse than ok)
                if (validationResult == ValidationResult_t.Warning && worstValidationResult == ValidationResult_t.Ok)
                {
                    worstValidationResult = ValidationResult_t.Warning;
                }
                else if (validationResult == ValidationResult_t.Error)
                {
                    worstValidationResult = ValidationResult_t.Error;
                }
            }

            Console.WriteLine("Validation result was \"" + worstValidationResult.ToString() + "\".");

            // Save this to the internal variable
            this.validationResult = worstValidationResult;
        }
    }
}
