package Utility;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.DoubleSummaryStatistics;
import java.util.List;

/**
 * Static utility class for finding a E-series resistance (standard resistance) which is closest to the user's
 * desired resistance.
 *
 * Can be used by many calculators (including the "Standard Resistance Finder" calculator).
 *
 * @author gbmhunter
 * @since 2016-02-15
 * @last-modified 2016-03-25
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

    private static ArrayList<Double> e6 = new ArrayList<>();
    private static ArrayList<Double> e12 = new ArrayList<>();
    private static ArrayList<Double> e24 = new ArrayList<>();
    private static ArrayList<Double> e48 = new ArrayList<>();
    private static ArrayList<Double> e96 = new ArrayList<>();
    private static ArrayList<Double> e192 = new ArrayList<>();

    /**
     * Static initialiser for this class. Builds the E48, E96 and E192 arrays from the existing E12 and E24 arrays
     */
    static {

        System.out.println("Building resistor E-series arrays.");

        e24 = new ArrayList<Double>(Arrays.asList(1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10.0));

        for(int i = 0; i < e24.size(); i++) {
            if(i % 2 == 0) {
                e12.add(e24.get(i));
            }

            if(i % 4 == 0) {
                e6.add(e24.get(i));
            }
        }

        //e12 = new List<Double>(Arrays.asList(1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10.0);

        e192 = new ArrayList<Double>(
                Arrays.asList(
                        1.00,1.01,1.02,1.04,1.05,1.06,1.07,1.09,1.10,1.11,1.13,1.14,1.15,1.17,1.18,1.20,
                        1.21,1.23,1.24,1.26,1.27,1.29,1.30,1.32,1.33,1.35,1.37,1.38,1.40,1.42,1.43,1.45,
                        1.47,1.49,1.50,1.52,1.54,1.56,1.58,1.60,1.62,1.64,1.65,1.67,1.69,1.72,1.74,1.76,
                        1.78,1.80,1.82,1.84,1.87,1.89,1.91,1.93,1.96,1.98,2.00,2.03,2.05,2.08,2.10,2.13,
                        2.15,2.18,2.21,2.23,2.26,2.29,2.32,2.34,2.37,2.40,2.43,2.46,2.49,2.52,2.55,2.58,
                        2.61,2.64,2.67,2.71,2.74,2.77,2.80,2.84,2.87,2.91,2.94,2.98,3.01,3.05,3.09,3.12,
                        3.16,3.20,3.24,3.28,3.32,3.36,3.40,3.44,3.48,3.52,3.57,3.61,3.65,3.70,3.74,3.79,
                        3.83,3.88,3.92,3.97,4.02,4.07,4.12,4.17,4.22,4.27,4.32,4.37,4.42,4.48,4.53,4.59,
                        4.64,4.70,4.75,4.81,4.87,4.93,4.99,5.05,5.11,5.17,5.23,5.30,5.36,5.42,5.49,5.56,
                        5.62,5.69,5.76,5.83,5.90,5.97,6.04,6.12,6.19,6.26,6.34,6.42,6.49,6.57,6.65,6.73,
                        6.81,6.90,6.98,7.06,7.15,7.23,7.32,7.41,7.50,7.59,7.68,7.77,7.87,7.96,8.06,8.16,
                        8.25,8.35,8.45,8.56,8.66,8.76,8.87,8.98,9.09,9.20,9.31,9.42,9.53,9.65,9.76,9.88));

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


        ArrayList<Double> selectedRange = new ArrayList<Double>();

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

        Integer order = FindOrder(desiredResistance);
        Double scaledDesRes = ScaleWrtOrder(desiredResistance, order);
        System.out.println("Scaled resistance = " + scaledDesRes);
        Double closestMatch = FindClosestMatch(scaledDesRes, selectedRange);
        System.out.println("Closest match 1 = " + closestMatch);
        System.out.println("Closest match 2 = " + closestMatch*Math.pow(10, order));

        // Return the actual resistance
        System.out.println("Returning closest resistance = " + scaledDesRes);
        return (closestMatch*Math.pow(10, order));

    }

    /**
     * Use to build an array of E-series values based on the number of elements provided.
     * @param numElements The number of elements PER DECADE you want to have. Typical values for this
     *                    would be 12, 24, 48, 92, e.t.c.
     * @return The populated array of E-series values.
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
    private static double FindClosestMatch(Double val, ArrayList<Double> array)
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
