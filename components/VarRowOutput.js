import PropTypes from 'prop-types'

class VarRowOutput extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const calcVar = this.props.calcVar

    const unitOptions = calcVar.units.map((unit, idx) => {
      return (<option key={idx} value={unit[0]}>{unit[0]}</option>)
    })    

    return (
      <tr>
        <td className="var-name">{this.props.name}</td>
        <td className="value"><input name={this.props.id}
          className={calcVar.validationState}
          value={this.props.value.toFixed(2)} onChange={this.props.valueChanged} style={{ width: this.props.width }} readOnly></input></td>
        <td className="units">
          <select name={this.props.id} value={calcVar.selUnit} onChange={this.props.unitsChanged}>
            {unitOptions}
          </select>
        </td>
        <style jsx>{`
          .value input[readonly] {
            background: #dddddd;
          }      
        `}</style>
      </tr>)
  }
}

VarRowOutput.defaultProps = {
  width: 150,
}

VarRowOutput.propTypes = {
  calcVar: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  unitsChanged: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default VarRowOutput