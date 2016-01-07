using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// For easy access to brushes
using System.Windows.Media;

namespace NinjaCalc.Core {

    /// <summary>
    /// Encapsulates a validation result.
    /// </summary>
    public class CalcValidationResult {

        public string Name {
            get;
            set;
        }

        public System.Windows.Media.Brush BorderBrush {
            get;
            set;
        }

        public System.Windows.Media.Brush BackgroundBrush {
            get;
            set;
        }

        public CalcValidationResult(string name, System.Windows.Media.Brush borderBrush, System.Windows.Media.Brush backgroundBrush) {
            this.Name = name;
            this.BorderBrush = borderBrush;
            this.BackgroundBrush = backgroundBrush;
        }
    }

    /// <summary>
    /// The different ValidationLevels a validation function can return.
    /// </summary>
    public class CalcValidationResults {
        public static readonly CalcValidationResult Ok;
        public static readonly CalcValidationResult Warning;
        public static readonly CalcValidationResult Error;

        static CalcValidationResults() {
            Ok = new CalcValidationResult("ok", System.Windows.Media.Brushes.Green, (SolidColorBrush)new BrushConverter().ConvertFromString("#e5ffe5"));
            Warning = new CalcValidationResult("warning", System.Windows.Media.Brushes.Orange, (SolidColorBrush)new BrushConverter().ConvertFromString("#fff5e5"));
            Error = new CalcValidationResult("error", System.Windows.Media.Brushes.Red, (SolidColorBrush)new BrushConverter().ConvertFromString("#ffe5e5"));
        }
    }

    /// <summary>
    /// Used to encapsulate a single validator for a calculator variable. Designed to be added to the CalcVar object.
    /// </summary>
    public class Validator {

        /// <summary>
        /// Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
        /// </summary>
        public Func<double, CalcValidationResult> ValidationFunction {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the message to be displayed to the user (in a tooltip), when the validator
        /// fails with either a warning or an error.
        /// </summary>
        public string Message {
            get;
            set;
        }

        /// <summary>
        /// Constructor. 
        /// </summary>
        /// <param name="validationFunction">The function which will validate the calculator variable.</param>
        public Validator(Func<double, CalcValidationResult> validationFunction, string message) {
            // Save function internally
            this.ValidationFunction = validationFunction;

            // Save the message internally
            this.Message = message;
        }

        /// <summary>
        /// Factory function. Returns a validator which will give the provided "desiredValidationResult" if 
        /// the calculator variable is not a valid number (NaN does not count). If the value is a valid number,
        /// it will return "CalcValidationResults.Ok".
        /// </summary>
        /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
        public static Validator IsNumber(CalcValidationResult desiredValidationResult) {
            return new Validator(
                (value) => {
                    //return ValidationResult_t.Error;
                    if (Double.IsNaN(value)) {
                        return desiredValidationResult;
                    }
                    else {
                        return CalcValidationResults.Ok;
                    }
                },
                "Value must be a real number.");
        }

        /// <summary>
        /// Factory function. Returns a validator which will give the provided validation result if the calculator variable is 
        /// not greater than 0. If the number is greater than 0, it will return "CalcValidationResults.Ok".
        /// </summary>
        /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
        public static Validator IsGreaterThanZero(CalcValidationResult desiredValidationResult) {
            return new Validator(
                (value) => {
                    //return ValidationResult_t.Error;
                    if (value <= 0) {
                        return desiredValidationResult;
                    }
                    else {
                        return CalcValidationResults.Ok;
                    }
                },
                "Value must be positive and not equal to 0.");
        }
    }
}
