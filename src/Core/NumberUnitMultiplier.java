package Core;

/**
 * Encapsulates a single unit that can be added to a numerical calculator variable as part of its units array.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-18
 */
public class NumberUnitMultiplier extends NumberUnit {

    public double multiplier;

    /**
     * Simplist constructor for setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
     * @param name          The display name for the unit. This will be displayed in the combobox.
     * @param multiplier    The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).
     * @param preference
     */
    public NumberUnitMultiplier(String name, double multiplier, NumberPreference preference) {

        super(name, preference);

        this.multiplier = multiplier;
    }

    /**
     * Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
     * @param name          The display name for the unit. This will be displayed in the combobox.
     * @param multiplier    The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).
     */
    public NumberUnitMultiplier(String name, double multiplier) {

        super(name, NumberPreference.NOT_DEFAULT);

        this.multiplier = multiplier;
    }

    public double convertTo(double value) {
        return value / this.multiplier;
    }

    public double convertFrom(double value) {
        return value * this.multiplier;
    }


}
