// 'use strict'

import { CalcVarNumeral } from './CalcVarNumeral'
import { CalcVarString } from './CalcVarString'
import { CalcVarInvisible } from './CalcVarInvisible'

export default class Calc {

  constructor () {
    this.calcVars = []
  }

  addVar = (calcVar) => {
    this.calcVars.push(calcVar)

    // Save reference to calculator in CalcVar object
    calcVar.calc = this
  }

  getVar = (name) => {
//      console.log('getVar() called with name = ' + name)
    var variable = this.calcVars.find((element) => {
      return element.name === name
    })

    if (typeof variable === 'undefined') {
      throw new Error('Requested variable "' + name + '" does not exist in calculator.')
    }

    return variable
  }

  reCalcOutputsAndValidate = () => {
    console.log('reCalcOutputs() called.')
    // console.log(this)
    for (let calcVar of this.calcVars) {
      console.log(calcVar instanceof CalcVarString)
      if ((calcVar instanceof CalcVarNumeral) && (calcVar.typeEqn() === 'output')) {
        calcVar.reCalc()
      }
      if ((calcVar instanceof CalcVarString) && (calcVar.typeEqn() === 'output')) {
        console.log('test')
        calcVar.reCalc()
      }
      if ((calcVar instanceof CalcVarInvisible) && (calcVar.typeEqn() === 'output')) {
        console.log('test')
        calcVar.reCalc()
      }
    }

    // Now re-validate all calculator variables
    for (let calcVar of this.calcVars) {
      calcVar.validate()
    }
  }

  /**
   * Designed to be called once all calculator variables have been added to
   * the calculator via addVar().
   */
  init = () => {
    for (let calcVar of this.calcVars) {
      calcVar.validate()
      if (calcVar.typeEqn() === 'output') {
        // console.log('Recalculating "' + calcVar.name + '".')
        calcVar.reCalc()
      }
    }
  }
}
