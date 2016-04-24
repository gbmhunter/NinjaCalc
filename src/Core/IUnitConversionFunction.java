package Core;

/**
 * A interface for the function which converts a variable of one type of unit to another. Used with the NumberUnit class
 * and it's child classes.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-04-18
 * @last-modified   2016-04-18
 */
public interface IUnitConversionFunction {
    double convert(double value);
}
