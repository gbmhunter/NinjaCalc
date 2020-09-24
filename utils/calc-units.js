/**
 * Base class representing a unit interface that just provides the name (no concept of how
 * to convert to and from these units).
 */
export class Units {
  constructor(name) {
    this.name = name
  }
}

/**
 * Represents units which are multiplicative to the base unit for a calculator variable, e.g.
 * mm to m, kV to V, inch to cm, e.t.c.
 */
export class UnitsMultiplicative extends Units {
  constructor(name, multiplier) {
    super(name)    
    this.multiplier = multiplier
  }
}