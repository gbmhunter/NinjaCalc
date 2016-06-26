package Utility.Crc;

import java.util.List;

/**
 * Created by gbmhu on 2016-06-26.
 */
public class CrcGeneric {

    private Integer startingValue;
    private Integer finalXorValue;
    private Boolean reflectData;
    private Boolean reflectRemainder;

    public CrcGeneric(Integer startingValue, Integer finalXorValue, Boolean reflectData, Boolean reflectRemainder) {

        this.startingValue = startingValue;
        this.finalXorValue = finalXorValue;
        this.reflectData = reflectData;
        this.reflectRemainder = reflectRemainder;

    }

    public int Calc(List<Integer> buffer) {

        // Initialise the CRC value with the starting value
        int crcValue = startingValue;

        for (int j = 0; j < buffer.size() ; j++) {

            crcValue = ((crcValue  >>> 8) | (crcValue  << 8) )& 0xffff;

            crcValue ^= (buffer.get(j) & 0xff);//byte to int, trunc sign

            crcValue ^= ((crcValue & 0xff) >> 4);
            crcValue ^= (crcValue << 12) & 0xffff;
            crcValue ^= ((crcValue & 0xFF) << 5) & 0xffff;
        }

        crcValue &= finalXorValue;
        return crcValue;
    }


}
