package Utility.Crc;

import org.junit.*;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Unit tests for the CRC class.
 *
 * @author          Geoffrey Hunter <geoff@betasolutions.co.nz>
 * @since           2016-06-08
 * @last-modified   2016-06-08
 */
public class Crc16XModemTests {

    @Test
    public void calcFastTest1() throws Exception {
        Integer buffer[] = { 0x00, 0x01, 0xFF, 0x54, 0x01 };
        int crcResult = Crc16XModem.CalcFast(buffer);
        Assert.assertEquals(0x6B8D, crcResult);
    }

    @Test
    public void calcFastTest2() throws Exception {
        Integer buffer[] = { 0x01, 0x01, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F};
        int crcResult = Crc16XModem.CalcFast(buffer);
        Assert.assertEquals(0x1CC3, crcResult);
    }

    @Test
    public void calcFastArrayListIntegerTest1() throws Exception {
        ArrayList<Integer> buffer = new ArrayList<>(Arrays.asList(0x7E, 0x7E, 0x02, 0x01, 0x01));
        int crcResult = Crc16XModem.CalcFast(buffer);
        Assert.assertEquals(0x7F71, crcResult);
    }

    /*@Test
    public void calcFastArrayListByteTest1() throws Exception {
        ArrayList<Byte> buffer = new ArrayList<Byte>(Arrays.asList(0x01, 0x02, 0x02, 0x01, 0x01));
        int crcResult = Crc16XModem.CalcFast(buffer);
        Assert.assertEquals(0x7F71, crcResult);
    }*/

    @Test
    public void calcSlowTest1() throws Exception {
        Integer buffer[] = { 0x00, 0x01, 0xFF, 0x54, 0x01 };
        int crcResult = Crc16XModem.CalcSlow(buffer);
        Assert.assertEquals(0x6B8D, crcResult);
    }

    @Test
    public void calcSlowTest2() throws Exception {
        Integer buffer[] = { 0x01, 0x01, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F};
        int crcResult = Crc16XModem.CalcSlow(buffer);
        Assert.assertEquals(0x1CC3, crcResult);
    }

}