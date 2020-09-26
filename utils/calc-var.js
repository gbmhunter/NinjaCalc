export class CalcVar {
  constructor(config) {
    this.name = config.name
    this.type = config.type
    this.direction = config.direction
    this.dispVal = config.dispVal
    this.units = config.units
    this.selUnit = config.selUnit
    this.metricPrefixes = config.metricPrefixes

    if (config.sigFig && config.format) {
      throw Error('sigFig and format provided for the same calc var "' + this.name + "'.")
    } else if (config.sigFig) {
      this.sigFig = config.sigFig
    } else if (config.format) {
      this.format = config.format
    } else {
      console.log('WARNING: No sigFig or format provided to calc var "' + this.name + "'. Defaulting to sigFig=4.")
      this.sigFig = 4
    }
    this.validation = config.validation
    this.helpText = config.helpText
  }
}