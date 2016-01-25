package Core;

/// <summary>
/// The different ValidationLevels a validation function can return.
/// </summary>
public class CalcValidationLevels {
    public static CalcValidationLevel Ok;
    public static CalcValidationLevel Warning;
    public static CalcValidationLevel Error;

    public CalcValidationLevels() {
        Ok = new CalcValidationLevel("ok", "green", "#e5ffe5");
        Warning = new CalcValidationLevel("warning", "orange", "#fff5e5");
        Error = new CalcValidationLevel("error", "red", "#ffe5e5");
    }
}
