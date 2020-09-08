import PropTypes from 'prop-types'

class VarRow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const calcVar = this.props.calcVar    

    // If the variable is an output, make the input
    // text box readonly so the user cannot change it
    const type = calcVar.type
    let readonly = ''
    if (type == 'output')
      readonly='readonly'

    const unitOptions = calcVar.units.map((unit, idx) => {
      return (<option key={idx} value={unit[0]}>{unit[0]}</option>)
    })

    let validationState = 'ok'
    if(calcVar.validation) {
      validationState = calcVar.validation.state
    }

    return (
      <tr>
        <td className="var-name">{calcVar.name}</td>
        <td className="value"><input name={this.props.id}
          className={validationState}
          value={calcVar.dispVal} onChange={this.props.valueChanged} style={{ width: this.props.width }} readOnly={readonly}></input></td>
        <td className="units">
          <select name={this.props.id} value={calcVar.selUnit} onChange={this.props.unitsChanged}>
            {unitOptions}
          </select>
        </td>
        <style jsx>{`

          .var-name {
            padding-right: 10px;
          }

          .value input {
            width: 180px;
          }

          .value input.warning {
            border: 1px solid orange;
          }

          .value input.warning:focus {
            outline: 2px solid orange;
          }

          .value input.error {
            border: 1px solid red;
          }

          .value input.error:focus {
            outline: 2px solid red;
          }
          
          .units {
            width: 150px;
            font-size: 0.8em !important;
          }
        `}</style>
      </tr>)
  }
}

VarRow.defaultProps = {
  width: 150,
}

VarRow.propTypes = {
  calcVar: PropTypes.object.isRequired,
  valueChanged: PropTypes.func.isRequired,
  unitsChanged: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default VarRow