import Head from "next/head";
import React from "react";

import Layout from "~/components/layout";
import VarRowV2 from "~/components/VarRowV2";
import VarRowV2Select from "~/components/VarRowV2Select";
import CalcHelper from "~/utils/calc-helper";
import { unitConversionConstants } from "~/utils/unit-conversion-constants";
import TileImage from "./tile-image.png";

export var metadata = {
  id: "microstrip-impedance", // Make sure this has the same name as the directory this file is in
  name: "Microstrip Impedance",
  description:
    "A calculator for working out the impedance of a standard microstrip style track.",
  categories: ["Electronics", "PCB Design"],
  tags: [
    "pcb",
    "track",
    "net",
    "impedance",
    "rf",
    "z",
    "microstrip",
    "route",
    "routing",
    "controlled",
    "icr",
    "wavelength",
    "microwave",
    "ghz",
  ],
  image: TileImage,
};

// ============================================================================================= //
// ============================================ CONSTANTS ====================================== //
// ============================================================================================= //
const NUM_MILS_PER_MM = 1000 / 25.4;

class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calc: {
        calcVars: {
          trackWidth: {
            name: "Track Width",
            type: "numeric",
            direction: "input",
            dispVal: "0.2",
            units: [
              ["um", 1e-6],
              ["mm", 1e-3],
            ],
            selUnit: "mm",
            validation: {
              fn: (value) => {
                if (value > 10e-3) {
                  return [
                    "warning",
                    "This is a wide track! Results may not be as accurate.",
                  ];
                }
                return ["ok", ""];
              },
            },
            helpText:
              "The width of the track (microstrip). This is normally measured in mm or mils.",
          }, // trackWidth

          trackThickness: {
            name: "Track Thickness",
            type: "numeric",
            direction: "input",
            dispVal: "35",
            units: [
              ["um", 1e-6],
              ["mm", 1e-3],
            ],
            selUnit: "um",
            validation: {
              fn: (value) => {
                if (value > 355.6e-6)
                  return [
                    "warning",
                    "This is a very large value for the track thickness (most are less than 355.6um, or 10oz.). Results may not be as accurate.",
                  ];
                return ["ok", ""];
              },
            },
            helpText:
              "The thickness of the track (microstrip). This is the same as the 'weight' of the copper layer the track is on. Usually measured in um or oz./sq foot.",
          }, // trackThickness

          substrateThickness: {
            name: "Substrate Thickness",
            type: "numeric",
            direction: "input",
            dispVal: "1.60",
            units: [
              ["um", 1e-6],
              ["mm", 1e-3],
            ],
            selUnit: "mm",
            validation: {
              fn: (value) => {
                if (value > 2e-3)
                  return [
                    "warning",
                    "This is a very large value for the substrate thickness (substrate thickness is typically 1.6mm or less). Results may not be as accurate.",
                  ];
                return ["ok", ""];
              },
            },
            helpText:
              "The thickness (height) of the substrate. This is also the distance between the track and the plane below it. On a two layer standard thickness PCB, this is usually about 1.6mm. Between two layers of a high-density PCB this value can be much smaller. Usually measured in mm or mils.",
          }, // substrateThickness

          substrateDielectric: {
            name: "Substrate Dielectric",
            type: "numeric",
            direction: "input",
            dispVal: '4.00',
            units: [["no unit", 1]],
            selUnit: "no unit",
            validation: {
              fn: (value) => {
                if (value > 20.0)
                  return [
                    "warning",
                    "This is a very large value for the substrate dielectric (dielectric constant is typically around 3-6). Results may not be as accurate.",
                  ];
                return ["ok", ""];
              },
            },
            helpText:
              "The dielectric of the substrate. For standard FR-4 PCB material, this value is around 4-4.7.",
          }, // substrateDielectric

          trackImpedance: {
            name: "Track Impedance",
            type: "numeric",
            direction: "output",
            units: [
              ["mΩ", 1e-3],
              ["Ω", 1],
              ["kΩ", 1e3],
              ["MΩ", 1e6],
            ],
            selUnit: "Ω",
            sigFig: 4,
            helpText:
              "The calculated impedance of the track (microstrip). This needs to match the impedance of what ever is connected to each end so that RF reflections do not occur. Value is usually between 20 and 150.",
          }, // trackImpedance
        }, // calcVars

