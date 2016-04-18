package Core;

/**
 * Encapsulates a single unit that can be added to a numerical calculator variable as part of its units array.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-04-18
 * @last-modified   2016-04-18
 */
public class NumberUnitFunction extends NumberUnit {

    IUnitConversionFunction unitConversionFunction;

    /**
     * Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
     * @param name          The display name for the unit. This will be displayed in the combobox.
     */
    public NumberUnitFunction(String name, IUnitConversionFunction unitConversionFunction) {

        super(name, NumberPreference.NOT_DEFAULT);

        this.unitConversionFunction = unitConversionFunction;

    }

}
