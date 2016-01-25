package Core;

/// <summary>
/// Static class to help with the rounding of calculator variables, especially
/// with significant figure-based rounding.
/// </summary>
public class Rounding {

    /// <summary>
    /// Round a number to the specified number of significant figures.
    /// </summary>
    /// <param name="numberToRound">The number you wish to round.</param>
    /// <param name="digits">The number of significant figures you wish to round the number to.</param>
    /// <returns>The rounded number.</returns>
    public static double RoundToSignificantDigits(double numberToRound, int digits) {
        if (numberToRound == 0)
            return 0;

        //double scale = Math.pow(10, Math.floor(Math.log10(Math.abs(numberToRound))) + 1);
        //return scale * Math.round(numberToRound / scale, digits);

        double scale = Math.pow(10, Math.floor(Math.log10(Math.abs(numberToRound))) + 1);
        double scaledNumber = numberToRound/scale;
        return scale * (Math.round(scaledNumber*digits) / digits);
    }

}