        eqFn: (calcVars) => {
          // Read input variables          
          const w = calcVars.trackWidth.rawVal
          const t = calcVars.trackThickness.rawVal
          const h = calcVars.substrateThickness.rawVal
          const eR = calcVars.substrateDielectric.rawVal
          const W = w + (t / Math.PI) * (Math.log((2 * h) / t) + 1);
          const H = h - 2 * t;
          var eEff; // Effective substrate impedance
          var Z; // Track impedance          
          if (W / H < 1) {
            eEff =
              (eR + 1) / 2 +
              ((eR - 1) / 2) *
                (1 / Math.sqrt(1 + (12 * H) / W) +
                  0.04 * Math.pow(1 - W / H, 2));
            Z = (60 / Math.sqrt(eEff)) * Math.log((8 * H) / W + (W / 4) * H);
          } else {
            eEff = (eR + 1) / 2 + (eR - 1) / (2 * Math.sqrt(1 + (12 * H) / W));
            Z =
              (120 * Math.PI) /
              (Math.sqrt(eEff) *
                (W / H + 1.393 + (2 / 3) * Math.log(W / H + 1.444)));
          }          
          calcVars.trackImpedance.rawVal = Z
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
              This calculator can find the impedance of various microstrip and
              stripline style PCB tracks.
            </p>

            <p>
              To calculate the impedance of a microstrip, we need to know the
              following parameters of the PCB:
            </p>
            <p style={{ textAlign: "center" }}>
              \( w \) = width of the track (in meters)
              <br />
              \( t \) = thickness of the track (in meters)
              <br />
              \( h \) = thickness (or height) of the substrate (in meters)
              <br />
              \( \epsilon_r \) = the dielectric constant of the PCB substrate
            </p>

            <p>
              The following equations can then be used to calculate the
              impedance \(Z\) (in \(\Omega\)) of the microstrip:
            </p>

            <p>{String.raw`$$ W = w + \frac{t}{\pi} \left[ ln\left(\frac{2h}{t}\right) = 1 \right] $$`}</p>
            <p>$$ H = h - 2t $$</p>

            <p>{String.raw`If \( \frac{W}{H} < 1 \)`}</p>
            <p>{String.raw`$$ \epsilon_{eff} = \frac{\epsilon_r + 1}{2} + \frac{\epsilon_r - 1}{2}\left[\frac{1}{\sqrt{1 + 12\frac{H}{W}}} + 0.04\left(1 - \frac{W}{H}\right)^2\right] $$`}</p>
            <p>{String.raw`$$ Z = \frac{60}{\sqrt{\epsilon_{eff}}} ln\left(\frac{8H}{W} + \frac{W}{4H}\right) $$`}</p>

            <p>{String.raw`If \( \frac{W}{H} \geq 1 \)`}</p>
            <p>{String.raw`$$ \epsilon_{eff} = \frac{\epsilon_r + 1}{2} + \frac{\epsilon_r - 1}{2\sqrt{1 + 12\frac{H}{W}}} $$`}</p>
            <p>{String.raw`$$ Z = \frac{120\pi}{ \sqrt{\epsilon_{eff}} \left[ \frac{W}{H} + 1.393 + \frac{2}{3}ln(\frac{W}{H} + 1.444) \right] } $$`}</p>

            <p>
              Equations are from{" "}
              <a
                href="http://www.rfcafe.com/references/electrical/microstrip-eq.htm"
                target="_blank"
              >
                http://www.rfcafe.com/references/electrical/microstrip-eq.htm
              </a>
              .
            </p>

            <p>
              More information on microstrips can be found at{" "}
              <a
                href="http://blog.mbedded.ninja/pcb-design/impedance-controlled-routing/microstrips"
                target="_blank"
              >
                http://blog.mbedded.ninja/pcb-design/impedance-controlled-routing/microstrips
              </a>
              .
            </p>
          </div>
          <img src={require('./diagram.png')} style={{ width: '600px' }}/>
          <table style={{ maxWidth: '900px' }}>
            <tbody>
              <VarRowV2
                id="trackWidth"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                showHelpText={true}
                width={varWidth}
              />
              <VarRowV2
                id="trackThickness"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                showHelpText={true}
                width={varWidth}
              />
              <VarRowV2
                id="substrateThickness"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                showHelpText={true}
                width={varWidth}
              />              
              <VarRowV2
                id="substrateDielectric"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                showHelpText={true}
                width={varWidth}
              />
              <VarRowV2
                id="trackImpedance"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                showHelpText={true}
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
