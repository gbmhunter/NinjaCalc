package Utility.Crc;

import java.util.List;

/**
 * Created by gbmhu on 2016-06-26.
 */
public class CrcGeneric {

    private Integer crcPolynomial;
    private Integer startingValue;
    private Integer finalXorValue;
    private Boolean reflectData;
    private Boolean reflectRemainder;

    public CrcGeneric(
            Integer crcPolynomial,
            Integer startingValue,
            Integer finalXorValue,
            Boolean reflectData,
            Boolean reflectRemainder) {

        this.crcPolynomial = crcPolynomial;
        this.startingValue = startingValue;
        this.finalXorValue = finalXorValue;
        this.reflectData = reflectData;
        this.reflectRemainder = reflectRemainder;

    }

    public int Calc(Integer[] buffer) {

        // Initialise the CRC value with the starting value
        int crcValue = startingValue;

        for (int i = 0; i < buffer.length ; i++) {

            crcValue ^= buffer[i];
            for (int j = 0; j < 8; j++)
            {
                if ((crcValue & 0x1) != 0)
                    crcValue ^= crcPolynomial;
                crcValue >>= 1;
            }
        }

        //crcValue &= finalXorValue;
        return crcValue;
    }


//    char *MakeCRC(char *BitString)
//    {
//        static char Res[9];                                 // CRC Result
//        char CRC[8];
//        int  i;
//        char DoInvert;
//
//        for (i=0; i<8; ++i)  CRC[i] = 0;                    // Init before calculation
//
//        for (i=0; i<strlen(BitString); ++i)
//        {
//            DoInvert = ('1'==BitString[i]) ^ CRC[7];         // XOR required?
//
//            CRC[7] = CRC[6];
//            CRC[6] = CRC[5];
//            CRC[5] = CRC[4] ^ DoInvert;
//            CRC[4] = CRC[3] ^ DoInvert;
//            CRC[3] = CRC[2];
//            CRC[2] = CRC[1];
//            CRC[1] = CRC[0];
//            CRC[0] = DoInvert;
//        }
//
//        for (i=0; i<8; ++i)  Res[7-i] = CRC[i] ? '1' : '0'; // Convert binary to ASCII
//        Res[8] = 0;                                         // Set string terminator
//
//        return(Res);
//    }


}
