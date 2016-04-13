package Core;

/**
 * Designed to represent a single result from performing a validation on a calculator variable.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public class CalcValidationResult {
    public CalcValidationLevel CalcValidationLevel;

    public String Message;

    public CalcValidationResult(CalcValidationLevel calcValidationLevel, String message) {
        this.CalcValidationLevel = calcValidationLevel;
        this.Message = message;
    }
}
