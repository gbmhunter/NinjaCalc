package Utility;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the StandardResistanceFinder utility class.
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (mbedded.ninja)
 * @since           2016-05-14
 * @last-modified   2016-05-14
 */
public class StandardResistanceFinderTests {

    @Test
    public void e6ClosestValueTests() {
        assertEquals(1.0, StandardResistanceFinder.Find(1.0, StandardResistanceFinder.eSeriesOptions.E6), 0.01);
        assertEquals(10.0, StandardResistanceFinder.Find(11.0, StandardResistanceFinder.eSeriesOptions.E6), 0.01);
        assertEquals(15.0, StandardResistanceFinder.Find(13.0, StandardResistanceFinder.eSeriesOptions.E6), 0.01);
        assertEquals(680.0, StandardResistanceFinder.Find(800.0, StandardResistanceFinder.eSeriesOptions.E6), 0.01);
        assertEquals(1000.0, StandardResistanceFinder.Find(900.0, StandardResistanceFinder.eSeriesOptions.E6), 0.01);
    }

    @Test
    public void e6ClosestLowerValueTests() {
        assertEquals(1.0, StandardResistanceFinder.Find(1.4, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
        assertEquals(100.0, StandardResistanceFinder.Find(101.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
        assertEquals(100.0, StandardResistanceFinder.Find(149.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
        assertEquals(150.0, StandardResistanceFinder.Find(150.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
        assertEquals(150.0, StandardResistanceFinder.Find(219.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
        assertEquals(680.0, StandardResistanceFinder.Find(999.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER), 0.01);
    }

    @Test
    public void e6ClosestHigherValueTests() {
        assertEquals(100.0, StandardResistanceFinder.Find(100.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER), 0.01);
        assertEquals(150.0, StandardResistanceFinder.Find(101.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER), 0.01);
        assertEquals(1000.0, StandardResistanceFinder.Find(900.0, StandardResistanceFinder.eSeriesOptions.E6, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER), 0.01);
    }

}
