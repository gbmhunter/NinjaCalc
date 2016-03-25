package Utility;


import org.apache.commons.lang3.math.NumberUtils;
import java.text.DecimalFormat;
import java.text.FieldPosition;
import java.text.Format;
import java.text.ParsePosition;
import java.util.regex.Pattern;


/**
 * Created by gbmhunter on 2016-03-25.
 * Converts a number to a string in <a href="http://en.wikipedia.org/wiki/Metric_prefix">metric prefix</a> format.
 * For example, 7800000 will be formatted as '7.8M'. Numbers under 1000 will be unchanged. Refer to the tests for further examples.
 * Original code from http://stackoverflow.com/questions/4753251/how-to-go-about-formatting-1200-to-1-2k-in-java
 */
public class EngineeringNotation extends Format {

    private static final String[] METRIC_PREFIXES = new String[]{"", "k", "M", "G", "T"};

    /**
     * The maximum number of characters in the output, excluding the negative sign
     */
    private static final Integer MAX_LENGTH = 4;

    private static final Pattern TRAILING_DECIMAL_POINT = Pattern.compile("[0-9]+\\.[kMGT]");

    private static final Pattern METRIC_PREFIXED_NUMBER = Pattern.compile("\\-?[0-9]+(\\.[0-9])?[kMGT]");

    @Override
    public StringBuffer format(Object obj, StringBuffer output, FieldPosition pos) {

        Double number = Double.valueOf(obj.toString());

        // if the number is negative, convert it to a positive number and add the minus sign to the output at the end
        boolean isNegative = number < 0;
        number = Math.abs(number);

        String result = new DecimalFormat("##0E0").format(number);

        Integer index = Character.getNumericValue(result.charAt(result.length() - 1)) / 3;
        result = result.replaceAll("E[0-9]", METRIC_PREFIXES[index]);

        while (result.length() > MAX_LENGTH || TRAILING_DECIMAL_POINT.matcher(result).matches()) {
            int length = result.length();
            result = result.substring(0, length - 2) + result.substring(length - 1);
        }

        return output.append(isNegative ? "-" + result : result);
    }

    /**
     * Convert a String produced by <tt>format()</tt> back to a number. This will generally not restore
     * the original number because <tt>format()</tt> is a lossy operation, e.g.
     *
     * <pre>
     * {@code
     * def formatter = new RoundedMetricPrefixFormat()
     * Long number = 5821L
     * String formattedNumber = formatter.format(number)
     * assert formattedNumber == '5.8k'
     *
     * Long parsedNumber = formatter.parseObject(formattedNumber)
     * assert parsedNumber == 5800
     * assert parsedNumber != number
     * }
     * </pre>
     *
     * @param source a number that may have a metric prefix
     * @param pos if parsing succeeds, this should be updated to the index after the last parsed character
     * @return a Number if the the string is a number without a metric prefix, or a Long if it has a metric prefix
     */
    @Override
    public Object parseObject(String source, ParsePosition pos) {

        if (NumberUtils.isNumber(source)) {

            // if the value is a number (without a prefix) don't return it as a Long or we'll lose any decimals
            pos.setIndex(source.length());
            return toNumber(source);

        } else if (METRIC_PREFIXED_NUMBER.matcher(source).matches()) {

            boolean isNegative = source.charAt(0) == '-';
            int length = source.length();

            String number = isNegative ? source.substring(1, length - 1) : source.substring(0, length - 1);
            String metricPrefix = Character.toString(source.charAt(length - 1));

            Number absoluteNumber = toNumber(number);

            int index = 0;

            for (; index < METRIC_PREFIXES.length; index++) {
                if (METRIC_PREFIXES[index].equals(metricPrefix)) {
                    break;
                }
            }

            Integer exponent = 3 * index;
            Double factor = Math.pow(10, exponent);
            factor *= isNegative ? -1 : 1;

            pos.setIndex(source.length());
            Float result = absoluteNumber.floatValue() * factor.longValue();
            return result.longValue();
        }

        return null;
    }

    private static Number toNumber(String number) {
        return NumberUtils.createNumber(number);
    }
}
