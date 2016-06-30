package Utility.Crc;

import Utility.BitMirror.BitMirror;

import java.util.zip.Checksum;

/**
 * Created by gbmhu on 2016-06-26.
 *
 * Implements the Checksum interface as defined by java.util.zip.Checksum (the same
 * interface that CRC32 uses).
 *
 * http://www.sunshine2k.de/articles/coding/crc/understanding_crc.html#ch4 has great
 * examples on the theory behind calculating CRC values
 */
public class CrcGeneric implements Checksum {

    private static final int DATA_WIDTH_BITS = 8;

    private Integer crcWidthBits;
    private long crcPolynomial;
    private long startingValue;
    private long finalXorValue;
    private Boolean reflectData;
    private Boolean reflectRemainder;

    private long mask;
    private long crcValue;

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

        // Create a mask for future use in the Calc() method.
        // If the polynomial width is 9 bits, then the mask needs to be 0xFF,
        // if it is 17bits, then the mask needs to be 0xFFFF, e.t.c
        Double tempVal = Math.pow(2, crcWidthBits) - 1;
        mask = (long)tempVal.doubleValue();

        crcValue = startingValue;

    }

//    public long Calc(Integer[] buffer) {
//
//        // Initialise the CRC value with the starting value
//        long crcValue = startingValue;
//
//        for(int i = 0; i < buffer.length; i++) {
//
//            // XOR-in the next byte of data, shifting it first
//            // depending on the polynomial width.
//            // This trick allows us to operate on one byte of data at a time before
//            // considering the next
//            crcValue ^= (buffer[i] << (crcWidthBits - DATA_WIDTH_BITS));
//
//            for (int j = 0; j < DATA_WIDTH_BITS; j++)
//            {
//                // Check to see if MSB is 1, if so, we need
//                // to XOR with polynomial
//                if ((crcValue & (1 << (crcWidthBits - 1))) != 0)
//                {
//                    crcValue = ((crcValue << 1) ^ crcPolynomial) & mask;
//                }
//                else
//                {
//                    crcValue = (crcValue << 1) & mask;
//                }
//            }
//
//        }
//
//        //crcValue &= finalXorValue;
//        return crcValue;
//    }


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
