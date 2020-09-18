import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from "~/components/VarRowV2";
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "buck-converter", // Make sure this has the same name as the directory this file is in
  name: "Buck Converter",
  path: "calculators/electronics/smps/buck-converter",
  description:
    "This calculator can be used to calculate the values of the critical component values for a buck converter.",
  categories: ["Electronics", "SMPS"],
  tags: ['buck, converter, smps, psu, power, voltage, current, inductor, conversion'],
  image: TileImage,
};

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          vIn_V: {
            name: "Input Voltage",
            symbol: "V_{in}",
            direction: "input",
            dispVal: "12",
            units: [["V", 1e0]],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The voltage provided to the input of the buck converter. Usually this is from a DC power supply or battery.",
          }, // vIn_V

          vOut_V: {
            name: "Output Voltage",
            symbol: "V_{out}",
            direction: "input",
            dispVal: "",
            units: [
              ["V", 1e0],              
            ],
            selUnit: "V",
            validation: {
              fn: (value, calc) => {
                if (value > calc.calcVars.vIn_V) return [ 'error', 'Vout must be less or equal to Vin.']
                return ["ok", ""];
              },
            },
            helpText:
              "The output voltage of a buck converter must be equal to or lower than the input voltage.",
          }, // vOut_V

          vD_V: {
            name: "Diode Voltage Drop",
            symbol: 'V_{D}',
            direction: "input",
            units: [["V", 1e0]],
            selUnit: "V",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The forward voltage drop across the diode when the diode is fully conducting. The diode may be replaced with an active switching element (such as a MOSFET), to reduce power losses. A MOSFET will have a much lower voltage drop than a diode. This is sometimes called the free-wheeling diode.",
          }, // vD_V

          vSw_V: {
            name: "Switching Element Voltage Drop",
            symbol: "V_{SW}",
            direction: "input",
            dispVal: "",
            units: [
              ["V", 1e0],              
            ],
            selUnit: "V",
            validation: {
              fn: (value, calc) => {
                if (value > calc.calcVars.vIn_V) return [ 'error', 'Vout must be less or equal to Vin.']
                return ["ok", ""];
              },
            },
            helpText: "The voltage drop across the switching element when the switch is fully ON. The switching element is typically a MOSFET.",
          }, // vSw_V

          dutyCycle_ratio: {
            name: "Duty Cycle",
            symbol: "D",
            direction: "output",            
            units: [
              ["%", 1e-2],
              ["no unit", 1e0],
            ],
            selUnit: "%",
            sigFig: 4,
            validation: {
              fn: (value) => {
                if (value < 0.0 || value > 1.0) return ['error', 'The duty cycle must be between 0 and 1 (or 0 and 100%)']
                return ["ok", ""];
              },
            },
            helpText: "The on/off duty cycle. It is given by the equation $$D = \frac{V_{out} - V_{D}}{V_{in} - V_{SW} - V_{D}} $$ It is typically expressed as a percentage.",
          }, // dutyCycle_ratio

          fSw_Hz: {
            name: "Switching Frequency",
            symbol: "f_{SW}",
            direction: "input",
            dispVal: "1000000",
            units: [
              ["Hz", 1e0],              
            ],
            selUnit: "Hz",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The switching frequency of the transistor (or other switching element).",
          }, // fSw_Hz

          iOutAvg_A: {
            name: "Average Output Current",
            symbol: "I_{out}",
            direction: "input",
            dispVal: "1",
            units: [
              ["A", 1e0],              
            ],
            selUnit: "A",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The average (DC) output current of the buck converter. Note that this is usually higher than the input current!",
          }, // iOutAvg_A

          iOutRipple_ratio: {
            name: "Output Current Ripple",
            symbol: "\frac{\Delta I_{out}}{I_{out}}",
            direction: "input",
            dispVal: "",
            units: [
              ["%", 1e-2],              
            ],
            selUnit: "%",
            validation: {
              fn: (value) => {
                if (value < 0.0 || value > 1.0) return ['error', 'The output current ripple must be between 0 and 1 (or 0 and 100%)']
                if (value > 0.5 ) return ['warning', 'The output current ripple should be less than 50% for sensible operation.']
                return ["ok", ""];
              },
            },
            helpText: "The is the percentage ripple of the output current. Strictly speaking, it is the ratio between the amplitude of the output current's AC component (i.e. the ripple), and the output current's DC component (the average output current). It is recommended that this is no more than 10-20%.",
          }, // iOutRipple_ratio

          ind_H: {
            name: "Inductance",
            symbol: "L",
            direction: "output",
            units: [
              ["H", 1e0],              
            ],
            selUnit: "H",
            sigFig: 4,
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText: "The inductance of the inductor \(L\) in the buck converter. It is given by the equation: $$ L = \frac{ (V_{in} - V{SW} - V_{out}) \cdot D }{ f_{SW} \cdot \Delta I_{out} } $$",
          }, // ind_H


        }, // calcVars
        eqFn: (calcVars) => {
          // Calculate inputs
          const vIn_V = calcVars.vIn_V.rawVal
          const vOut_V = calcVars.vOut_V.rawVal
          const vD_V = calcVars.vD_V.rawVal
          const vSw_V = calcVars.vSw_V.rawVal
          const fSw_Hz = calcVars.fSw_Hz.rawVal
          const iOutAvg_A = calcVars.iOutAvg_A.rawVal
          const iOutRipple_Ratio = calcVars.iOutRipple_ratio.rawVal
          
          // Calculate outputs
          const dutyCycle_ratio = (vOut_V - vD_V) / (vIn_V - vSw_V - vD_V)
          calcVars.dutyCycle_ratio.rawVal = dutyCycle_ratio
                  
          const iRipple_A = iOutAvg_A * iOutRipple_Ratio
          calcVars.ind_H.rawVal = ((vIn_V - vSw_V - vOut_V) * dutyCycle_ratio) / (fSw_Hz * iRipple_A)
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
          <img src={require('./diagram.png')}/>
          <table style={{ maxWidth: '900px' }}>
            <tbody>
              <VarRowV2
                id="vIn_V"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="vOut_V"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="vD_V"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="vSw_V"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="dutyCycle_ratio"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="fSw_Hz"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />    
              <VarRowV2
                id="iOutAvg_A"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />    
              <VarRowV2
                id="iOutRipple_ratio"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />    
              <VarRowV2
                id="ind_H"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
                showHelpText={true}
              />              
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>
          <div className="calc-notes"/>
            
          

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
