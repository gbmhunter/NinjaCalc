package Utility;

import java.util.regex.*;


public enum EngineeringNotation {
    yocto('y', 1e-24),
    zepto('z', 1e-21),
    atta('a', 1e-18),
    femto('f', 1e-15),
    pico('p', 1e-12),
    nano('n', 1e-9),
    micro('μ', 1e-6),
    milli('m', 1e-3),
    unit(null, 1e0),
    kilo('k', 1e3),
    mega('M', 1e6),
    giga('G', 1e9),
    terra('T', 1e12),
    peta('P', 1e15),
    exa('E', 1e18),
    zetta('Z', 1e21),
    yotta('Y', 1e24);

    final Character symbol;
    final double multiplier;

    private EngineeringNotation(final Character symbol, final double multiplier) {
        this.symbol = symbol;
        this.multiplier = multiplier;
    }

    public Character getSymbol() {
        return symbol;
    }

    public double getMultiplier() {
        return multiplier;
    }

    private static final Pattern REGEX;

    static {
        final StringBuffer buffer = new StringBuffer();
        buffer.append("^([+-]?[1-9]\\d*\\.?\\d*|[+-]?0?\\.\\d+)(?:([");
        for (final EngineeringNotation e : values())
            if (e.getSymbol() != null)
                buffer.append(e.getSymbol());
        buffer.append("]?)|E([+-]?[1-9]\\d*))$");
        REGEX = Pattern.compile(buffer.toString());
    }

    public static Double parse(final String value) {
        final Matcher m = REGEX.matcher(value);
        if (!m.matches())
            return null;
        Double result = Double.parseDouble(m.group(1));
        if (m.group(3) != null)
            return result * Math.pow(10, Integer.parseInt(m.group(3)));
        if (m.group(2) == null)
            return result; // Units
        final Character c = m.group(2).charAt(0);
        for (final EngineeringNotation e : values())
            if (e.getSymbol() == c)
                return result * e.getMultiplier();
        return null;
    }

    private static String doubleToString(final double value) {
        if (value == (long) value)
            return String.format("%d", (long) value);
        return String.format("%s", value);
    }

    public static String toEngineeringNotation(
            final double value,
            final EngineeringNotation notation
    ) {
        if (notation == null || notation == unit)
            return doubleToString(value);
        return doubleToString(value / notation.getMultiplier()) + notation.getSymbol();
    }

    public static String toScientificNotation(
            final double value
    ) {
        final long exponent = (long) Math.floor(Math.log10(Math.abs(value)));
        return doubleToString(value / Math.pow(10, exponent)) + 'E' + exponent;
    }

    public static String toEngineeringNotation(final double value) {
        final double abs = Math.abs(value);
        double multiplier;
        for (final EngineeringNotation e : values()) {
            multiplier = e.getMultiplier();
            if (multiplier < abs && abs < multiplier * 1000)
                return toEngineeringNotation(value, e);
        }
        return toScientificNotation(value);
    }

}