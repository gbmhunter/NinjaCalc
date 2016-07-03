package Utility.BitMirror;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Tests for the BitMirror class.
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-06-30
 * @last-modified   2016-06-30
 */
public class BitMirrorTests {

    @Test
    public void mirrorBitsTest() {
        assertEquals(0b11001101, BitMirror.doMirror(0b10110011, 8));
    }

}
