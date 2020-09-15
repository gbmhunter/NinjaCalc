import React from "react"

import { CalcVarNumeric } from "~/components/calc-var-numeric"
import { StandardResistanceFinder } from "~/utils/standard-resistance-finder"

var standardResistanceFinder = new StandardResistanceFinder()

export class ESeriesRow extends React.Component {
  constructor(props) {
    super(props)
    console.log('ESeriesRow constructor() called.')
  }

  render() {

    var desiredResistance = this.props.calc.calcVars.desiredResistance.rawVal
    console.log('desiredResistance=' + desiredResistance)
    let closestResistance = null
    let closestResistancePercDiff = null
    let closestEqualOrLowerResistance = null
    let closestEqualOrLowerResistancePercDiff = null
    let closestEqualOrHigherResistance = null
    let closestEqualOrHigherResistancePercDiff = null

    const variableWidth = 100;
    const percErrorWidth = 80;
    if (desiredResistance) {
      closestResistance = standardResistanceFinder.find(desiredResistance, this.props.eSeries, standardResistanceFinder.searchMethods.CLOSEST)
      closestResistancePercDiff = (Math.abs(closestResistance - desiredResistance) / desiredResistance) * 100.0

      closestEqualOrLowerResistance = standardResistanceFinder.find(desiredResistance, this.props.eSeries, standardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER)
      closestEqualOrLowerResistancePercDiff = (Math.abs(closestEqualOrLowerResistance - desiredResistance) / desiredResistance) * 100.0

      closestEqualOrHigherResistance = standardResistanceFinder.find(desiredResistance, this.props.eSeries, standardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER)
      closestEqualOrHigherResistancePercDiff = (Math.abs(closestEqualOrHigherResistance - desiredResistance) / desiredResistance) * 100.0
      
    }
    console.log('closestResistance=' + closestResistance)    

    

    return (
      <tr>
        <td>{this.props.eSeries.name}</td>
        <td><CalcVarNumeric value={closestResistance} direction="output" width={variableWidth} /></td>
        <td><CalcVarNumeric value={closestResistancePercDiff} direction="output" width={percErrorWidth}/></td>

        <td><CalcVarNumeric value={closestEqualOrLowerResistance} direction="output" width={variableWidth} /></td>
        <td><CalcVarNumeric value={closestEqualOrLowerResistancePercDiff} direction="output" width={percErrorWidth}/></td>

        <td><CalcVarNumeric value={closestEqualOrHigherResistance} direction="output" width={variableWidth} /></td>
        <td><CalcVarNumeric value={closestEqualOrHigherResistancePercDiff} direction="output" width={percErrorWidth}/></td>
      </tr>
    )
  }
}