package Core;

/**
 * A interface to describe the equation function which is provided to any
 * calculator variable which can be an output.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public interface IEquationFunction {
    /**
     * An "Object" type has to be returned because each different type of calculator variable will
     * want to return a different child type, e.g. numerical calculator variables will want to return
     * a number, while text-basr calculator variables will want to return a string.
     * @return
     */
    public Object execute();
}

