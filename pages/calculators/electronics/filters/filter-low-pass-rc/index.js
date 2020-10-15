import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from '~/components/calc-var-row';
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "filter-low-pass-rc", // Make sure this has the same name as the directory this file is in
  name: "Low-Pass RC Filter",  
  description:
    "The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering.",
  categories: ["Electronics", "Filters"],
  tags: [
    "rc",
    "filters",
    "filtering",
    "low-pass",
    "adc",
    "signal",
    "conditioning",
    "processing",
  ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          resistance: {
            name: "Resistance",
            direction: "input",
            dispVal: "10",
            rawVal: null,
            units: [
              ["mΩ", 1e-3],
              ["Ω", 1],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "kΩ",
            sigFig: 3,
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // resistance
          capacitance: {
            name: "Capacitance",
            direction: "input",
            dispVal: "2.2",
            rawVal: null,
            units: [
              ["pF", 1e-12],
              ["nF", 1e-9],
              ["uF", 1e-6],
              ["mF", 1e-3],
            ],
            selUnit: "nF",
            sigFig: 3,
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // capacitance
          fcutoff: {
            name: "Cutoff Frequency",
            direction: "output",
            dispVal: null,
            rawVal: null,
            units: [
              ["Hz", 1],
              ["kHz", 1e3],
              ["MHz", 1e6],
            ],
            selUnit: "kHz",
            sigFig: 3,
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // fcutoff
        }, // calcVars
        eqFn: (calcVars) => {
          const resistance = calcVars.resistance.rawVal;
          const capacitance = calcVars.capacitance.rawVal;
          const fcutoff = calcVars.fcutoff.rawVal;
          if (calcVars.resistance.direction == "output") {
            calcVars.resistance.rawVal =
              1 / (2 * Math.PI * fcutoff * capacitance);
          } else if (calcVars.capacitance.direction == "output") {
            calcVars.capacitance.rawVal =
              1 / (2 * Math.PI * fcutoff * resistance);
          } else if (calcVars.fcutoff.direction == "output") {
            calcVars.fcutoff.rawVal =
              1 / (2 * Math.PI * resistance * capacitance);
          } else {
            throw Error("No variable was an output.");
          }
        },
      }, // calc
    }; // this.state
    CalcHelper.initCalc(this.state.calc);
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
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
              The following calculator helps you works out the component values
              to design a low-pass, single-stage, passive RC filter. The cut-off
              frequency, \( f_c \), is given by:
            </p>

            <p>{String.raw`$$ f_c = \frac{1}{2\pi RC} $$`}</p>

            <p style={{ textAlign: "center" }}>
              where:
              <br />
              \( f_c \) = the cutoff frequency of the low-pass RC filter (a.k.a
              knee frequency, -3dB point)
              <br />
              \( R \) = resistance of the resistor
              <br />
              \( C \) = capacitance of the capacitor
              <br />
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="resistance"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="capacitance"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="fcutoff"
                calc={this.state.calc}
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
