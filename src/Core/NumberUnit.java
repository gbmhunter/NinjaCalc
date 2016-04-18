package Core;

/**
 * Created by gbmhunter on 2016-04-18.
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
