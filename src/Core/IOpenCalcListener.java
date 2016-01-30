package Core;

/**
 * Interface describing the callback for when new calculator instance is created and opened.
 * @author gbmhunter
 * @since 2015-11-02
 */
public interface IOpenCalcListener {
    public void execute(String calculatorName);
}
