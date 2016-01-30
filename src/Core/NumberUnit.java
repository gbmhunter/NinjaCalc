package Core;

/**
 * Encapsulates a single unit that can be added to a numerical calculator variable as part of its units array.
 * @author gbmhunter
 * @since 2015-11-02
 */
public class NumberUnit {

    /**
     * The displayed name for this particular unit. Will be displayed in combobox.
     */
    public String name;

    public double multiplier;

    public NumberPreference preference;

    /**
     * Simplist constructor for setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
     * @param name          The display name for the unit. This will be displayed in the combobox.
     * @param multiplier    The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).
     * @param preference
     */
    public NumberUnit(String name, double multiplier, NumberPreference preference) {
        this.name = name;
        this.multiplier = multiplier;
        this.preference = preference;
    }

    /**
     * Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
     * @param name          The display name for the unit. This will be displayed in the combobox.
     * @param multiplier    The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).
     */
    public NumberUnit(String name, double multiplier) {
        this.name = name;
        this.multiplier = multiplier;
        this.preference = NumberPreference.NOT_DEFAULT;
    }

    /// <summary>
    /// Provides a string representation of a NumberUnit object.
    /// </summary>
    /// <returns>A string representation of a NumberUnit object.</returns>
    /*public String ToString() {
        return this.name;
    }*/

}
