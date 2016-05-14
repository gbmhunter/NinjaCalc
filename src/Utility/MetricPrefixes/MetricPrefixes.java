package Utility.MetricPrefixes;

import Utility.Rounding;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.regex.*;

/**
 * Utility class for converting numbers to strings with metric prefixes and back again.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-03-26
 * @last-modified   2016-05-14
 */
public enum MetricPrefixes {
    yocto('y', 1e-24),
    zepto('z', 1e-21),
    atta('a', 1e-18),
    femto('f', 1e-15),
    pico('p', 1e-12),
    nano('n', 1e-9),
    //micro('μ', 1e-6),
    micro('u', 1e-6),
    milli('m', 1e-3),
    unit(null, 1e0),
    kilo('k', 1e3),
    mega('M', 1e6),
    giga('G', 1e9),
    terra('T', 1e12),
    peta('P', 1e15),
    exa('E', 1e18),
    zetta('Z', 1e21),
    yotta('Y', 1e24);

    final Character symbol;
    final double multiplier;

    /***
     * Constructor, private as this is a static class.
     * @param symbol
     * @param multiplier
     */
    private MetricPrefixes(final Character symbol, final double multiplier) {
        this.symbol = symbol;
        this.multiplier = multiplier;
    }

    public Character getSymbol() {
        return symbol;
    }

    public double getMultiplier() {
        return multiplier;
    }

    private static final Pattern REGEX;

    static {
        //System.out.println("MetricPrefixes::static() called.");

        final StringBuffer buffer = new StringBuffer();
        buffer.append("^([+-]?[1-9]\\d*\\.?\\d*|[+-]?0?\\.\\d+)(?:([");
        for (final MetricPrefixes e : values())
            if (e.getSymbol() != null)
                buffer.append(e.getSymbol());
        buffer.append("]?)|E([+-]?[1-9]\\d*))$");
        REGEX = Pattern.compile(buffer.toString());
    }

    /**
     * Converts from a string in engineering notation (with or without metrix prefix), into
     * a raw double. Returns null if input value is not valid.
     * @param value     The string in engineering notation (which is allowed to have a metric prefix).
     * @return          The converted raw value of the provided string.
     */
    public static Double toDouble(final String value) {

        //System.out.println("MetricPrefixes::toDouble() called with value = " + value);

        final Matcher m = REGEX.matcher(value);
        if (!m.matches()) {
            //System.out.println("MetricPrefixes::toDouble() is going to return null!");
            return null;
        }

        Double result = Double.parseDouble(m.group(1));
        if (m.group(3) != null)
            return result * Math.pow(10, Integer.parseInt(m.group(3)));
        if (m.group(2) == null)
            return result; // Units

        //System.out.println("Finding character...");

        try {
            // Retrieve the metric prefix character
            final Character c = m.group(2).charAt(0);
            // Search through all valid prefixes
            for (final MetricPrefixes e : values()) {
                if (e.getSymbol() == c) {
                    // Found valid prefix!!!
                    Double returnValue = result * e.getMultiplier();
                    //System.out.println("Returning the number " + returnValue);
                    return returnValue;
                }
            }
        } catch (StringIndexOutOfBoundsException e) {
            // This exception happens during normal execution!
            //System.out.println("StringIndexOutOfBoundsException occurred! Assuming no metric prefix was present, and returning result...");
            return result;
        }

        //System.out.println("MetricPrefixes::toDouble() is going to return null!");
        return null;
    }

    private static String doubleToString(final double value) {
        if (value == (long) value)
            return String.format("%d", (long) value);
        return String.format("%s", value);
    }


    /***
     * Converts a double into a string in scientific notation.
     * @param value     The number to convert into scientific notation.
     * @return          The converted number in scientific notation.
     */
    public static String toSci(
            final double value
    ) {

        if(value == 0.0)
            return "0.0";

        final long exponent = (long) Math.floor(Math.log10(Math.abs(value)));
        return doubleToString(value / Math.pow(10, exponent)) + 'E' + exponent;
    }

    /***
     * Converts a double into a string in scientific notation.
     * @param value     The number to convert into scientific notation.
     * @return          The converted number in scientific notation.
     */
    public static String toSci(
            final BigDecimal value
    ) {
        return value.toString();
    }

