package Utility.Crc;

import org.junit.Assert;
import org.junit.Test;

/**
 * Unit tests for the CRC class.
 *
 * @author          Geoffrey Hunter <geoff@betasolutions.co.nz>
 * @since           2016-06-08
 * @last-modified   2016-06-28
 */
public class CrcGenericTests {

    @Test
    public void Generic8BitCrcTest() throws Exception {

        Integer buffer[] = {0x01, 0x02};

        CrcGeneric crcGeneric = new CrcGeneric(
                8,
                0x1D,
                0x00,
                0x00,
                false,
                false);
//        int crcResult = crcGeneric.Calc(buffer);
//        Assert.assertEquals(0x76, crcResult);

        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x76, crcGeneric.getValue());

    }

    @Test
    public void XModem16BitCrcTest() throws Exception {

        Integer buffer[] = {0x01, 0x02};

        CrcGeneric crcGeneric = new CrcGeneric(
                16,
                0x1021,
                0x0000,
                0x0000,
                false,
                false);
        //int crcResult = crcGeneric.Calc(buffer);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x1373, crcGeneric.getValue());

    }

    @Test
    public void NonZeroStartValueCrcTest() throws Exception {

        Integer buffer[] = {0x01, 0x02};

        CrcGeneric crcGeneric = new CrcGeneric(
                16,
                0x1021,
                0xFFFF,
                0x0000,
                false,
                false);
        //int crcResult = crcGeneric.Calc(buffer);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x0E7C, crcGeneric.getValue());

    }

    @Test
    public void Crc32Test() throws Exception {

        Integer buffer[] = {0x01, 0x02};

        CrcGeneric crcGeneric = new CrcGeneric(
                32,
                0x04C11DB7,
                0xFFFFFFFF,
                0xFFFFFFFF,
                true,
                true);
        //int crcResult = crcGeneric.Calc(buffer);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0xB6CC4292, crcGeneric.getValue());

    }

}