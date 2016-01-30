package Core;

/**
 * Interface describing a validation function, used for validating a calculator variable (with a input variable).
 * @author gbmhunter
 * @since 2015-11-02
 */
public interface IValidationFunctionWithValue {
    public CalcValidationLevel execute(double value);
}
