import Head from "next/head"
import React from "react"

import Nav from "~/components/nav"
import Layout from "~/components/layout"
import VarRowV2 from "~/components/VarRowV2"
import CalcHelper from "~/utils/calc-helper"
import TileImage from "./tile-image.png"

export var metadata = {
  id: "standard-resistance-finder", // Make sure this has the same name as the directory this file is in
  name: "Standard Resistance Finder",
  description: "Find the closest E-series (e.g. E12, E96) resistor (preferred value) to your desired resistance.",
  categories: [ 'Electronics', 'Basic' ],
  tags: [ 'ohm', 'resistor', 'resistance', 'e', 'series', 'standard', 'preferred', 'values', 'e6', 'e12', 'e24', 'e48', 'e96', 'e128' ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          rtop: {
            name: "Top Resistance",
            direction: "input",
            dispVal: "10",
            rawVal: null,
            units: [
              ["Ω", 1e0],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "kΩ",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }, // rtop
        }, // calcVars
        eqFn: (calcVars) => {
          // coming soon...
        },
      }, // calc
    }; // this.state
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
        console.log("Setting " + calcVarId + " as output.")
        calc.calcVars[calcVarId].direction = "output"
      } else {
        console.log("Setting " + calcVarId + " as input.")
        calc.calcVars[calcVarId].direction = "input"
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
            Coming soon...  
          </div>
          <table>
            <tbody>
             
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
