import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from '~/components/calc-var-row';
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.jpg";

export var metadata = {
  id: "ntc-thermistor", // Make sure this has the same name as the directory this file is in
  name: "NTC Thermistor",  
  description:
    "Calculate the temperature, resistance (reference or actual), or beta-coefficient of NTC thermistors.",
  categories: ["Electronics", "Sensors"],
  tags: [
    "temperature",
    "thermistor",
    "ntc",
    "negative",
    "coefficient",
    "sensor",
    "resistor",
  ],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          beta: {
            name: "Beta",
            direction: "input",
            dispVal: "",
            units: [["no unit", 1e0]],
            selUnit: "no unit",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The coefficient beta. This is usually specified in the thermistors datasheet.",
          }, // beta
          referenceResistance_Ohms: {
            name: "Reference Resistance",
            direction: "input",
            dispVal: "",
            units: [
              ["mΩ", 1e-3],
              ["Ω", 1e-0],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "kΩ",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The resistance of the thermistor at the reference point. This is usually when the thermistor is at 25°C.",
          }, // referenceResistance_Ohms

          referenceTemperature_K: {
            name: "Reference Temperature",
            direction: "input",
            units: [["K", 1e0]],
            selUnit: "K",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The temperature of the thermistor at the reference point. This is usually 25°C.",
          }, // referenceTemp_K

          thermistorResistance_Ohms: {
            name: "Thermistor Resistance",
            direction: "input",
            dispVal: "17.625",
            units: [
              ["mΩ", 1e-3],
              ["Ω", 1e-0],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "kΩ",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The present resistance of the thermistor, at temperature T.",
          }, // thermistorResistance_Ohms

          thermistorTemperature_K: {
            name: "Thermistor Temperature",
            direction: "output",
            dispVal: "",
            units: [["K", 1]],
            selUnit: "K",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The present temperature of the thermistor, at resistance R.",
          }, // thermistorTemp_K
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars
          // Read dependency variables
          const beta = calcVars.beta.rawVal
          const referenceResistance_Ohms = calcVars.referenceResistance_Ohms.rawVal
          const referenceTemperature_K = calcVars.referenceTemperature_K.rawVal
          const thermistorResistance_Ohms = calcVars.thermistorResistance_Ohms.rawVal
          const thermistorTemperature_K = calcVars.thermistorTemperature_K.rawVal
          
          if (calcVars.beta.direction == "output")
          {
            calcVars.beta.rawVal = Math.log(thermistorResistance_Ohms / referenceResistance_Ohms) / (1 / thermistorTemperature_K - 1 / referenceTemperature_K)  
          } 
          else if (calcVars.referenceResistance_Ohms.direction == "output")
          {
            calcVars.referenceResistance_Ohms.rawVal = thermistorResistance_Ohms / (Math.exp(beta * (1 / thermistorTemperature_K - 1 / referenceTemperature_K)))            
          }
          else if (calcVars.referenceTemperature_K.direction == "output")
          {
            calcVars.referenceTemperature_K.rawVal = 1.0 / (1.0 / thermistorTemperature_K - (1.0 / beta) * Math.log(thermistorResistance_Ohms / referenceResistance_Ohms))
          }
          else if (calcVars.thermistorResistance_Ohms.direction == 'output')
          {
            calcVars.thermistorResistance_Ohms.rawVal = referenceResistance_Ohms * Math.exp(beta * (1.0 / thermistorTemperature_K - 1.0 / referenceTemperature_K))
          } 
          else if (calcVars.thermistorTemperature_K.direction == 'output')
          {
            calcVars.thermistorTemperature_K.rawVal = 1.0 / (1.0 / referenceTemperature_K + (1.0 / beta) * Math.log(thermistorResistance_Ohms / referenceResistance_Ohms))
          }
          else
          {
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
          <table>
            <tbody>
              <VarRowV2
                id="beta"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="referenceResistance_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="referenceTemperature_K"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="thermistorResistance_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <VarRowV2
                id="thermistorTemperature_K"
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
          <div className="calc-notes">
            <p>
              This calculator allows the calculation of various thermistor
              properties by using the <i>Beta equation</i>. The Beta equation is
              commonly used in microcontroller code to work out the thermistor
              temperature after the micro's ADC measures the thermistors
              resistance.
            </p>

            <p>The beta equation is:</p>

            <p>{String.raw`$$ \frac{1}{T} = \frac{1}{T_0} + \frac{1}{\beta} ln (\frac{R}{R_0}) $$`}</p>

            <p style={{ textAlign: "center" }}>
              where:
              <br />
              \( \beta \) is the Beta co-efficient. This is usually specified in
              the thermistors datasheet.
              <br />
              {String.raw`\( T_0 \) is the temperature at the reference point, in Kelvin. This is usually \(25^{\circ}C\).`}
              <br />
              \( R_0 \) is the resistance at the reference point, in Ohms.
              <br />
              \( T \) is the thermistor temperature, with measured resistance \(
              R \), in Kelvin.
              <br />
              \( R \) is the thermistor resistance, measured at temperature
              \(T\), in Ohms.
              <br />
            </p>

            <p>
              This equation can be re-arranged to calculate any of the variables
              when the other 4 are known.
            </p>

            <p>To find \(\beta\):</p>

            <p>{String.raw`$$ \beta = \frac{ln(\frac{R}{R_0})}{\frac{1}{T} - \frac{1}{T_0}} $$`}</p>

            <p>To find \(R_0\):</p>

            <p>{String.raw`$$ R_0 = \frac{R}{e^{\beta (\frac{1}{T} - \frac{1}{T_0})}} $$`}</p>

            <p>{String.raw`To find \(T_0\).`}</p>

            <p>{String.raw`{$$ T_0 = \frac{1}{\frac{1}{T} - \frac{1}{\beta}ln(\frac{R}{R_0})} $$`}</p>

            <p>To find \(R\):</p>

            <p>{String.raw`$$ R = R_0 e^{\beta (\frac{1}{T} - \frac{1}{T_0})} $$`}</p>

            <p>To find \(T\):</p>

            <p>{String.raw`$$ T = \frac{1}{\frac{1}{T_0} + \frac{1}{\beta}ln(\frac{R}{R_0})} $$`}</p>
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
