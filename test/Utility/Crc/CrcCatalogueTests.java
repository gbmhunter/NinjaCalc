package Utility.Crc;

import org.junit.Assert;
import org.junit.Test;

import java.util.Iterator;
import java.util.Map;

/**
 * Created by gbmhu on 2016-07-01.
 */
public class CrcCatalogueTests {

    @Test
    public void allPresetCrcAlgorithmsTest() throws Exception {

        Integer buffer[] = {(int)'1', (int)'2', (int)'3', (int)'4', (int)'5', (int)'6', (int)'7', (int)'8', (int)'9'};

        Iterator it = CrcCatalogue.presetCrcAlgorithms.entrySet().iterator();

        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            CrcAlgorithmParameters crcAlgorithmParameters = (CrcAlgorithmParameters)pair.getValue();

            if((CrcCatalogue.PresetCrcAlgorithmsIds)pair.getKey() == CrcCatalogue.PresetCrcAlgorithmsIds.CRC_64) {
                int x =2;
            }

            CrcGeneric crcGeneric = new CrcGeneric(crcAlgorithmParameters);

            for(Integer dataByte : buffer) {
                crcGeneric.update(dataByte);
            }
            Assert.assertEquals(crcAlgorithmParameters.checkValue, crcGeneric.getValue());

            it.remove(); // avoids a ConcurrentModificationException
        }

    }

}
