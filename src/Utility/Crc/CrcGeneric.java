package Utility.Crc;

/**
 * Created by gbmhu on 2016-06-26.
 * http://www.sunshine2k.de/articles/coding/crc/understanding_crc.html#ch4 has great
 * examples on the theory behind calculating CRC values
 */
public class CrcGeneric {

    private static final int DATA_WIDTH_BITS = 8;

    private Integer crcWidthBits;
    private Integer crcPolynomial;
    private Integer startingValue;
    private Integer finalXorValue;
    private Boolean reflectData;
    private Boolean reflectRemainder;

    private Integer mask;

    public CrcGeneric(
            Integer crcWidthBits,
            Integer crcPolynomial,
            Integer startingValue,
            Integer finalXorValue,
            Boolean reflectData,
            Boolean reflectRemainder) {

        this.crcWidthBits = crcWidthBits;
        this.crcPolynomial = crcPolynomial;
        this.startingValue = startingValue;
        this.finalXorValue = finalXorValue;
        this.reflectData = reflectData;
        this.reflectRemainder = reflectRemainder;

        // Create a mask for future use in the Calc() method.
        // If the polynomial width is 9 bits, then the mask needs to be 0xFF,
        // if it is 17bits, then the mask needs to be 0xFFFF, e.t.c
        Double tempVal = Math.pow(2, crcWidthBits) - 1;
        mask = (int)tempVal.doubleValue();

    }

    public int Calc(Integer[] buffer) {

        // Initialise the CRC value with the starting value
        int crcValue = startingValue;

        for(int i = 0; i < buffer.length; i++) {

            // XOR-in the next byte of data, shifting it first
            // depending on the polynomial width.
            // This trick allows us to operate on one byte of data at a time before
            // considering the next
            crcValue ^= (buffer[i] << (crcWidthBits - DATA_WIDTH_BITS));

            for (int j = 0; j < DATA_WIDTH_BITS; j++)
            {
                // Check to see if MSB is 1, if so, we need
                // to XOR with polynomial
                if ((crcValue & (1 << (crcWidthBits - 1))) != 0)
                {
                    crcValue = ((crcValue << 1) ^ crcPolynomial) & mask;
                }
                else
                {
                    crcValue = (crcValue << 1) & mask;
                }
            }

        }

        //crcValue &= finalXorValue;
        return crcValue;
    }


}
