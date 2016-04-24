package Core;

/**
 * The different ValidationLevels a validation function can return.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public class CalcValidationLevels {
    public final static CalcValidationLevel Ok = new CalcValidationLevel("ok", "green", "#e5ffe5");
    public final static CalcValidationLevel Warning = new CalcValidationLevel("warning", "orange", "#fff5e5");
    public final static CalcValidationLevel Error = new CalcValidationLevel("error", "red", "#ffe5e5");
}
