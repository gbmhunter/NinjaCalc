import PropTypes from "prop-types";

class VarRowV2Select extends React.Component {
  constructor(props) {
    super(props);
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

    let validationState = "ok";
    if (calcVar.validation) {
      validationState = calcVar.validation.state;
    }

    console.log(calcVar.selOption);

    const options = calcVar.options.map((option, idx) => {
      return (
        <option key={idx} value={option}>
          {option}
        </option>
      );
    });

    return (
      <tr>
        <td className="var-name">{calcVar.name}</td>
        <td className="value">
          <select
            name={this.props.id}
            className={validationState}
            value={calcVar.selOption}
            onChange={this.props.valueChanged}
            style={{ width: this.props.width }}
          >
            {options}
          </select>
        </td>
        <td className="units"></td>
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
      </tr>
    );
  }
}

VarRowV2Select.defaultProps = {
  width: 150,
};

VarRowV2Select.propTypes = {
  calcVars: PropTypes.object.isRequired,
  valueChanged: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default VarRowV2Select;
