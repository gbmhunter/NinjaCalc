package Core;

/**
 * Interface describing the callback for when new calculator instance is created and opened.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public interface IOpenCalcListener {
    public void execute(String calculatorName);
}
