export class CalcVar {
  constructor(config) {
    this.name = config.name
    this.type = config.type
    this.direction = config.direction

    if (typeof config.type === 'undefined') {
      console.log('WARNING: Variable type for "' + config.name + '" not specified. Defaulting to numeric.')
      config.type = 'numeric'
    }

    if (config.type == 'numeric') {
      this.dispVal = config.dispVal

      if(!(config.units)) throw Error('Units must be defined for calc var "' + this.name + "'.")
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
    } else if(config.type == 'select') {
      this.options = config.options
      if (!config.selOption) throw Error('No default selection option provided for calc var "' + this.name + '".')
      this.selOption = config.selOption
    } else if(config.type == 'string') {
      this.value = config.value
    } else if(config.type == 'checkbox') {
      // Value should be true (checked) or false (unchecked)
      this.value = config.value
    } else {
      throw Error('Type "' + config.type + '" not recognized for calc var "' + this.name + '".')
    }

    if (typeof config.validation === 'undefined') {
      this.validation = {
        state: 'ok',
        msg: '',
      }
    } else {
      this.validation = config.validation
    }
    this.helpText = config.helpText
  }
}