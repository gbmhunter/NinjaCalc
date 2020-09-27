export class MaterialResistivitiesOhmm {
  static ALUMINIUM = 2.65e-8
  static COPPER = 1.68e-8
  static SILVER = 1.59e-8
}


class UnitConversionConstants {
  constructor () {
    this.METERS_PER_INCH = 25.4 / 1000.0
    this.METERS_PER_MILS = this.METERS_PER_INCH / 1000.0

    this.COPPER_THICKNESS_M_PER_OZ = 0.0000350012

    this.M2_PER_MIL2 = this.METERS_PER_MILS * this.METERS_PER_MILS

    this.THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF = 1.73 // eslint-disable-line camelcase
  }
}
export let unitConversionConstants = new UnitConversionConstants()