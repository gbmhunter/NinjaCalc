package Core;


import Core.CalcVar.CalcVarBase;

import java.util.ArrayList;

/**
 * Used to encapsulate a single validator for a calculator variable. Designed to be added to the CalcVarNumerical object
 * via addValidator().
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public class Validator {

    ArrayList<CalcVarBase> dependencies;

    /**
     * Gets or sets the validation function which performs the validation and returns a ValidationResult_t.
     */
    public IValidationFunctionWithValue ValidationFunction;

    /**
     * Gets or sets the message to be displayed to the user (in a tooltip), when the validator
     * fails with either a warning or an error.
     */
    public String Message;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    /**
     *  Constructor which accepts a validation function with the associated calculator variables raw value
     * as an input. Useful for creating pre-defined, simple validators.
     *
     * @param validationFunction    The function which will validate the calculator variable.
     * @param message
     */
    public Validator(IValidationFunctionWithValue validationFunction, String message) {

        this.dependencies = new ArrayList<>();

        // Save function internally
        this.ValidationFunction = validationFunction;

        // Save the message internally
        this.Message = message;
    }

    /**
     * Constructor which accepts a validation function with no input arguments. Useful for creating custom validators.
     *
     * @param validationFunction    The function which will validate the calculator variable.
     * @param message
     */
    public Validator(IValidationFunction validationFunction, String message) {

        this.dependencies = new ArrayList<>();

        // Save function internally
        this.ValidationFunction = (value) -> {
            CalcValidationLevel validationLevel = validationFunction.execute();
            return validationLevel;
        };

        // Save the message internally
        this.Message = message;
    }

    public Validator(ArrayList<CalcVarBase> dependencies, IValidationFunction validationFunction, String message) {

        // Save list of dependencies
        this.dependencies = dependencies;

        // Save function internally
        this.ValidationFunction = (value) -> {
            CalcValidationLevel validationLevel = validationFunction.execute();
            return validationLevel;
        };

        // Save the message internally
        this.Message = message;
    }

    //===============================================================================================//
    //========================================= FACTORY METHODS =====================================//
    //===============================================================================================//

    /**
     * Factory method. Returns a validator which will give the provided "desiredValidationResult" if
     * the calculator variable is not a valid number (NaN does not count). If the value is a valid number,
     * it will return "CalcValidationResults.Ok".
     *
     * @param   desiredValidationResult     The desired validation result if the calculator variable is not a number.
     * @return  A validator which will give the desired validation result if the calculator variable is not a valid number.
     */
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

    /**
     * Factory function. Returns a validator which will give the provided validation result if the calculator variable is
     * not greater than 0. If the number is greater than 0, it will return "CalcValidationResults.Ok".
     *
     * @param desiredValidationResult   The desired validation result if the calculator variable value is not greater than 0.
     * @return  A validator which will give the desired validation result if the calculator variable is not greater than 0.
     */
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
