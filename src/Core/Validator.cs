using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core
{

    /// <summary>
    /// Encapsulates a validation result.
    /// </summary>
    public class ValidationLevel
    {
        string name;
        string colour;

        public ValidationLevel(string name, string colour)
        {
            this.name = name;
            this.colour = colour;
        }
    }

    /// <summary>
    /// The different ValidationLevels a validation function can return.
    /// </summary>
    public class ValidationLevels
    {
        public static readonly ValidationLevel Ok;
        public static readonly ValidationLevel Warning;
        public static readonly ValidationLevel Error;

        static ValidationLevels()
        {
            Ok = new ValidationLevel("ok", "green");
            Warning = new ValidationLevel("warning", "orange");
            Error = new ValidationLevel("error", "red");
        }
    }

    /// <summary>
    /// Used to encapsulate a single validator for a calculator variable. Designed to be added to the CalcVar object.
    /// </summary>
    public class Validator
    {
        private Func<double, ValidationLevel> validationFunction;
        /// <summary>
        /// Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
        /// </summary>
        public Func<double, ValidationLevel> ValidationFunction
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
        public Validator(Func<double, ValidationLevel> validationFunction)
        {
            // Save function internally
            this.validationFunction = validationFunction;
        }

        /// <summary>
        /// Factory function. Returns a validator which will give an error if the calculator variable is not a valid number (NaN does not count).
        /// </summary>
        /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
        public static Validator IsNumber()
        {
            return new Validator(
                (value) =>
                {
                    //return ValidationResult_t.Error;
                    if (Double.IsNaN(value))
                    {
                        return ValidationLevels.Error;
                    }
                    else
                    {
                        return ValidationLevels.Ok;
                    }
                });
        }
    }
}
