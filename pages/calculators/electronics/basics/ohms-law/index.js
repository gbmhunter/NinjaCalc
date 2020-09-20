import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from "~/components/VarRowV2";
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "ohms-law", // Make sure this has the same name as the directory this file is in
  name: "Ohm's Law",
  path: 'calculators/electronics/basics/ohms-law',
  description:
    "The hammer in any electrical engineers toolbox. calculate voltage, resistance and current using Ohm's law.",
  categories: ["Electronics", "Basics"],
  tags: ["electronics", "ohms", "law", "resistor"],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          voltage: {
            name: "Voltage",
            direction: "input",
            dispVal: "12",
            rawVal: null,
            units: [
              ["uV", 1e-6],
              ["mV", 1e-3],
              ["V", 1],
              ["kV", 1e3],
            ],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // voltage
          current: {
            name: "Current",
            direction: "output",
            dispVal: "1",
            rawVal: null,
            units: [
              ["uA", 1e-6],
              ["mA", 1e-3],
              ["A", 1],
            ],
            selUnit: "mA",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // current
          resistance: {
            name: "Resistance",
            direction: "input",
            dispVal: "100",
            rawVal: null,
            units: [
              ["mΩ", 1e-3],
              ["Ω", 1],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "kΩ",
            validation: {
              fn: (value) => {
                if (isNaN(value)) {
                  return ["error", "Resistance must be a number."];
                }
                if (value <= 0) {
                  return ["error", "Resistance must be greater than 0."];
                }
                return ["ok", ""];
              },
            },
          }, // resistance
        }, // calcVars
        eqFn: (calcVars) => {
          if (calcVars.voltage.direction == "output") {
            calcVars.voltage.rawVal =
              calcVars.current.rawVal * calcVars.resistance.rawVal;
          } else if (calcVars.current.direction == "output") {
            calcVars.current.rawVal =
              calcVars.voltage.rawVal / calcVars.resistance.rawVal;
          } else if (calcVars.resistance.direction == "output") {
            calcVars.resistance.rawVal =
              calcVars.voltage.rawVal / calcVars.current.rawVal;
          } else {
            throw Error("No variable was an output.");
          }
        },
      }, // calc
    }; // this.state
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    CalcHelper.initCalc(this.state.calc);
    this.setState({
      calc: this.state.calc,
    });
  } // componentDidMount()

  valueChanged = (e) => {
    let calc = this.state.calc;
    CalcHelper.handleValueChanged(calc, e);
    this.setState({
      calc: calc,
    });
  };

  unitsChanged = (e) => {
    let calc = this.state.calc;
    CalcHelper.handleUnitsChanged(calc, e);
    this.setState({
      calc: calc,
    });
  };

  rbChanged = (e) => {
    console.log("rbChanged() called. e.target=");
    console.log(e.target);
    let calc = this.state.calc;
    let varName = e.target.value;
    for (let calcVarId in calc.calcVars) {
      console.log(calcVarId);
      if (calcVarId == e.target.value) {
        console.log("Setting " + calcVarId + " as output.");
        calc.calcVars[calcVarId].direction = "output";
      } else {
        console.log("Setting " + calcVarId + " as input.");
        calc.calcVars[calcVarId].direction = "input";
      }
    }
    this.setState({
      calc: calc,
    });
  };

  render = () => {
    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars;
    const varWidth = 100;

    return (
      <Layout>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <div className="calc-notes">
            <p>
              The following calculator works out either voltage, current or
              resistance, given the other two parameters, using the equation:
            </p>

            <p>$$ V = IR $$</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( V \) = voltage across the resistor
              <br />
              \( I \) = current through the resistor
              <br />
              \( R \) = resistance of the resistor
              <br />
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="voltage"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="current"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="resistance"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>
        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }
        `}</style>
      </Layout>
    );
  };
}

export default UI;
