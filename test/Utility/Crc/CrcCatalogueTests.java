package Utility.Crc;

import org.junit.Assert;
import org.junit.Test;

import java.util.Iterator;
import java.util.Map;

/**
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-07-01
 * @last-modified   2016-07-02
 */
public class CrcCatalogueTests {

    /**
     * This single test method tests all of the preset algorithms by cycling through the map, computing CRC
     * values and checking with the provided "check value"" ("123456789").
     * @throws Exception
     */
    @Test
    public void allPresetCrcAlgorithmsTest() throws Exception {

        Integer buffer[] = {(int)'1', (int)'2', (int)'3', (int)'4', (int)'5', (int)'6', (int)'7', (int)'8', (int)'9'};

        Iterator it = CrcCatalogue.presetCrcAlgorithms.entrySet().iterator();

        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            CrcAlgorithmParameters crcAlgorithmParameters = (CrcAlgorithmParameters)pair.getValue();

            CrcGeneric crcGeneric = new CrcGeneric(crcAlgorithmParameters);

            for(Integer dataByte : buffer) {
                crcGeneric.update(dataByte);
            }
            try {
                Assert.assertEquals(crcAlgorithmParameters.checkValue, crcGeneric.getValue());
            } catch (Exception e) {
                e.printStackTrace();
            }

            it.remove(); // avoids a ConcurrentModificationException
        }

    }

}
