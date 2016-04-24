package Core;

/**
 * Interface describing a validation function, used for validating a calculator variable (with a input variable).
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public interface IValidationFunctionWithValue {
    public CalcValidationLevel execute(double value);
}
