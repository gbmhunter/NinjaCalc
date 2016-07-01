package Utility.Crc;

import Utility.BitMirror.BitMirror;

import java.util.zip.Checksum;

/**
 * Implements the Checksum interface as defined by java.util.zip.Checksum (the same
 * interface that CRC32 uses).
 *
 * http://www.sunshine2k.de/articles/coding/crc/understanding_crc.html#ch4 has great
 * examples on the theory behind calculating CRC values
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-06-30
 * @last-modified   2016-06-30
 */
public class CrcGeneric implements Checksum {

    private static final int DATA_WIDTH_BITS = 8;

    private Integer crcWidthBits;
    private long crcPolynomial;
    private long startingValue;
    private Boolean reflectData;
    private long finalXorValue;
    private Boolean reflectRemainder;

    private long mask;
    private long crcValue;

    //================================================================================================//
    //========================================= CONSTRUCTORS =========================================//
    //================================================================================================//

    public CrcGeneric(
            Integer crcWidthBits,
            Long crcPolynomial,
            Long startingValue,
            Long finalXorValue,
            Boolean reflectData,
            Boolean reflectRemainder) {

        this.crcWidthBits = crcWidthBits;
        this.crcPolynomial = crcPolynomial;
        this.startingValue = startingValue;
        this.finalXorValue = finalXorValue;
        this.reflectData = reflectData;
        this.reflectRemainder = reflectRemainder;

        // Create a mask for future use in the update() method.
        // If the generator polynomial width is 8 bits, then the mask needs to be 0xFF,
        // if it is 16bits, then the mask needs to be 0xFFFF, e.t.c
        Double tempVal = Math.pow(2, crcWidthBits) - 1;
        mask = (long)tempVal.doubleValue();

        // Initialise the CRC value with the starting value
        crcValue = startingValue;

    }

    /**
     * Create a CRC engine based of a predefined CRC algorithm.
     * @param crcAlgorithmParameters
     */
    public CrcGeneric(CrcAlgorithmParameters crcAlgorithmParameters) {

        this.crcWidthBits = crcAlgorithmParameters.crcWidthBits;
        this.crcPolynomial = crcAlgorithmParameters.crcPolynomial;
        this.startingValue = crcAlgorithmParameters.startingValue;
        this.finalXorValue = crcAlgorithmParameters.finalXorValue;
        this.reflectData = crcAlgorithmParameters.reflectData;
        this.reflectRemainder = crcAlgorithmParameters.reflectRemainder;

        // Create a mask for future use in the update() method.
        // If the generator polynomial width is 8 bits, then the mask needs to be 0xFF,
        // if it is 16bits, then the mask needs to be 0xFFFF, e.t.c
        Double tempVal = Math.pow(2, crcWidthBits) - 1;
        mask = (long)tempVal.doubleValue();

        // Initialise the CRC value with the starting value
        crcValue = startingValue;

    }




    @Override
    public void update(int b) {

        long input = b;

        if(reflectData) {
            input = BitMirror.doMirror(input, 8);
        }

        // XOR-in the next byte of data, shifting it first
        // depending on the polynomial width.
        // This trick allows us to operate on one byte of data at a time before
        // considering the next
        crcValue ^= (input << (crcWidthBits - DATA_WIDTH_BITS));

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

    @Override
    public void update(byte[] b, int off, int len) {

    }

    @Override
    public long getValue() {

        long output = 0;
        if(reflectRemainder) {
            output = BitMirror.doMirror(crcValue, crcWidthBits);
        } else {
            output = crcValue;
        }

        output ^= finalXorValue;

        return output;
    }

    @Override
    public void reset() {
        crcValue = startingValue;
    }
}
