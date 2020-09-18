import React from "react"
import Head from "next/head"
import Link from "next/link"

import Layout from '~/components/layout'

import * as CalcCapacitorCharge from "./calculators/electronics/basics/capacitor-charge"
import * as CalcOhmsLaw from "./calculators/electronics/basics/ohms-law"
import * as CalcResistorDivider from "./calculators/electronics/basics/resistor-divider"
import * as CalcStandardResistanceFinder from "./calculators/electronics/basics/standard-resistance-finder"

import * as CalcFilterLowPassRC from "./calculators/electronics/filters/filter-low-pass-rc"

import * as Calc555TimerRtRbC from "./calculators/electronics/ics/555-timer-astable-rt-rb-c"

import * as CalcMicrostripImpedance from "./calculators/electronics/pcb-design/microstrip-impedance"
import * as CalcTrackCurrentIpc2152 from "./calculators/electronics/pcb-design/track-current-ipc2152"
import * as CalcTrackCurrentIpc2221a from "./calculators/electronics/pcb-design/track-current-ipc2221a"
import * as CalcViaCurrentIpc2221a from "./calculators/electronics/pcb-design/via-current-ipc2221a"
import * as CalcViaThermalResistance from "./calculators/electronics/pcb-design/via-thermal-resistance"

import * as CalcDewPointMagnus from "./calculators/electronics/sensors/dew-point-magnus"
import * as CalcNtcThermistor from "./calculators/electronics/sensors/ntc-thermistor"

import * as CalcBuckConverter from "./calculators/electronics/smps/buck-converter"

import * as Calc3DRotations from "./calculators/mathematics/3d-rotations"

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calculators: [],
    };
  }

  componentDidMount = () => {
    // electronics/basics
    this.addCalc(CalcCapacitorCharge)
    this.addCalc(CalcOhmsLaw)
    this.addCalc(CalcResistorDivider)
    this.addCalc(CalcStandardResistanceFinder)
    // electronics/filters
    this.addCalc(CalcFilterLowPassRC)
    // electronics/ics
    this.addCalc(Calc555TimerRtRbC)
    // electronics/pcb-design
    this.addCalc(CalcMicrostripImpedance)
    this.addCalc(CalcTrackCurrentIpc2152)
    this.addCalc(CalcTrackCurrentIpc2221a)
    this.addCalc(CalcViaCurrentIpc2221a)
    this.addCalc(CalcViaThermalResistance)
    // electronics/sensor
    this.addCalc(CalcDewPointMagnus)
    this.addCalc(CalcNtcThermistor)
    // electronics/smps
    this.addCalc(CalcBuckConverter)
    // mathematics
    this.addCalc(Calc3DRotations)
  }

  addCalc = (calcModule) => {
    let calculators = this.state.calculators
    calculators.push(calcModule)
    this.setState({
      calculators: calculators,
    })
  }

  render() {
    const calcList = this.state.calculators.map((calculator, idx) => {
      return (
        <Link key={calculator.metadata.id} href={calculator.metadata.path}>
        <div key={idx} className="calculator-tile">
          <div className="tile-image"><img src={calculator.metadata.image}></img></div>
          <div className="tile-title">
            
              <a>{calculator.metadata.name}</a>
            
          </div>
          <div className="tile-description">{calculator.metadata.description}</div>
          
          <style jsx>{`
            .calculator-tile {
              width: 220px;
              height: 350px;
              margin: 10px;
              padding: 5px;
              display: flex;
              flex-direction: column;

              border-radius: 5px;
              border-color: #cdcdcd;
              border-width: 1px;
              border-style: solid;
              box-shadow: 0 2px 4px rgba(0,0,0,0.20);
              transition: box-shadow 0.3s ease-in-out;
            }

            .calculator-tile:hover {
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }

            .tile-image {
              display: flex;
              justify-content: center;
            }

            .tile-image img {
              max-height: 140px;
            }

            .tile-title {
              max-height: 80px;
              text-align: center;
              font-weight: bold;
              font-size: 1.2em;
            }

            .tile-description {
              color: #555555;
              font-size: 0.9em;
            }
          `}</style>
        </div>
        </Link>
      )
    })

    return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        </Head>

        <div id="calculator-selection-grid">{calcList}</div>

        <style jsx>{`
          #calculator-selection-grid {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Home
