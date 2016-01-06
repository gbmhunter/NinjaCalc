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
        private List<CalcVar> calcVars;
        private Func<List<CalcVar>, double> equation;

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
        
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="calcValTextBox">The text box that displays this calculator variables value.</param>
        /// <param name="equation">An expression tree of a function which calculates this variables value from the other variables.</param>
        public CalcVar(String name, TextBox calcValTextBox, RadioButton ioRadioButton, List<CalcVar> calcVars, Func<List<CalcVar>, double> equation)
        {

            this.name = name;

            this.calcValTextBox = calcValTextBox;
            //this.calcValTextBox.TextChanged += 

            this.ioRadioButton = ioRadioButton;

            this.calcVars = calcVars;

            // We need to work out all the dependents of this variable somehow!
            this.equation = equation;    
            
                 

        }
        
        

        public void Calculate()
        {
            // Invoke the provided equation function,
            // which should return the raw value for this calculator variable
            this.rawVal = equation.Invoke(this.calcVars);
        }

    }
}
