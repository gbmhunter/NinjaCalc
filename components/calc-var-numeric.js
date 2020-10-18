import PropTypes from "prop-types"

/**
 * @deprecated Use CalcVarInput instead.
 */
export class CalcVarNumeric extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // If the variable is an output, make the input
    // text box readonly so the user cannot change it
    let readonly = false;
    let disabled = false;
    if (this.props.direction === "output") {
      readonly = true;
      disabled = true;
    }

    const validationState = "";

    return (
      <div>
        <input
          name={this.props.id}
          className={validationState}
          value={this.props.value}
          onChange={this.props.valueChanged}
          style={{ width: this.props.width }}
          readOnly={readonly}
          disabled={disabled}
          style={{ width: this.props.width }}
        ></input>
        <style jsx>{`
          .var-name {
            padding-right: 10px;
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
        `}</style>
      </div>
    );
  }
}

CalcVarNumeric.defaultProps = {
  width: 150,
};

CalcVarNumeric.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number,
};
