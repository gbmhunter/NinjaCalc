package Core;


/// <summary>
/// Used to encapsulate a single validator for a calculator variable. Designed to be added to the CalcVar object.
/// </summary>
public class Validator {

    /// <summary>
    /// Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
    /// </summary>
    public IValidationFunctionWithValue ValidationFunction;

    /// <summary>
    /// Gets or sets the message to be displayed to the user (in a tooltip), when the validator
    /// fails with either a warning or an error.
    /// </summary>
    public String Message;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    /// <summary>
    /// Constructor which accepts a validation function with the associated calculator variables raw value
    /// as an input. Useful for creating pre-defined, simple validators.
    /// </summary>
    /// <param name="validationFunction">The function which will validate the calculator variable.</param>
    public Validator(IValidationFunctionWithValue validationFunction, String message) {
        // Save function internally
        this.ValidationFunction = validationFunction;

        // Save the message internally
        this.Message = message;
    }

    /// <summary>
    /// Constructor which accepts a validation function with no input arguments. Useful for creating custom validators.
    /// </summary>
    /// <param name="validationFunction">The function which will validate the calculator variable.</param>
    public Validator(IValidationFunction validationFunction, String message) {
        // Save function internally
        this.ValidationFunction = (value) -> {
            CalcValidationLevel validationLevel = validationFunction.execute();
            return validationLevel;
        };

        // Save the message internally
        this.Message = message;
    }


    /// <summary>
    /// Factory function. Returns a validator which will give the provided "desiredValidationResult" if
    /// the calculator variable is not a valid number (NaN does not count). If the value is a valid number,
    /// it will return "CalcValidationResults.Ok".
    /// </summary>
    /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
    public static Validator IsNumber(CalcValidationLevel desiredValidationResult) {
        return new Validator(
            (value) -> {
                //return ValidationResult_t.Error;
                if (Double.isNaN(value)) {
                    return desiredValidationResult;
                }
                else {
                    return CalcValidationLevels.Ok;
                }
            },
            "Value must be a real number.");
    }

    /// <summary>
    /// Factory function. Returns a validator which will give the provided validation result if the calculator variable is
    /// not greater than 0. If the number is greater than 0, it will return "CalcValidationResults.Ok".
    /// </summary>
    /// <returns>A validator which will give an error if the calculator variable is not a valid number.</returns>
    public static Validator IsGreaterThanZero(CalcValidationLevel desiredValidationResult) {
        return new Validator(
            (value) -> {
                //return ValidationResult_t.Error;
                if (value <= 0) {
                    return desiredValidationResult;
                }
                else {
                    return CalcValidationLevels.Ok;
                }
            },
            "Value must be positive and not equal to 0.");
    }
}
