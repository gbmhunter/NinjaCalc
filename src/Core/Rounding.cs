using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {

    /// <summary>
    /// Static class to help with the rounding of calculator variables, especially
    /// with significant figure-based rounding.
    /// </summary>
    public static class Rounding {

        /// <summary>
        /// Round a number to the specified number of significant figures.
        /// </summary>
        /// <param name="numberToRound">The number you wish to round.</param>
        /// <param name="digits">The number of significant figures you wish to round the number to.</param>
        /// <returns>The rounded number.</returns>
        public static double RoundToSignificantDigits(this double numberToRound, int digits) {
            if (numberToRound == 0)
                return 0;

            double scale = Math.Pow(10, Math.Floor(Math.Log10(Math.Abs(numberToRound))) + 1);
            return scale * Math.Round(numberToRound / scale, digits);
        }

    }
}
