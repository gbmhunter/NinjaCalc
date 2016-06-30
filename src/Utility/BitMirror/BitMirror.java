package Utility.BitMirror;

/**
 * Simple utility class for mirroring the bits with long data types.
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-06-30
 * @last-modified   2016-06-30
 */
public class BitMirror {

    public static long doMirror(long input, long numBits) {

        long output = 0;

        for(int i = 0; i < numBits; i++){
            output <<= 1;
            output |= (input & 1);
            input >>= 1;
        }

        return output;
    }

}
