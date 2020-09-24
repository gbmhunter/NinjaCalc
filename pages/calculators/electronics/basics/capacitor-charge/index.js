import Head from "next/head";
import React from "react";

import Nav from "~/components/nav";
import Layout from "~/components/layout";
import VarRowV2 from '~/components/calc-var-row'
import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import CalcHelper from "~/utils/calc-helper"
import TileImage from "./tile-image.png"

export var metadata = {
  id: "capacitor-charge", // Make sure this has the same name as the directory this file is in
  name: "Capacitor Charge (Q=CV)",
  path: 'calculators/electronics/basics/capacitor-charge',
  description: "Calculate either the charge, capacitance or voltage across a capacitor using Q=CV.",
  categories: [ 'Electronics', 'Basics' ],
  tags: [ 'capacitor', 'capacitance', 'charge', 'voltage', 'farad', 'coulomb', 'electron' ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: new Calc({
        calcVars: {
          charge: new CalcVar({
            name: "Charge",
            type: 'numeric',
            direction: "input",
            dispVal: "5u",
            metricPrefixes: true,
            units: [            
              ["C", 1e0],
            ],
            selUnit: "C",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // charge
          capacitance: new CalcVar({
            name: "Capacitance",
            type: 'numeric',
            direction: "input",
            dispVal: "4u",
            metricPrefixes: true,      
            units: [
              ["F", 1],
            ],
            selUnit: "F",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // capacitance
          voltage: new CalcVar({
            name: "Voltage",
            type: 'numeric',
            direction: "output",
            dispVal: "100",
            metricPrefixes: true,
            units: [              
              ["V", 1],
            ],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // voltage
        }, // calcVars
        eqFn: (calcVars) => {
          if (calcVars.charge.direction == "output") {
            calcVars.charge.rawVal =
              calcVars.capacitance.rawVal * calcVars.voltage.rawVal
          } else if (calcVars.capacitance.direction == "output") {
            calcVars.capacitance.rawVal =
              calcVars.charge.rawVal / calcVars.voltage.rawVal;
          } else if (calcVars.voltage.direction == "output") {
            calcVars.voltage.rawVal =
              calcVars.charge.rawVal / calcVars.capacitance.rawVal
          } else {
            throw Error("No variable was an output.")
          }
        },
      }), // calc
    } // this.state
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    CalcHelper.initCalc(this.state.calc)
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
              The following calculator works out either charge, capacitance, or
              voltage given the other two parameters, using the equation:
            </p>

            <p>$$ Q = CV $$</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( Q \) = charge in the capacitor
              <br />
              \( C \) = capacitance of the capacitor
              <br />
              \( V \) = voltage across the capacitor
              <br />
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="charge"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="capacitance"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="voltage"
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
