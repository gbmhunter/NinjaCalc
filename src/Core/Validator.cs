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
        private Func<double, CalcValidationResult> validationFunction;
        /// <summary>
        /// Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
        /// </summary>
        public Func<double, CalcValidationResult> ValidationFunction {
            get {
                return this.validationFunction;
            }
            set {
                this.validationFunction = value;
            }
        }

        /// <summary>
        /// Constructor. 
        /// </summary>
        /// <param name="validationFunction">The function which will validate the calculator variable.</param>
        public Validator(Func<double, CalcValidationResult> validationFunction) {
            // Save function internally
            this.validationFunction = validationFunction;
        }

        /// <summary>
        /// Factory function. Returns a validator which will give an error if the calculator variable is not a valid number (NaN does not count).
        /// </summary>
        /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
        public static Validator IsNumber() {
            return new Validator(
                (value) => {
                    //return ValidationResult_t.Error;
                    if (Double.IsNaN(value)) {
                        return CalcValidationResults.Error;
                    }
                    else {
                        return CalcValidationResults.Ok;
                    }
                });
        }
    }
}
