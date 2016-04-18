package Core;


/**
 * An abstract interface to a unit which most of the core classes will access.
 * Each real class which inherits from this class will use the convertTo() and
 * convertFrom() functions to define how exactly numerical variables will be calculated
 * to and from this unit.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-04-18
 * @last-modified   2016-04-18
 */
public abstract class NumberUnit {

    /**
     * The displayed name for this particular unit. Will be displayed in combobox.
     */
    public String name;

    public NumberPreference preference;

    public NumberUnit(String name, NumberPreference preference) {

        this.name = name;
        this.preference = preference;
    }

    abstract double convertTo(double value);
    abstract double convertFrom(double value);

}
