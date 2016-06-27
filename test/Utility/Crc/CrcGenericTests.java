package Utility.Crc;

import org.junit.Assert;
import org.junit.Test;

/**
 * Unit tests for the CRC class.
 *
 * @author          Geoffrey Hunter <geoff@betasolutions.co.nz>
 * @since           2016-06-08
 * @last-modified   2016-06-08
 */
public class CrcGenericTests {

    @Test
    public void test1() throws Exception {

        Integer buffer[] = {0x00, 0x01, 0xFF, 0x54, 0x01};

        CrcGeneric crcGeneric = new CrcGeneric(
                0x1021,
                0x0000,
                0x0000,
                false,
                false);
        int crcResult = crcGeneric.Calc(buffer);
        Assert.assertEquals(0x6B8D, crcResult);

    }
}