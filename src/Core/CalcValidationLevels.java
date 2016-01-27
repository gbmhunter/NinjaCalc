package Core;

/// <summary>
/// The different ValidationLevels a validation function can return.
/// </summary>
public class CalcValidationLevels {
    public static CalcValidationLevel Ok = new CalcValidationLevel("ok", "green", "#e5ffe5");;
    public static CalcValidationLevel Warning = new CalcValidationLevel("warning", "orange", "#fff5e5");
    public static CalcValidationLevel Error = new CalcValidationLevel("error", "red", "#ffe5e5");
}
