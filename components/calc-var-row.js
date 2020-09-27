import PropTypes from "prop-types"
import ReactTooltip from 'react-tooltip'
import {findDOMNode} from 'react-dom'

import * as CalcUnits from '~/utils/calc-units'

class VarRow extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()    
  }

  render() {
    const calcVars = this.props.calcVars;
    if (!calcVars) {
      throw Error("calcVars not provided.");
    }

    if (!this.props.id) {
      throw Error("id not provided to VarRowV2.");
    }

    const calcVar = calcVars[this.props.id];

    if (!calcVar) {
      throw Error('Calculator variable "' + this.props.id + '" not found.');
    }

    // If the variable is an output, make the input
    // text box readonly so the user cannot change it
    const direction = calcVar.direction;
    let readonly = false;
    let disabled = false;
    let unitsDisabled = false;
    if (this.props.disabled) {
      disabled = true;
      unitsDisabled = true;
    }
    if (direction == "output") {
      readonly = true;
      disabled = true;
    }

    let validationState = "ok"
    let tooltipMsg = ''
    if (calcVar.validation) {
      validationState = calcVar.validation.state
      tooltipMsg = calcVar.validation.msg
    }

    let valueHtml = null
    if (calcVar.type === 'numeric') {
      valueHtml = (<input                 
            name={this.props.id}
            className={validationState}
            value={calcVar.dispVal}
            onChange={this.props.valueChanged}
            style={{ width: this.props.width }}
            readOnly={readonly}
            disabled={disabled}
            data-tip={tooltipMsg}
          ></input>)  
    } else if (calcVar.type === 'select') {
      const options = calcVar.options.map((option, idx) => {
        return (
          <option key={idx} value={option}>
            {option}
          </option>
        )
      })
      valueHtml = (
        <select
            name={this.props.id}
            className={validationState}
            value={calcVar.selOption}
            onChange={this.props.valueChanged}
            style={{ width: this.props.width }}>
          {options}
        </select>
      )
    }

    let unitOptions = null
    if (calcVar.type === 'numeric'){
      unitOptions = calcVar.units.map((unit, idx) => {
        let unitName = null
        if (Array.isArray(unit)) {
          unitName = unit[0]
        } else if (unit instanceof CalcUnits.Units) {
          unitName = unit.name
        } else {
          throw Error('Unit type not supported.')
        }
        return (
          <option key={idx} value={unitName}>
            {unitName}
          </option>
        )
      })
    }

    let unitsHtml = null
    if (calcVar.type === 'numeric') {
      unitsHtml = (<td className="units">
          <select
            name={this.props.id}
            value={calcVar.selUnit}
            onChange={this.props.unitsChanged}
            disabled={unitsDisabled}
          >
            {unitOptions}
          </select>
        </td>)
    } else {
      // All over types don't have units, so just insert a blank cell
      unitsHtml = (<td></td>)
    }

    let rbHtml = null;
    if (this.props.rbGroup) {
      rbHtml = (
        <td>
          <input
            type="radio"
            value={this.props.id}
            name={this.props.rbGroup}
            onChange={this.props.rbChanged}
            checked={calcVar.direction == "output"}
          ></input>
        </td>
      );
    }

    let helpTextHtml = null
    if (this.props.showHelpText) {      
      helpTextHtml = (<td style={{ fontSize: '0.8em' }}>{calcVar.helpText}</td>)
    }

    return (
      <tr>
        <td className="var-name">{calcVar.name}</td>
        <td className="value">
          <ReactTooltip html={true} className="tooltip"/>
          {valueHtml}
        </td>
        {unitsHtml}
        {rbHtml}
        {helpTextHtml}
        <style jsx>{`
          .var-name {
            padding-right: 10px;
          }

          .value input {
            width: 180px;
          }

          .value input.warning {
            border: 2px solid orange;
          }

          .value input.warning:focus {
            outline: 2px solid orange;
          }

          .value input.error {
            border: 2px solid red;
          }

          .value input.error:focus {
            outline: 2px solid red;
          }

          .units {
            width: 80px;
            font-size: 0.8em !important;
          }
        `}</style>
      </tr>
    );
  }
}

VarRow.defaultProps = {
  width: 150,
  disabled: false,
  showHelpText: false,
};

VarRow.propTypes = {
  calcVars: PropTypes.object.isRequired,
  valueChanged: PropTypes.func.isRequired,
  unitsChanged: PropTypes.func.isRequired,
  width: PropTypes.number,
  showHelpText: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default VarRow;
