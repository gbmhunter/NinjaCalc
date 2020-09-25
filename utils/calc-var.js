export class CalcVar {
  constructor(config) {
    this.name = config.name
    this.type = config.type
    this.direction = config.direction
    this.dispVal = config.dispVal
    this.units = config.units
    this.selUnit = config.selUnit
    this.metricPrefixes = config.metricPrefixes
    this.sigFig = config.sigFig
    this.validation = config.validation
    this.helpText = config.helpText
  }
}