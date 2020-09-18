import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from "~/components/VarRowV2";
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "dew-point-magnus", // Make sure this has the same name as the directory this file is in
  name: "Dew Point (Magnus Equation)",
  path: "calculators/electronics/sensors/dew-point-magnus",
  description: "Calculate the dew point using the Magnus equation.",
  categories: ["Electronics", "Sensors"],
  tags: [
    "dew",
    "point",
    "magnus",
    "temperature",
    "humidity",
    "condensation",
    "pressure",
  ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          airTemp_degC: {
            name: "Air Temperature",
            direction: "input",
            dispVal: "25",
            units: [["°C", 1]],
            selUnit: "°C",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The temperature of the air. This must be the same temperature at which the relative humidity was measured at.",
          }, // airTemp_degC
          relativeHumidity_perc: {
            name: "Relative Humidity",
            direction: "input",
            dispVal: "50",
            units: [["%", 1]],
            selUnit: "%",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature.",
          }, // relativeHumidity_perc
          dewPoint_degC: {
            name: "Dew Point",
            direction: "output",
            units: [["°C", 1]],
            selUnit: "°C",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.",
          }, // dewPoint_degC
          bCoefficient: {
            name: "b",
            direction: "input",
            dispVal: "17.625",
            units: [["no unit", 1]],
            selUnit: "no unit",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The b coefficient of the Magnus equation.",
          }, // bCoefficient
          cCoefficient: {
            name: "c",
            direction: "input",
            dispVal: "243.04",
            units: [["°C", 1]],
            selUnit: "°C",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The c coefficient of the Magnus equation.",
          }, // cCoefficient
        }, // calcVars
        eqFn: (calcVars) => {
          const airTemp_degC = calcVars.airTemp_degC.rawVal;
          const relativeHumidity_perc = calcVars.relativeHumidity_perc.rawVal;
          const dewPoint_degC = calcVars.dewPoint_degC.rawVal;
          const bCoefficient = calcVars.bCoefficient.rawVal;
          const cCoefficient = calcVars.cCoefficient.rawVal;

          if (calcVars.airTemp_degC.direction == "output") {
            calcVars.airTemp_degC.rawVal =
              (cCoefficient *
                ((bCoefficient * dewPoint_degC) / (cCoefficient + dewPoint_degC) -
                  Math.log(relativeHumidity_perc / 100.0))) /
              (bCoefficient +
                Math.log(relativeHumidity_perc / 100.0) -
                (bCoefficient * dewPoint_degC) / (cCoefficient + dewPoint_degC));
          } else if (calcVars.relativeHumidity_perc.direction == "output") {
            calcVars.relativeHumidity_perc.rawVal =
              100.0 *
              (Math.exp(
                (bCoefficient * dewPoint_degC) / (cCoefficient + dewPoint_degC)
              ) /
                Math.exp(
                  (bCoefficient * airTemp_degC) /
                    (cCoefficient + airTemp_degC)
                ));
          } else if (calcVars.dewPoint_degC.direction == "output") {
            const dewPointNumerator =
              cCoefficient *
              (Math.log(relativeHumidity_perc / 100.0) +
                (bCoefficient * airTemp_degC) /
                  (airTemp_degC + cCoefficient));
            const dewPointDenominator =
              bCoefficient -
              Math.log(relativeHumidity_perc / 100.0) -
              (bCoefficient * airTemp_degC) /
                (airTemp_degC + cCoefficient);
            calcVars.dewPoint_degC.rawVal =
              dewPointNumerator / dewPointDenominator;
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
              This calculator uses the <i>August-Roche-Magnus equation</i> (also
              known just as <i>Magnus equation</i>) to allow the calculation of
              either air temperature, relative humidity, or the dew point (as a
              temperature, also known as the <i>dew point temperature</i>), when
              you know the other two values.
            </p>

            <p>The dew point is given as:</p>

            <p>{String.raw`$$ T_{dp} = \frac{c*(ln(RH) + \frac{b \cdot T_{air}}{c \cdot T_{air}})}{b - ln(RH) - \frac{b \cdot T_{air}}{c \cdot T_{air}}} $$`}</p>

            <p style={{ textAlign: "center" }}>
              where:
              <br />
              {String.raw`\( T_{dp} \) = the dew point temperature, in degrees Celcius`}
              <br />
              \( RH \) = The relative humidity, as a number between 0-1 (i.e.
              percentage divided by 100)
              <br />
              \( b \) = A Magnus equation coefficient, which has no unit
              <br />
              \( c \) = A Magnus equation coefficient, in degrees Celcius
              <br />
            </p>

            <p>
              The exact values for the Magnus equation coefficients \(b\) and
              \(c\) depend on the exact literature that you the equation from.
              Common values for both are:
            </p>

            <p style={{ textAlign: "center" }}>
              \( b = 17.625 \)
              <br />
              {String.raw`\( c = 243.03^{\circ}C \)`}
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="airTemp_degC"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="relativeHumidity_perc"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="dewPoint_degC"
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

          <table>
            <tbody>
              <VarRowV2
                id="bCoefficient"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <VarRowV2
                id="cCoefficient"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
            </tbody>
          </table>
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
