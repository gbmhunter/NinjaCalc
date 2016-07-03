package Utility.Crc;

import java.util.EnumMap;

/**
 * A catalogue of common CRC algorithms and their defining parameters.
 *
 * This class is designed to be used with CrcGeneric (pass one of the CrcAlgorithmParameters stored
 * here into a CrcGeneric constructor) to create any CRC algorithm engine on-the-fly.
 *
 * Much of this information came from http://reveng.sourceforge.net/crc-catalogue/all.htm
 *
 * @author          Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-07-01
 * @last-modified   2016-07-02
 */
public class CrcCatalogue {

    public enum PresetCrcAlgorithmsIds {
        CRC_3_ROHC,
        CRC_4_INTERLAKEN,
        CRC_4_ITU,
        CRC_5_EPC,
        CRC_5_ITU,
        CRC_5_USB,
        CRC_6_CDMA2000_A,
        CRC_6_CDMA2000_B,
        CRC_6_DARC,
        CRC_6_ITU,
        CRC_7,
        CRC_7_ROHC,
        CRC_7_UMTS,
        CRC_8_CDMA2000,
        CRC_8_DARC,
        CRC_8_EBU,
        CRC_8_I_CODE,
        CRC_8_ITU_ATM_HEC,
        CRC_8_LTE,
        CRC_8_MAXIM,
        CRC_8_SAE_J1850,
        CRC_8_SMBUS,
        CRC_8_WCDMA,
        CRC_10,
        CRC_15_CAN2,
        CRC_16_ARC_IBM,
        CRC_16_CCITT_FALSE,
        CRC_16_CDMA2000,
        CRC_16_GENIBUS,
        CRC_16_KERMIT_CCITT_TRUE,
        CRC_16_MAXIM,
        CRC_16_MODBUS,
        CRC_16_X25_IBM_SLDC_ISO_HDLC,
        CRC_16_XMODEM_ACORN_LTE,
        CRC_24_OPEN_PGP,
        CRC_24_BLE,
        CRC_32_ADCCP_PKZIP,
        CRC_32_POSIX_CKSUM,
        CRC_40_GSM,
        CRC_64,
    }

    public static EnumMap<PresetCrcAlgorithmsIds, CrcAlgorithmParameters> presetCrcAlgorithms;

