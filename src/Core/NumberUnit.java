package Core;

/**
 * Created by gbmhunter on 2016-04-18.
 */
public class NumberUnit {

    /**
     * The displayed name for this particular unit. Will be displayed in combobox.
     */
    public String name;

    public NumberPreference preference;

    public NumberUnit(String name, NumberPreference preference) {

        this.name = name;
        this.preference = preference;
    }

}
