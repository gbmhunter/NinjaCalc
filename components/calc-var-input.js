import React from 'react'
import PropTypes from "prop-types"
import ReactTooltip from 'react-tooltip'

/**
 * This class is used by itself and also as part of CalcVarRow.
 * Generic UI element that should be used for any calculator variable that uses a "standard" string-based input (even numerical variables).
 */
export class CalcVarInput extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const calcVar = this.props.calc.calcVars[this.props.id]

    // If the variable is an output, make the input
    // text box readonly so the user cannot change it
    let readonly = null
    let disabled = null
    let borderWidth = null
    if (calcVar.direction === 'input') {
      readonly = false
      disabled = false
      borderWidth = '' // Just let the border be as default for inputs 
    } else if (calcVar.direction === "output") {
      readonly = true
      disabled = true
      borderWidth = '0px' // Remove border for outputs
    } else {
      throw Error('Direction of "' + calcVar.direction + '" not supported.')
    }

    if (this.props.disabled) {
      disabled = true
    }

    const validationState = calcVar.validation.state

    let tooltipMsg = ''
    tooltipMsg += calcVar.helpText + '<br/><br/>'
    // The tooltip message string accepts HTML
    if (validationState === 'ok') {
      tooltipMsg += '<span style="color: #63ff6d; font-weight: bold;">Value is valid.</span>'
    } else if (validationState === 'warning') {
      tooltipMsg += '<span style="color: #ffa963; font-weight: bold;">WARNING:</span> ' + calcVar.validation.msg
    } else if (validationState === 'error') {
      tooltipMsg += '<span style="color: #FF8888; font-weight: bold;">ERROR:</span> ' + calcVar.validation.msg
    } else {
      throw Error('Validation state "' + validationState + '" attached to calc var "' + calcVar.name + '" not valid.')
    }

    let valueToDisp = null
    if (calcVar.type === 'numeric') {
      valueToDisp = calcVar.dispVal
    } else {
      valueToDisp = calcVar.value
    }

    return (
      <div>
        <ReactTooltip html={true} className="tooltip"/>
        {/* Wrap input in span, and attach tooltip to span. This is a work around because React Tooltip
        does not display the tooltip attached to an input when the input is disabled. */}
        <span data-tip={tooltipMsg}>
          <input
            name={this.props.id}
            className={validationState}
            value={valueToDisp}
            onChange={this.props.valueChanged}
            readOnly={readonly}
            disabled={disabled}          
            style={{ width: this.props.width, border: borderWidth }}
          ></input>
        </span>
        <style jsx>{`
          .var-name {
            padding-right: 10px;
          }

          input.warning {
            border: 1px solid orange;
            background-color: #ffe9bf;
          }

          input.warning:focus {
            outline: 2px solid orange;
          }

          input.error {
            border: 1px solid red;
            background-color: #ffbfbf;
          }

          input.error:focus {
            outline: 2px solid red;
          }
        `}</style>
      </div>
    );
  }
}

CalcVarInput.defaultProps = {
  width: 150,
};

CalcVarInput.propTypes = {
  id: PropTypes.string.isRequired,
  calc: PropTypes.object.isRequired,
  width: PropTypes.number,
};
