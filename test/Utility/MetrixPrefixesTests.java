package Utility;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the MetricPrefixes utility class.
 *
 * @author Geoffrey Hunter <gbmhunter@gmail.com>
 * @since 2015-03-25
 * @last-modified 2015-03-25
 */
public class MetrixPrefixesTests {

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
            System.out.println(test + " parses to: " + Double.toString(MetricPrefixes.parse(test)));

        assertEquals(1230000.0, MetricPrefixes.parse("1.23M"), 0.1);
        assertEquals(1.23e18, MetricPrefixes.parse("1.23E"), 0.1);
        assertEquals(1.23e5, MetricPrefixes.parse("1.23E5"), 0.1);
        assertEquals(1.23e5, MetricPrefixes.parse("1.23E+5"), 0.1);
        assertEquals(1.23e-28, MetricPrefixes.parse("-0.123E-28"), 0.1);

    }

    @Test
    public void formatTests() {

        final double[] formatTests = {
                1234e18,
                -12.34e-26,
                100,
                0.1
        };

        for (final double test : formatTests)
            System.out.println(Double.toString(test) + " formats as " + MetricPrefixes.toEngineeringNotation(test));

        assertEquals("1.234Z", MetricPrefixes.toEngineeringNotation(1234e18));
        assertEquals("-1.234E-25", MetricPrefixes.toEngineeringNotation(-12.34e-26));
        assertEquals("100", MetricPrefixes.toEngineeringNotation(100));
        assertEquals("100m", MetricPrefixes.toEngineeringNotation(0.1));

    }

}
