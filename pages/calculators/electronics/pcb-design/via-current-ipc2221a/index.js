import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from '~/components/calc-var-row';
import VarRowV2Select from "~/components/VarRowV2Select";
import CalcHelper from "~/utils/calc-helper";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "via-current-ipc2221a", // Make sure this has the same name as the directory this file is in
  name: "Via Current (IPC-2221a)",  
  description:
    "PCB via current carrying capability calculator, using the IPC-2221A standard.",
  categories: ["Electronics", "PCB Design"],
  tags: [
    "pcb",
    "via",
    "current",
    "width",
    "carry",
    "heat",
    "hot",
    "temperature",
    "ipc",
    "ipc2221a",
    "ipc-2221a",
    "resistivity",
    "ampacity",
  ],
  image: TileImage,
};

// ============================================================================================= //
// ============================================ CONSTANTS ====================================== //
// ============================================================================================= //

const ipc2221ACoefficientK = 0.048
const ipc2221ACoefficientb = 0.44
const ipc2221ACoefficientc = 0.725

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {

          finishedHoleDiameter_m: {
            name: "Finished Hole Diameter",
            type: "numeric",
            direction: "input",
            dispVal: "1",
            units: [
              ["um", 1e-6],
              ["mm", 1e-3],              
            ],
            selUnit: "mm",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The finished hole diameter of the via. This is not the same as the drilled hole diameter, as the via is then plated.",
          }, // finishedHoleDiameter

          platingThickness_m: {
            name: "Plating Thickness",
            type: "numeric",
            direction: "input",
            dispVal: "20",
            units: [
              ["um", 1e-6]
            ],
            selUnit: "um",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The plating thickness of the via walls. This is not the same as the copper plane thickness. The plating thickness is typicaly 20um or occasionally 25um.",
          }, // platingThickness_m

          viaLength_m: {
            name: "Via Length",
            type: "numeric",
            direction: "input",
            dispVal: "1.6",
            units: [              
              ["mm", 1e-3],
            ],
            selUnit: "mm",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The length of the via. This is equal to the distance between the copper planes the via starts and ends on. For a simple 2-layer 1.6mm thick PCB, the via height is also 1.6mm. This could also be called the height of the via.",
          }, // viaLength_m

          tempRise_degC: {
            name: "Temperature Rise",
            type: "numeric",
            direction: "input",
            dispVal: "40",
            units: [              
              ["°C", 1e0],
            ],
            selUnit: "°C",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The maximum temperature rise above ambient you are allowing for the via. A rule-of-thumb for this value is between 10-40°C.",
          }, // tempRise_degC

          platedCopperResistivity_Ohmm: {
            name: "Plated Copper Resistivity",
            type: "numeric",
            direction: "input",
            dispVal: "19e-9",
            units: [              
              ["Ω⋅m", 1e0],
            ],
            selUnit: "Ω⋅m",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The resistivity of the plated copper which the via is made from.",
          }, // platedCopperResistivity_Ohmm

          specificThermalConductivity_WpmK: {
            name: "Specific Thermal Conductivity",
            type: "numeric",
            direction: "input",
            dispVal: "401.8",
            units: [              
              ["W/K⋅m", 1e0],
            ],
            selUnit: "W/K⋅m",
            validation: {
              fn: (value) => {
                return ["ok", ""];
              },
            },
            helpText:
              "The specific thermal conductivity, k, of the plated copper which the via is made from.",
          }, // specificThermalConductivity_WpmK

          viaCrossSectionalArea_m2: {
            name: "Via Cross-Sectional Area",
            type: "numeric",
            direction: "output",
            units: [
              ["um²", 1e-12],
              ["mm²", 1e-6],
            ],
            selUnit: "um²",
            sigFig: 4,
            helpText:
              "The cross-sectional area of the via (the area of the via as viewed from the top down).",
          }, // viaCrossSectionalArea_m2

          viaElectricalResistance_Ohms: {
            name: "Via Electrical Resistance",
            type: "numeric",
            direction: "output",
            units: [
              ["mΩ", 1e-3],              
            ],
            selUnit: "mΩ",
            sigFig: 4,
            helpText:
              "The electrical resistance of the via. This is the resistance as measured from the top to the bottom of the via.",
          }, // viaElectricalResistance_Ohms

          viaThermalResistance_degCpW: {
            name: "Via Thermal Resistance",
            type: "numeric",
            direction: "output",
            units: [
              ["°C/W", 1e0],              
            ],
            selUnit: "°C/W",
            sigFig: 4,
            helpText:
              "The thermal resistance of the via.",
          }, // viaThermalResistance_degCpW

          currentLimit_A: {
            name: "Via Current Limit",
            type: "numeric",
            direction: "output",
            units: [
              ["mA", 1e-3],
              ["A", 1e0],              
            ],
            selUnit: "A",
            sigFig: 4,
            helpText:
              "The maximum current the via can take before it rises to the specified temperature above ambient.",
          }, // currentLimit_A

        }, // calcVars

        eqFn: (calc) => {
          const calcVars = calc.calcVars
          // Read input variables
          const finishedHoleDiameter_m = calcVars.finishedHoleDiameter_m.rawVal;
          const platingThickness_m = calcVars.platingThickness_m.rawVal;
          const platedCopperResistivity_Ohmm = calcVars.platedCopperResistivity_Ohmm.rawVal
          const viaLength_m = calcVars.viaLength_m.rawVal
          const specificThermalConductivity_WpmK = calcVars.specificThermalConductivity_WpmK.rawVal
          const tempRise_degC = calcVars.tempRise_degC.rawVal

          const viaCrossSectionalArea_m2 = Math.PI * (finishedHoleDiameter_m + platingThickness_m) * platingThickness_m
          calcVars.viaCrossSectionalArea_m2.rawVal = viaCrossSectionalArea_m2

          const viaElectricalResistance_Ohms = (platedCopperResistivity_Ohmm * viaLength_m) / viaCrossSectionalArea_m2
          calcVars.viaElectricalResistance_Ohms.rawVal = viaElectricalResistance_Ohms

          const viaThermalResistance_degCpW = viaLength_m / (specificThermalConductivity_WpmK * viaCrossSectionalArea_m2)
          calcVars.viaThermalResistance_degCpW.rawVal = viaThermalResistance_degCpW

          // Perform unit conversions for IPC-2221A equation
          const viaCrossSectionalArea_Mills2 = viaCrossSectionalArea_m2 * Math.pow((1000.0 / 25.4) * 1000.0, 2)
          // Use the IPC-2221A equation
          const currentLimit_A = ipc2221ACoefficientK * Math.pow(tempRise_degC, ipc2221ACoefficientb) * Math.pow(viaCrossSectionalArea_Mills2, ipc2221ACoefficientc)
          calcVars.currentLimit_A.rawVal = currentLimit_A
        }, // eqFn
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
          <div style={{ maxWidth: "800px" }}>
            <p>
              Use this calculator to find the maximum current that a PCB via can
              handle (a.k.a. as it's <i>ampacity</i>). This calculator uses
              equations formed from the data presented in the IPC-2221A
              standard. This equation takes into account the via diameter, via
              plating thickness and permissible temperature rise.
            </p>

            <p>The equation used to calculate the maximum via current is:</p>

            <p>$$ I = \Delta T^b \cdot A^c $$</p>
            <p style={{ textAlign: "center" }}>
              where:
              <br />
              \( I \) = the max. current allowed through the via, in Amps.
              <br />
              {String.raw`\( \Delta T \) = the maximum permissible temperature rise of the via above ambient, in \(^{\circ}C\). \(20\) to \(40^{\circ}C\) is a common value for this.`}
              <br />
              \( b \) = A co-efficient from the IPC-2221A standard.
              <br />
              \( A \) = the cross-sectional area of the via (the area of the via
              as looking top down onto it), in \(mills^2\) (imperial).
              <br />
              \( c \) = A co-efficient from the IPC-2221A standard.
            </p>

            <p>
              This calculator, when given the via length and plated copper
              resistivity (default value provided, only change if necessary),
              will also find approximate values for the electrical and thermal
              resistance of the via.
            </p>

            <p>The via's resistance is calculated with the equation:</p>

            <p>{String.raw`$$ R = \frac{\rho l}{A} $$`}</p>
            <p style={{ textAlign: "center" }}>
              where:
              <br />
              \( R \) is the resistance of the via, as measured from it's top
              surface to it's bottom surface, in \(\Omega\).
              <br />
              {String.raw`\( \rho \) is the resistivity of plated copper, in \( \Omega \cdot m \). A default value of \(19e^{-9}\Omega m\) is provided for this variable.`}
              <br />
              \( l \) is the length of the via (a.k.a. it's height), in \(m\).
              <br />
              \( A \) is the cross-sectional area of the via (the area of the
              via as looking top down onto it), in \(m^2\).
            </p>

            <p>The thermal resistance is calculated with the equation:</p>

            <p>{String.raw`$$ R_{\theta} = \frac{l}{k \cdot A} $$`}</p>
            <p style={{ textAlign: "center" }}>
              where:
              <br />
              {String.raw`\( R_{\theta} \) is the thermal resistance of the via, in \(K/W\).`}
              <br />
              \( l \) is the length of the via (a.k.a. it's height), in \(m\).
              <br />
              \( k \) is the specific thermal conductivity of plated copper, in
              \( W/Km \). A default value of \(401.8W/K \cdot m \) is provided
              for this variable.
              <br />
              \( A \) is the cross-sectional area of the via (the area of the
              via as looking top down onto it), in \(m^2\).
            </p>

            <p>
              Remember this calculator does not take into account other nearby
              heat sources.
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="finishedHoleDiameter_m"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <VarRowV2
                id="platingThickness_m"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <VarRowV2
                id="viaLength_m"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <VarRowV2
                id="tempRise_degC"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                width={varWidth}
              />
              <VarRowV2
                id="platedCopperResistivity_Ohmm"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}                
              />
              <VarRowV2
                id="specificThermalConductivity_WpmK"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}                
              />
              <VarRowV2
                id="viaCrossSectionalArea_m2"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}                
              />
              <VarRowV2
                id="viaElectricalResistance_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}                
              />
              <VarRowV2
                id="viaThermalResistance_degCpW"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}                
              />
              <VarRowV2
                id="currentLimit_A"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
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