    /***
     * Convert from a number to a string in engineering notation, using the provided metric prefix.
     * @param value
     * @param notation
     * @return
     */
    public static String toEng(
            final double value,
            final MetricPrefixes notation
    ) {
        //System.out.println("toEng() called with value = " + value + ", notation = " + notation.toString());
        if (notation == null || notation == unit)
            return doubleToString(value);

        double scaledValue = value / notation.getMultiplier();

        // Convert the double to a string, and add the symbol
        return doubleToString(scaledValue) + notation.getSymbol();
    }

    /***
     * Convert from a number to a string in engineering notation, using the provided metric prefix.
     * @param value
     * @param notation
     * @param roundTo   Number to significant figures to round number to.
     * @return
     */
    public static String toEng(
            final double value,
            final MetricPrefixes notation,
            final RoundingMethods roundingMethod,
            final Integer roundTo
    ) {
        //System.out.println("toEng() called with value = " + value + ", notation = " + notation.toString() + ", roundingMethod = " + roundingMethod.toString() + ", roundTo = " + roundTo);
        /*if (notation == null || notation == unit)
            return doubleToString(value);*/

        double scaledValue = value / notation.getMultiplier();

        String convertedString;

        switch(roundingMethod) {
            case DECIMAL_PLACES: {
                //scaledRoundedValue = Rounding.ToDecimalPlaces(scaledValue, roundTo);
                BigDecimal bd = new BigDecimal(scaledValue).setScale(roundTo, BigDecimal.ROUND_HALF_UP);
                convertedString = bd.toString();
                break;
            }
            case SIGNIFICANT_FIGURES: {
                //scaledRoundedValue = Rounding.RoundToSignificantDigits(scaledValue, roundTo);
                BigDecimal bd = new BigDecimal(scaledValue);
                int newScale = roundTo - bd.precision() + bd.scale();
                BigDecimal bd2 = bd.setScale(newScale, RoundingMode.HALF_UP);
                convertedString = bd2.toString();
                break;
            }
            default:
                throw new IllegalArgumentException("RoundingMethod choice not handled in switch.");
        }

        if(notation.getSymbol() != null){
            return convertedString + notation.getSymbol();
        } else {
            // This is a special case for when the value is between 1-1000 and no prefix is needed
            return convertedString;
        }

        //return convertedString;

        // Convert the double to a string, and add the symbol
        //return doubleToString(scaledRoundedValue) + notation.getSymbol();
    }

    /***
     * Convert from a number to a string in engineering notation, using the provided metric prefix.
     * @param value
     * @param notation
     * @return
     */
    /*public static String toEng(
            final BigDecimal value,
            final MetricPrefixes notation
    ) {
        System.out.println("toEng() (BigDecimal version) called with value = " + value + ", notation = " + notation.toString());
        if (notation == null || notation == unit)
            return value.toString();

        // Convert the double to a string, and add the symbol
        return value.divide(new BigDecimal(notation.getMultiplier())).toString() + notation.getSymbol();
    }*/

    /***
     * Convert from a number to a string in engineering notation, automatically finding the suitable metric prefix.
     * @param value
     * @return
     */
    public static String toEng(final double value) {

        // Get the absolute value of the provided value
        final double abs = Math.abs(value);

        double multiplier;
        for (final MetricPrefixes e : values()) {
            multiplier = e.getMultiplier();
            if (multiplier < abs && abs < multiplier * 1000)
                // Call the base method
                return toEng(value, e);
        }
        return toSci(value);
    }

    /***
     * Convert from a number to a string in engineering notation, automatically finding the suitable metric prefix.
     * @param value
     * @return
     */
    public static String toEng(
            final double value,
            final RoundingMethods roundingMethod,
            final int roundTo) {

        // Get the absolute value of the provided value
        double abs = Math.abs(value);

        if(abs == 0.0)
            return toSci(0.0);

        // Now that we know it is not exactly 0, search for the applicable multiplier
        double multiplier;
        for (final MetricPrefixes e : values()) {
            multiplier = e.getMultiplier();
            if (multiplier <= abs && abs < multiplier * 1000)
                // Call the base method
                return toEng(value, e, roundingMethod, roundTo);
        }

        return toSci(value);
    }

    /***
     * Convert from a number to a string in engineering notation, automatically finding the suitable metric prefix.
     * @param value
     * @return
     */
    /*public static String toEng(final BigDecimal value) {

        // Get the absolute value of the provided value
        final double abs = Math.abs(value.doubleValue());

        double multiplier;
        for (final MetricPrefixes e : values()) {
            multiplier = e.getMultiplier();
            if (multiplier < abs && abs < multiplier * 1000)
                // Call the base method
                return toEng(value, e);
        }
        return toSci(value);
    }*/

}