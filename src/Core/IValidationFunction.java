package Core;

/**
 * Interface describing a validation function, used for validating a calculator variable (without a input variable).
 * @author gbmhunter
 * @since 2015-11-02
 */
public interface IValidationFunction {
    public CalcValidationLevel execute();
}
