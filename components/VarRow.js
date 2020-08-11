import PropTypes from 'prop-types'
console.log('test')
class VarRow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const calcVar = this.props.calcVar

    console.log(calcVar)

    const unitOptions = calcVar.units.map((unit, idx) => {
      return (<option key={idx} value={unit[0]}>{unit[0]}</option>)
    })
    // const unitOptions = 'test'

    return (
      <tr>
        <td className="var-name">Via Diameter</td>
        <td className="value"><input name="viaDiameterMm"
          className={calcVar.validationState}
          value={calcVar.value} onChange={this.props.valueChanged}></input></td>
        <td className="units">
          <select value={calcVar.selUnit} onChange={this.props.unitsChanged}>
            {unitOptions}
          </select>
        </td>
      </tr>)
  }
}

VarRow.propTypes = {
  calcVar: PropTypes.object.isRequired,
  valueChanged: PropTypes.func.isRequired,
  unitsChanged: PropTypes.func.isRequired,
};

export default VarRow