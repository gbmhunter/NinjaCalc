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

/**
 * Can represent any kind of unit. Must provide a function to convert from base units to custom units,
 * and also one to convert the other way.
 */
export class UnitsCustom extends Units {
  constructor(name, toFn, fromFn) {
    super(name)
    this.toFn = toFn
    this.fromFn = fromFn
  }
}