package Utility;

import org.junit.Test;

import java.math.BigDecimal;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the Rounding utility class.
 *
 * @author Geoffrey Hunter <gbmhunter@gmail.com>
 * @since 2015-03-26
 * @last-modified 2015-03-26
 */
public class RoundingTests {

    @Test
    public void bigDecimalTests() {

        // Make sure no precision is lost numbers that have a large number of digits
        assertEquals("2.0000", Rounding.ToSignificantDigits(new BigDecimal(2.0), 5).toString());

        assertEquals("2.20E+8", Rounding.ToSignificantDigits(new BigDecimal(220e6), 3).toString());

    }

}
