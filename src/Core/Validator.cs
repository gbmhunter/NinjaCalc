using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core
{

    /// <summary>
    /// The different values a validation function can return.
    /// </summary>
    public enum ValidationResult_t
    {
        Ok,
        Warning,
        Error
    }

    /// <summary>
    /// Used to encapsulate a single validator for a calculator variable. Designed to be added to the CalcVar object.
    /// </summary>
    public class Validator
    {
        private Func<double, ValidationResult_t> validationFunction;
        /// <summary>
        /// Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
        /// </summary>
        public Func<double, ValidationResult_t> ValidationFunction
        {
            get {
                return this.validationFunction;
            }
            set
            {
                this.validationFunction = value;
            }
        }

        /// <summary>
        /// Constructor. 
        /// </summary>
        /// <param name="validationFunction">The function which will validate the calculator variable.</param>
        public Validator(Func<double, ValidationResult_t> validationFunction)
        {
            // Save function internally
            this.validationFunction = validationFunction;
        }
    }
}
