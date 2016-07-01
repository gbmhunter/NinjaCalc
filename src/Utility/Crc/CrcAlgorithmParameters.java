package Utility.Crc;

/**
 * Created by gbmhu on 2016-07-01.
 */
public class CrcAlgorithmParameters {

    public String name;
    public Integer crcWidthBits;
    public long crcPolynomial;
    public long startingValue;
    public Boolean reflectData;
    public Boolean reflectRemainder;
    public long finalXorValue;
    public long checkValue;

    public CrcAlgorithmParameters(
            String name,
            Integer crcWidthBits,
            long crcPolynomial,
            long startingValue,
            Boolean reflectData,
            Boolean reflectRemainder,
            long finalXorValue,
            long checkValue) {
        this.name = name;
        this.crcWidthBits = crcWidthBits;
        this.crcPolynomial = crcPolynomial;
        this.startingValue = startingValue;
        this.reflectData = reflectData;
        this.reflectRemainder = reflectRemainder;
        this.finalXorValue = finalXorValue;
        this.checkValue = checkValue;
    }
}
