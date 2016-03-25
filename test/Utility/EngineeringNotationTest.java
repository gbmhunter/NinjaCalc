package Utility;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by gbmhunter on 2016-03-25.
 */
public class EngineeringNotationTest {

    @Test
    public void basicConversion() {

        final String[] parseTests = {
                "1.23M",
                "1.23E",
                "1.23E5",
                "1.23E+5",
                "-0.123E-28"
        };
        for (final String test : parseTests)
            System.out.println(test + " parses to: " + Double.toString(EngineeringNotation.parse(test)));

        final double[] formatTests = {
                1234e18,
                -12.34e-26,
                100,
                0.1
        };

        for (final double test : formatTests)
            System.out.println(Double.toString(test) + " formats as " + EngineeringNotation.toEngineeringNotation(test));
    }

}
