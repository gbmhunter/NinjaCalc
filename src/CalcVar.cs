using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc
{
    /// <summary>
    /// Encapsulates a single variable in a NinjaCalc calculator. Stores the variable name, it's equation, it's state (input or output).
    /// </summary>
    class CalcVar
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
                return this.rawVal;
            }

            set
            {
                this.rawVal = value;
                // Should we also update the text box here?
            }
        }

        TextBox calcValTextBox;
        Func<double> equation;

        
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="calcValTextBox">The text box that displays this calculator variables value.</param>
        /// <param name="equation">A function which calculates this variables values from the other variables.</param>
        public CalcVar(TextBox calcValTextBox, Func<double> equation)
        {
            this.calcValTextBox = calcValTextBox;

            // We need to work out all the dependents of this variable somehow!
            this.equation = equation;
        }

        public void Calculate()
        {
            // Invoke the provided equation function,
            // which should return the raw value for this calculator variable
            this.rawVal = equation.Invoke();
        }

    }
}
