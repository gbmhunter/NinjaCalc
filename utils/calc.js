export class Calc {
  constructor(config) {
    this.calcVars = config.calcVars
    this.eqFn = config.eqFn
    this.scratch = {} // Scratch is a free-form object where anything can read/write to it
  }
}