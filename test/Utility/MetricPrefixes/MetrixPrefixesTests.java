package Utility.MetricPrefixes;

import Utility.MetricPrefixes.MetricPrefixes;
import Utility.MetricPrefixes.RoundingMethods;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the MetricPrefixes utility class.
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-03-25
 * @last-modified   2016-05-14
 */
public class MetrixPrefixesTests {



    @Test
    public void formatTests() {

        final double[] formatTests = {
                1234e18,
                -12.34e-26,
                100,
                0.1
        };

        for (final double test : formatTests)
            System.out.println(Double.toString(test) + " formats as " + MetricPrefixes.toEng(test));

        assertEquals("1.234Z", MetricPrefixes.toEng(1234e18));
        assertEquals("-1.234E-25", MetricPrefixes.toEng(-12.34e-26));
        assertEquals("100", MetricPrefixes.toEng(100));
        assertEquals("100m", MetricPrefixes.toEng(0.1));

    }

    @Test
    public void precisionTests() {

        // Make sure no precision is lost numbers that have a large number of digits
        assertEquals("123.456789M", MetricPrefixes.toEng(123456789));
        assertEquals("123.456789m", MetricPrefixes.toEng(0.123456789));

    }

    @Test
    public void largeNumberToPrefixTest() {

        // Test the large number 220 million
        assertEquals("220M", MetricPrefixes.toEng(220000000.0));
    }

    @Test
    public void roundingTests() {

        // Make sure no precision is lost numbers that have a large number of digits
        assertEquals("3.33", MetricPrefixes.toEng(10.0/3.0, RoundingMethods.DECIMAL_PLACES, 2));

        assertEquals("0.0", MetricPrefixes.toEng(0.0, RoundingMethods.SIGNIFICANT_FIGURES, 2));

    }

    //===========================================================================================//
    //========================= FROM PREFIX NOTATION TO NUMBER TESTS ============================//
    //===========================================================================================//

    @Test
    public void noPrefixPresentParseTest() {
        assertEquals(2.0, MetricPrefixes.toDouble("2"), 0.1);
    }

    @Test
    public void parseTests() {

        final String[] parseTests = {
                "1.23M",
                "1.23E",
                "1.23E5",
                "1.23E+5",
                "-0.123E-28"
        };
        for (final String test : parseTests)
            System.out.println(test + " parses to: " + Double.toString(MetricPrefixes.toDouble(test)));

        assertEquals(1230000.0, MetricPrefixes.toDouble("1.23M"), 0.1);
        assertEquals(1.23e18, MetricPrefixes.toDouble("1.23E"), 0.1);
        assertEquals(1.23e5, MetricPrefixes.toDouble("1.23E5"), 0.1);
        assertEquals(1.23e5, MetricPrefixes.toDouble("1.23E+5"), 0.1);
        assertEquals(1.23e-28, MetricPrefixes.toDouble("-0.123E-28"), 0.1);

    }

}