    static {

        presetCrcAlgorithms = new EnumMap<>(PresetCrcAlgorithmsIds.class);

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_3_ROHC,
                new CrcAlgorithmParameters(
                        "CRC-3/ROHC",
                        3,
                        0x3,
                        0x7,
                        true,
                        true,
                        0x00,
                        0x6));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_4_INTERLAKEN,
                new CrcAlgorithmParameters(
                        "CRC-4/INTERLAKEN",
                        4,
                        0x3,
                        0xF,
                        false,
                        false,
                        0xF,
                        0xB));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_4_ITU,
                new CrcAlgorithmParameters(
                        "CRC-4/ITU",
                        4,
                        0x3,
                        0x0,
                        true,
                        true,
                        0x0,
                        0x7));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_5_EPC,
                new CrcAlgorithmParameters(
                        "CRC-5/EPC",
                        5,
                        0x09,
                        0x09,
                        false,
                        false,
                        0x00,
                        0x00));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_5_ITU,
                new CrcAlgorithmParameters(
                        "CRC-5/ITU",
                        5,
                        0x15,
                        0x00,
                        true,
                        true,
                        0x00,
                        0x07));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_5_USB,
                new CrcAlgorithmParameters(
                        "CRC-5/USB",
                        5,
                        0x05,
                        0x1F,
                        true,
                        true,
                        0x1F,
                        0x19));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_6_CDMA2000_A,
                new CrcAlgorithmParameters(
                        "CRC-6/CDMA2000-A",
                        6,
                        0x27,
                        0x3F,
                        false,
                        false,
                        0x00,
                        0x0D));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_6_CDMA2000_B,
                new CrcAlgorithmParameters(
                        "CRC-6/CDMA2000-B",
                        6,
                        0x07,
                        0x3F,
                        false,
                        false,
                        0x00,
                        0x3B));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_6_DARC,
                new CrcAlgorithmParameters(
                        "CRC-6/DARC",
                        6,
                        0x19,
                        0x00,
                        true,
                        true,
                        0x00,
                        0x26));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_6_ITU,
                new CrcAlgorithmParameters(
                        "CRC-6/ITU",
                        6,
                        0x03,
                        0x00,
                        true,
                        true,
                        0x00,
                        0x06));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_7,
                new CrcAlgorithmParameters(
                        "CRC-7",
                        7,
                        0x09,
                        0x00,
                        false,
                        false,
                        0x00,
                        0x75));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_7_ROHC,
                new CrcAlgorithmParameters(
                        "CRC-7/ROHC",
                        7,
                        0x4F,
                        0x7F,
                        true,
                        true,
                        0x00,
                        0x53));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_7_UMTS,
                new CrcAlgorithmParameters(
                        "CRC-7/UMTS",
                        7,
                        0x45,
                        0x00,
                        false,
                        false,
                        0x00,
                        0x61));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_CDMA2000,
                new CrcAlgorithmParameters(
                        "CRC-8/CDMA2000",
                        8,
                        0x9B,
                        0xFF,
                        false,
                        false,
                        0x00,
                        0xDA));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_DARC,
                new CrcAlgorithmParameters(
                        "CRC-8/DARC",
                        8,
                        0x39,
                        0x00,
                        true,
                        true,
                        0x00,
                        0x15));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_EBU,
                new CrcAlgorithmParameters(
                        "CRC-8/EBU, CRC-8/AES",
                        8,
                        0x1D,
                        0xFF,
                        true,
                        true,
                        0x00,
                        0x97));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_I_CODE,
                new CrcAlgorithmParameters(
                        "CRC-8/I-CODE",
                        8,
                        0x1D,
                        0xFF,
                        true,
                        true,
                        0x00,
                        0x97));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_ITU_ATM_HEC,
                new CrcAlgorithmParameters(
                        "CRC-8/ITU, ATM HEC",
                        8,
                        0x07,
                        0x00,
                        false,
                        false,
                        0x55,
                        0xA1));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_LTE,
                new CrcAlgorithmParameters(
                        "CRC-8/LTE",
                        8,
                        0x9B,
                        0x00,
                        false,
                        false,
                        0x00,
                        0xEA));

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

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_SAE_J1850,
                new CrcAlgorithmParameters(
                        "CRC-8/SAE-J1850",
                        8,
                        0x1D,
                        0xFF,
                        false,
                        false,
                        0xFF,
                        0x4B));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_SMBUS,
                new CrcAlgorithmParameters(
                        "CRC-8/SMBus",
                        8,
                        0x07,
                        0x00,
                        false,
                        false,
                        0x00,
                        0xF4));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_8_WCDMA,
                new CrcAlgorithmParameters(
                        "CRC-8/WCDMA",
                        8,
                        0x9B,
                        0x00,
                        true,
                        true,
                        0x00,
                        0x25));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_10,
                new CrcAlgorithmParameters(
                        "CRC-10",
                        10,
                        0x233,
                        0x000,
                        false,
                        false,
                        0x000,
                        0x199));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_15_CAN2,
                new CrcAlgorithmParameters(
                        "CRC-15, CAN2.0",
                        15,
                        0x4599,
                        0x0000,
                        false,
                        false,
                        0x0000,
                        0x059E));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_ARC_IBM,
                new CrcAlgorithmParameters(
                        "CRC-16, CRC-IBM, CRC-16/ARC, CRC-16/LHA",
                        16,
                        0x8005,
                        0x0000,
                        true,
                        true,
                        0x0000,
                        0xBB3D));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_CCITT_FALSE,
                new CrcAlgorithmParameters(
                        "CRC-16/CCITT-FALSE",
                        16,
                        0x1021,
                        0xFFFF,
                        false,
                        false,
                        0x0000,
                        0x29B1));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_CDMA2000,
                new CrcAlgorithmParameters(
                        "CRC-16/CDMA2000",
                        16,
                        0xC867,
                        0xFFFF,
                        false,
                        false,
                        0x0000,
                        0x4C06));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_GENIBUS,
                new CrcAlgorithmParameters(
                        "CRC-16/GENIBUS",
                        16,
                        0x1021,
                        0xFFFF,
                        false,
                        false,
                        0xFFFF,
                        0xD64E));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_KERMIT_CCITT_TRUE,
                new CrcAlgorithmParameters(
                        "CRC-16/KERMIT/CCITT-TRUE",
                        16,
                        0x1021,
                        0x0000,
                        true,
                        true,
                        0x0000,
                        0x2189));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_MAXIM,
                new CrcAlgorithmParameters(
                        "CRC-16/MAXIM",
                        16,
                        0x8005,
                        0x0000,
                        true,
                        true,
                        0xFFFF,
                        0x44C2));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_MODBUS,
                new CrcAlgorithmParameters(
                        "CRC-16/MODBUS",
                        16,
                        0x8005,
                        0xFFFF,
                        true,
                        true,
                        0x0000,
                        0x4B37));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_X25_IBM_SLDC_ISO_HDLC,
                new CrcAlgorithmParameters(
                        "CRC-16/X25, IBM-SLDC, ISO-HDLC, CRC-B",
                        16,
                        0x1021,
                        0xFFFF,
                        true,
                        true,
                        0xFFFF,
                        0x906E));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_16_XMODEM_ACORN_LTE,
                new CrcAlgorithmParameters(
                        "CRC-16/XMODEM, ACORN, LTE",
                        16,
                        0x1021,
                        0x0000,
                        false,
                        false,
                        0x0000,
                        0x31C3));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_24_OPEN_PGP,
                new CrcAlgorithmParameters(
                        "CRC-24/OPENPGP",
                        24,
                        0x864CFB,
                        0xB704CE,
                        false,
                        false,
                        0x000000,
                        0x21CF02));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_24_BLE,
                new CrcAlgorithmParameters(
                        "CRC-24/BLE",
                        24,
                        0x00065B,
                        0x555555,
                        true,
                        true,
                        0x000000,
                        0xC25A56));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_32_ADCCP_PKZIP,
                new CrcAlgorithmParameters(
                        "CRC-32/ADCCP, PKZIP",
                        32,
                        0x04C11DB7L,
                        0xFFFFFFFFL,
                        true,
                        true,
                        0xFFFFFFFFL,
                        0xCBF43926L));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_32_POSIX_CKSUM,
                new CrcAlgorithmParameters(
                        "CRC-32/POSIX, CKSUM",
                        32,
                        0x04C11DB7L,
                        0x00000000L,
                        false,
                        false,
                        0xFFFFFFFFL,
                        0x765E7680L));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_40_GSM,
                new CrcAlgorithmParameters(
                        "CRC-40/GSM",
                        40,
                        0x0004820009L,
                        0x0000000000L,
                        false,
                        false,
                        0xFFFFFFFFFFL,
                        0xD4164FC646L));

        presetCrcAlgorithms.put(
                PresetCrcAlgorithmsIds.CRC_64,
                new CrcAlgorithmParameters(
                        "CRC-64",
                        64,
                        0x42f0E1EBA9EA3693L,
                        0x0000000000000000L,
                        false,
                        false,
                        0x0000000000000000L,
                        0x6C40DF5F0B497347L));

    }

    public static CrcAlgorithmParameters get(PresetCrcAlgorithmsIds presetCrcAlgorithmsId) {
        return presetCrcAlgorithms.get(presetCrcAlgorithmsId);
    }


}
