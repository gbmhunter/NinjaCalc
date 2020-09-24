import Head from "next/head";
import React from "react";

import Layout from "~/components/layout-calc"
import VarRowV2 from '~/components/calc-var-row';
import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import CalcHelper from "~/utils/calc-helper";
import { StandardResistanceFinder } from "~/utils/standard-resistance-finder";
import TileImage from "./tile-image.png";
import { ESeriesRow } from "~/components/e-series-row"

export var metadata = {
  id: "standard-resistance-finder", // Make sure this has the same name as the directory this file is in
  name: "Standard Resistance Finder",  
  description:
    "Find the closest E-series (e.g. E12, E96) resistor (preferred value) to your desired resistance.",
  categories: ["Electronics", "Basics"],
  tags: [
    "ohm",
    "resistor",
    "resistance",
    "e",
    "series",
    "standard",
    "preferred",
    "values",
    "e6",
    "e12",
    "e24",
    "e48",
    "e96",
    "e128",
  ],
  image: TileImage,
}

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standardResistanceFinder: new StandardResistanceFinder(),
      calc: new Calc({
        calcVars: {
          desiredResistance: new CalcVar({
            name: "Desired Resistance",
            direction: "input",
            dispVal: "10.3k",            
            units: [
              ["Ω", 1e0],
            ],
            selUnit: "Ω",
            metricPrefixes: true,
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
          }), // desiredResistance
        }, // calcVars
        eqFn: (calcVars) => {
          // coming soon...
        },
      }), // calc
    } // this.state
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
    const outputVarWidth = 100;

    return (
      <Layout title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <div style={{ height: '50px' }} />
          <table>
            <tbody>
              <VarRowV2
                calcVars={this.state.calc.calcVars}
                id="desiredResistance"
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
              />
            </tbody>
          </table>
          <div style={{ height: "40px" }} />
          <table className="calc-vars" style={{ maxWidth: "700px" }}>
            <thead>
              <tr>
                <th>Series</th>
                <th>Closest Resistance (Ω)</th>
                <th>Percentage Error (%)</th>
                <th>Closest Equal Or Lower Resistance (Ω)</th>
                <th>Percentage Error (%)</th>
                <th>Closest Equal Or Higher Resistance (Ω)</th>
                <th>Percentage Error (%)</th>
              </tr>
            </thead>
            <tbody>
              <ESeriesRow
                calc={this.state.calc}
                eSeries={this.state.standardResistanceFinder.eSeriesOptions.E6}
              />
              <ESeriesRow
                calc={this.state.calc}
                eSeries={this.state.standardResistanceFinder.eSeriesOptions.E12}
              />
              <ESeriesRow
                calc={this.state.calc}
                eSeries={this.state.standardResistanceFinder.eSeriesOptions.E24}
              />
              <ESeriesRow
                calc={this.state.calc}
                eSeries={this.state.standardResistanceFinder.eSeriesOptions.E48}
              />
              <ESeriesRow
                calc={this.state.calc}
                eSeries={this.state.standardResistanceFinder.eSeriesOptions.E96}
              />
              <ESeriesRow
                calc={this.state.calc}
                eSeries={
                  this.state.standardResistanceFinder.eSeriesOptions.E192
                }
              />
            </tbody>
          </table>
          <div style={{ height: 20 }}></div>
          <div className="calc-notes">
            <h2>What Is This?</h2>

            <p>
              Enter your desired resistance, and this calculator will find the
              closest <i>preferred value</i> (purchasable resistance) in each
              one of the EIA <i>E series</i>, from E6 to E192. The percentage
              difference between your desired resistance and the preferred value
              is also shown for each E series.
            </p>

            <p>
              More information on the E series can be found at{" "}
              <a
                target="_blank"
                href="http://www.mbedded.ninja/electronics/components/resistors#the-e-series"
              >
                http://www.mbedded.ninja/electronics/components/resistors#the-e-series
              </a>
              .
            </p>

            <h2>Accuracy</h2>

            <p>
              Note that although the E48 series has more values per decade than
              say, the E24 series, you might find a closer resistance in the E24
              series due to the E6, E12 and E24 using a different number
              sequence to the E48, E96 and E192 series.
            </p>

            <p>
              If your desired resistance is exactly half-way (in percentage
              terms) between two preferred values, this calculator will choose
              the higher resistance.
            </p>
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
