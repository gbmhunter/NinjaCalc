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
                (long)0x1Dl,
                (long)0x00,
                (long)0x00,
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
                (long)0x1021,
                (long)0x0000,
                (long)0x0000,
                false,
                false);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x1373, crcGeneric.getValue());

    }

    @Test
    public void XModem16BitCrcTest2() throws Exception {

        Integer buffer[] = {(int)'1', (int)'2', (int)'3', (int)'4', (int)'5', (int)'6', (int)'7', (int)'8', (int)'9'};

        CrcGeneric crcGeneric = new CrcGeneric(
                16,
                (long)0x1021,
                (long)0x0000,
                (long)0x0000,
                false,
                false);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x31C3, crcGeneric.getValue());

    }

    @Test
    public void KermitCrcTest() throws Exception {

        Integer buffer[] = {(int)'1', (int)'2', (int)'3', (int)'4', (int)'5', (int)'6', (int)'7', (int)'8', (int)'9'};

        CrcGeneric crcGeneric = new CrcGeneric(
                16,
                (long)0x1021,
                (long)0x0000,
                (long)0x0000,
                true,
                true);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0x2189, crcGeneric.getValue());

    }

    @Test
    public void NonZeroStartValueCrcTest() throws Exception {

        Integer buffer[] = {0x01, 0x02};

        CrcGeneric crcGeneric = new CrcGeneric(
                16,
                (long)0x1021,
                (long)0xFFFF,
                (long)0x0000,
                false,
                false);
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
                0x04C11DB7L,
                0xFFFFFFFFL,
                0xFFFFFFFFL,
                true,
                true);
        //int crcResult = crcGeneric.Calc(buffer);
        for(Integer dataByte : buffer) {
            crcGeneric.update(dataByte);
        }
        Assert.assertEquals(0xB6CC4292L, crcGeneric.getValue());

    }

}