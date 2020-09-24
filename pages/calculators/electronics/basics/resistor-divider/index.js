import Head from "next/head"
import React from "react"

import Layout from "~/components/layout-calc"
import VarRowV2 from '~/components/calc-var-row'
import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import CalcHelper from "~/utils/calc-helper"
import TileImage from "./tile-image.png"

export var metadata = {
  id: "resistor-divider", // Make sure this has the same name as the directory this file is in
  name: "Resistor Divider",  
  description: "Resistor dividers are a simple, widely-used circuit primitive for reducing a voltage based on a fixed ratio.",
  categories: [ 'Electronics', 'Basics' ],
  tags: [ 'resistor', 'resistance', 'voltage', 'divider', 'reduce', 'adc', 'translate', 'level', 'shift' ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: new Calc({
        calcVars: {
          vin: new CalcVar({
            name: "Input Voltage",
            type: 'numeric',
            direction: "input",
            dispVal: "5",
            metricPrefixes: true,
            units: [
              ["V", 1e0],
            ],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // vin
          rtop: new CalcVar({
            name: "Top Resistance",
            type: 'numeric',
            direction: "input",
            dispVal: "10k",
            metricPrefixes: true,
            units: [
              ["Ω", 1e0],
            ],
            selUnit: "Ω",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // rtop
          rbot: new CalcVar({
            name: "Bottom Resistance",
            type: 'numeric',
            direction: "input",
            dispVal: "10k",
            metricPrefixes: true,
            units: [
              ["Ω", 1e0],
            ],
            selUnit: "Ω",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // rbot
          vout: new CalcVar({
            name: "Output Voltage",
            type: 'numeric',
            direction: "output",            
            metricPrefixes: true,
            units: [
              ["V", 1e0],
            ],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // vout
        }, // calcVars
        eqFn: (calcVars) => {
          let vin = calcVars.vin.rawVal
          let rtop = calcVars.rtop.rawVal
          let rbot = calcVars.rbot.rawVal
          let vout = calcVars.vout.rawVal
          if (calcVars.vin.direction == "output") {
            calcVars.vin.rawVal = ((vout * (rtop + rbot)) / rbot)
          } else if (calcVars.rtop.direction == "output") {
            calcVars.rtop.rawVal = ((rbot * (vin - vout)) / vout)
          } else if (calcVars.rbot.direction == "output") {
            calcVars.rbot.rawVal = ((rtop * vout) / (vin - vout))
          } else if (calcVars.vout.direction == "output") {
            calcVars.vout.rawVal = ((vin * rbot) / (rtop + rbot))
          } else {
            throw Error("No variable was an output.")
          }
        },
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])
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
      <Layout title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">          
          <table className="calc-vars">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Units</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <VarRowV2
                id="vin"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="rtop"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="rbot"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="vout"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
            </tbody>
          </table>

          <div style={{ minHeight: '40px' }}></div>

          <div className="calc-notes">
            
            The following calculator works out either \( V_{'{'}in{'}'} \), \( R_1 \), \( R_2 \), or \( V_{'{'}out{'}'}\), given the other three parameters, using the resistive voltage divider equation:

            $$ V_{'{'}out{'}'}=\frac{'{'}R_2{'}'}{'{'}R_1+R_2{'}'}V_{'{'}in{'}'} $$

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              \( V_{'{'}in{'}'} \) = input voltage<br/>
              \( R_1 \) = resistance of resistor 1 (see diagram)<br/>
              \( R_2 \) = resistance of resistor 2 (see diagram)<br/>
              \( V_{'{'}out{'}'} \) = output voltage
            </p>

            {String.raw`It is assumed that the output impedance on \( V_{out} \) is significantly higher than \( R_2 \) so that it doesn't matter (for example, \( V_{out} \) is connected to an op-amp input, analogue microcontroller input or similar).
            The quiescent current through the divider, \( I_q \), is also calculated, which can be useful to know when designing power-saving circuits. The equation to find \( I_q \) is:

            $$ I_q = \frac{V_{in}}{R_1+R_2} $$`}
            
          </div>
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
