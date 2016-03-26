package Utility;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * Static utility class for finding a E-series resistance (standard resistance) which is closest to the user's
 * desired resistance.
 *
 * Can be used by many calculators (including the "Standard Resistance Finder" calculator).
 *
 * @author gbmhunter
 * @since 2016-02-15
 * @last-modified 2016-03-26
 */
public class StandardResistanceFinder {

    /**
     * The different E-Series that you can search through.
     */
    public enum eSeriesOptions {
        E6,
        E12,
        E24,
        E48,
        E96,
        E192,
    }

    private static ArrayList<Integer> e6 = new ArrayList<>();
    private static ArrayList<Integer> e12 = new ArrayList<>();
    private static ArrayList<Integer> e24 = new ArrayList<>();
    private static ArrayList<Integer> e48 = new ArrayList<>();
    private static ArrayList<Integer> e96 = new ArrayList<>();
    private static ArrayList<Integer> e192 = new ArrayList<>();

    /**
     * Static initialiser for this class. Builds the E48, E96 and E192 arrays from the existing E12 and E24 arrays
     */
    static {

        System.out.println("Building resistor E-series arrays.");

        e24 = new ArrayList<Integer>(Arrays.asList(100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910, 1000));

        // Construct E12 and E6 arrays from every second and fourth element of
        // the E24 array, respectively
        for(int i = 0; i < e24.size(); i++) {
            if(i % 2 == 0) {
                e12.add(e24.get(i));
            }

            if(i % 4 == 0) {
                e6.add(e24.get(i));
            }
        }

        e192 = new ArrayList<Integer>(
                Arrays.asList(
                        100,101,102,104,105,106,107,109,110,111,113,114,115,117,118,120,
                        121,123,124,126,127,129,130,132,133,135,137,138,140,142,143,145,
                        147,149,150,152,154,156,158,160,162,164,165,167,169,172,174,176,
                        178,180,182,184,187,189,191,193,196,198,200,203,205,208,210,213,
                        215,218,221,223,226,229,232,234,237,240,243,246,249,252,255,258,
                        261,264,267,271,274,277,280,284,287,291,294,298,301,305,309,312,
                        316,320,324,328,332,336,340,344,348,352,357,361,365,370,374,379,
                        383,388,392,397,402,407,412,417,422,427,432,437,442,448,453,459,
                        464,470,475,481,487,493,499,505,511,517,523,530,536,542,549,556,
                        562,569,576,583,590,597,604,612,619,626,634,642,649,657,665,673,
                        681,690,698,706,715,723,732,741,750,759,768,777,787,796,806,816,
                        825,835,845,856,866,876,887,898,909,920,931,942,953,965,976,988));

        // Construct E96 and E48 arrays from every second and fourth element of
        // the E192 array, respectively
        for(int i = 0; i < e192.size(); i++) {
            if(i % 2 == 0) {
                e96.add(e192.get(i));
            }

            if(i % 4 == 0) {
                e48.add(e192.get(i));
            }
        }


        //e48 = BuildResArray(48);
        //e96 = BuildResArray(96);
        //e192 = BuildResArray(192);
    }

    /**
     * Use to find the closest E-series resistance to your desired resistance.
     * @param desiredResistance The desired resistance to search for.
     * @param eSeries           The E-Series to use.
     * @return The closest E-series resistance to desiredResistance.
     */
    public static double Find(double desiredResistance, eSeriesOptions eSeries) {

        System.out.println("StandardResistanceFinder::Find() called with desiredResistance = " + desiredResistance + "and eSeries = " + eSeries.toString());

        ArrayList<Integer> selectedRange = new ArrayList<>();

        // Find out what resistance series was selected

        if(eSeries == eSeriesOptions.E6)
        {
            //Log('E12 range selected.');
            selectedRange = e6;
        }
        else if(eSeries == eSeriesOptions.E12)
        {
            //Log('E12 range selected.');
            selectedRange = e12;
        }
        else if(eSeries == eSeriesOptions.E24)
        {
            //Log('E24 range selected.');
            selectedRange = e24;
        }
        else if(eSeries == eSeriesOptions.E48)
        {
            //Log('E48 range selected.');
            selectedRange = e12;
        }
        else if(eSeries == eSeriesOptions.E96)
        {
            //Log('E96 range selected.');
            selectedRange = e12;
        }
        else if(eSeries == eSeriesOptions.E192)
        {
            //Log('E192 range selected.');
            selectedRange = e12;
        }

        Integer order = FindOrder(desiredResistance) - 2;
        Double scaledDesRes = ScaleWrtOrder(desiredResistance, order);
        System.out.println("Scaled resistance = " + scaledDesRes);
        Double closestScaledResistance = FindClosestMatch(scaledDesRes, selectedRange);
        System.out.println("Closest scaled (between 1-10) resistance = " + closestScaledResistance);

        BigDecimal closestScaledResistanceBD = new BigDecimal(closestScaledResistance);
        System.out.println("closestScaledResistanceBD = " + closestScaledResistanceBD.toString());

        // Convert back to a non-scaled resistance
        BigDecimal scaleFactor = new BigDecimal(Math.pow(10, order));
        System.out.println("scaleFactor = " + scaleFactor.toString());

        BigDecimal closestResistance = closestScaledResistanceBD.multiply(scaleFactor);

        System.out.println("Closest non-scaled resistance = " + closestResistance);
        return closestResistance.doubleValue();

    }

