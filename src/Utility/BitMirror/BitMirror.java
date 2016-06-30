package Utility.BitMirror;

/**
 * Created by gbmhu on 2016-06-30.
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
