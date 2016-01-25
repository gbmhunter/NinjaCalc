package Core;

/// <summary>
/// Designed to represent a single result from performing a validation on a calculator variable.
/// </summary>
public class CalcValidationResult {
    public CalcValidationLevel CalcValidationLevel;

    public String Message;

    public CalcValidationResult(CalcValidationLevel calcValidationLevel, String message) {
        this.CalcValidationLevel = calcValidationLevel;
        this.Message = message;
    }
}