    /**
     * Use to build an array of E-series values based on the number of elements provided.
     * @param numElements The number of elements PER DECADE you want to have. Typical values for this
     *                    would be 12, 24, 48, 92, e.t.c.
     * @return The populated array of E-series values.
     * @note Not used anymore.
     */
    private static Double[] BuildResArray(int numElements)
    {
        System.out.println("StandardResistanceFinder::BuildResArray() called.");

        Double[] array = new Double[numElements];

        // Generate array elements
        for(int i = 0; i < numElements; i++)
        {
            array[i] = (double)Math.round(Math.pow(10, ((double)i)/((double)numElements))*100.0)/100.0;
            //System.out.println();
        }
        return array;
    }

    //
    //

    /***
     * Finds the order of magnitude of a given resistance.
     * e.g. if var in range 1-10, order = 0, if var in range 10-100, order = 1
     * @param desRes The resistance you wish to find the magnitude of.
     * @return The magnitude of the resistance.
     */
    private static int FindOrder(double desRes)
    {
        //Log('Desired resistance = ' + desRes);
        // Find the order of magnitude by using log()
        // (e.g. 1 = between 1-10, 2 = between 10-100, 3 - between 100-1000, e.t.c)
        Double order = Math.log10(desRes);
        //Log('Order of magnitude = ' + order);
        order = Math.floor(order);
        //Log('Floored order of magnitude = ' + order);

        return order.intValue();
    }

    private static double ScaleWrtOrder(Double desRes, Integer order)
    {
        // Scale value so it is between 1-10
        return desRes/Math.pow(10, order);
    }

    /**
     * Finds the closest array entry (in terms of percentage difference) to the provided value.
     * For computational efficiency, this function assumes array values are sorted from smallest to highest
     * @param val       The value to look for in array.
     * @param array     The array of values to compare with val.
     * @return          The closest array entry (in terms of percentage difference).
     */
    private static double FindClosestMatch(Double val, ArrayList<Integer> array)
    {
        Integer i = 0;

        // Iterate through array until we hit the first element which is bigger than the value we are
        // trying to find.
        // NOTE: Start of 2nd element of array!
        i = 1;
        while(true)
        {
            if(array.get(i) > val) break;

            if(i == array.size() - 1) break;

            i++;
        }

        // At this point either:
        // 1) We have stopped somewhere in the middle of the array. val will be higher than array[i-1]
        //    and lower than array[i]. We need to find which one is closer (based on percentage difference)
        // 2) We have stopped either on the second or last element of the array. If it is the second, val will
        //    be closest to array[i-1], if it is the last, val will be closest to array[i].

        System.out.println("Stopped when i = " + i);
        System.out.println("Closest value 1 = " + array.get(i-1));
        System.out.println("Closest value 2 = " + array.get(i));

        Double lowerPercDiff = ((val - array.get(i-1))/array.get(i-1))*100.0;
        System.out.println("Percentage diff 1 = " + lowerPercDiff);
        Double higherPercDiff = ((val - array.get(i))/array.get(i))*100.0;
        System.out.println("Percentage diff 2 = " + higherPercDiff);

        if(Math.abs(lowerPercDiff) < Math.abs(higherPercDiff))
            return array.get(i-1);
        else
            return array.get(i);
    }

}
