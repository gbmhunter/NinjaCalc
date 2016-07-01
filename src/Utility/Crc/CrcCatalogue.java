package Utility.Crc;

import java.util.EnumMap;

/**
 * Created by gbmhu on 2016-07-01.
 */
public class CrcCatalogue {

    public enum PresetCrcAlgorithmsIds {
        CRC_8_MAXIM,
    }

    public static EnumMap<PresetCrcAlgorithmsIds, CrcAlgorithmParameters> presetCrcAlgorithms;

    static {

        presetCrcAlgorithms = new EnumMap<>(PresetCrcAlgorithmsIds.class);

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_MAXIM,
                new CrcAlgorithmParameters(
                        "CRC-8/MAXIM",
                        8,
                        0x31,
                        0x00,
                        true,
                        true,
                        0x00,
                        0xA1));
    }


}
