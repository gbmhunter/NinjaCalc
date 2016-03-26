package Utility;

/**
 * Static class to help with the rounding of calculator variables, especially
 * with significant figure-based rounding.
 * @author gbmhunter
 * @since 2015-11-02
 * @last-modified 2016-03-26
 */
public class Rounding {

    /**
     * Round a number to the specified number of significant figures.
     * @param numberToRound     The number you wish to round.
     * @param digits            The number of significant figures you wish to round the number to.
     * @return                  The rounded number.
     */
    public static double RoundToSignificantDigits(double numberToRound, int digits) {
        //System.out.println("RoundToSignificantDigits() called.");

        if(numberToRound == 0) {
            return 0;
        }

        final double d = Math.ceil(Math.log10(numberToRound < 0 ? -numberToRound: numberToRound));
        final int power = digits - (int) d;

        final double magnitude = Math.pow(10, power);
        final long shifted = Math.round(numberToRound*magnitude);
        return shifted/magnitude;
    }

    public static double ToDecimalPlaces(double numberToRound, int digits) {

        //final int magnitude = (int)Math.floor(Math.log10(numberToRound));

        int scaleFactor = digits*10;
        double scaledValue = numberToRound * scaleFactor;

        double roundedScaledValue = Math.round(scaledValue);

        double roundedValue = roundedScaledValue / scaleFactor;

        return roundedValue;

    }

}

