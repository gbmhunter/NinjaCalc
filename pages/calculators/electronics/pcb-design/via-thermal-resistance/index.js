import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRow from '~/components/calc-var-row'

import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import CalcHelper from '~/utils/calc-helper'

import TileImage from './tile-image.png'

export var metadata = {
  id: 'via-thermal-resistance',
  name: 'Via Thermal Resistance',  
  description: 'Calculator the thermal resistance of a via.',
  categories: ['Electronics', 'PCB Design'],
  tags: ['vias', 'electronics', 'thermal', 'resistance'],
  image: TileImage,
}

const MILS_TO_M = 25.4 / 1e6

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          viaDiameter: new CalcVar({
            name: 'Via Diameter',
            direction: 'input',
            dispVal: '0.3',
            units: [
              ['mm', 1e-3],
              ['mils', MILS_TO_M],
            ],
            selUnit: 'mm',
          }),
          platingThickness: new CalcVar({
            name: 'Plating Thickness',
            direction: 'input',
            dispVal: '35.0',
            units: [
              ['um', 1e-6],
              ['mils', MILS_TO_M],
            ],
            selUnit: 'um',
          }),
          viaHeight: new CalcVar({
            name: 'Via Height',
            direction: 'input',
            dispVal: '1.6',
            units: [
              ['mm', 1e-3],
              ['mils', MILS_TO_M],
            ],
            selUnit: 'mm',
          }),
          copperThermalConductivity: new CalcVar({
            name: 'Copper Thermal Conductivity',
            direction: 'input',
            dispVal: '401',
            units: [
              ['W•m-1•K-1', 1e0],
            ],
            selUnit: 'W•m-1•K-1',            
          }),
          viaThermalResistance: new CalcVar({
            name: 'Via Thermal Resistance',
            direction: 'output',
            dispVal: '0',
            units: [
              ['°C•W-1', 1e0],
            ],
            selUnit: '°C•W-1',
            sigFig: 3,
          }),
        }, // calcVars
        eqFn: (calcVars) => {      
          const viaCrossSectionalArea_m2 = Math.PI * calcVars.platingThickness.rawVal 
            * (calcVars.viaDiameter.rawVal - calcVars.platingThickness.rawVal)
          
          const viaThermalResistance = (1 / calcVars.copperThermalConductivity.rawVal) 
            * calcVars.viaHeight.rawVal / viaCrossSectionalArea_m2
          calcVars.viaThermalResistance.rawVal = viaThermalResistance
        }
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])    
  } // componentDidMount()

  valueChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleValueChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  unitsChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleUnitsChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars
    
    const varWidth = 150

    return (
      <Layout>
        <Head>
          <title>Via Thermal Resistance</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <table>
            <tbody>

              <VarRow id="viaDiameter" calcVar={calcVars.viaDiameter} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="platingThickness" calcVar={calcVars.platingThickness} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="viaHeight" calcVar={calcVars.viaHeight} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="copperThermalConductivity" calcVar={calcVars.copperThermalConductivity} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="viaThermalResistance" calcVar={calcVars.viaThermalResistance} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>

          <div className="calc-notes">

            <p><i>Via Diameter</i> is the diameter of the drilled hole which is then plated to form the via (i.e. the via's outer diameter). Standard <i>Via Plating Thickness</i> is approximately 25um (18um copper is the defined minimum in the IPC 600J-Class 2 standard). For a via going from the top layer to the bottom layer on a standard 1.6mm thick FR-4 PCB, the <i>Via Height</i> would be 1.6mm. A copper thermal conductivity of {'\\(401Wm^{-1}K^{-1}\\)'} is a good general estimate for copper plated into the via by electrolysis.</p>

            <p>
              The cross-sectional area {String.raw`\( A_{via} \)`} in units {String.raw`\( m^2 \)`} is calculated with:
            {String.raw`$$ A_{via} = \pi \cdot t_{plating} \cdot ( d_{via} - t_{plating} )  $$`}
              <span className="centered">
                where:<br />
                {String.raw`\( t_{plating} \)`} is the plating thinkness in {String.raw`\( m \)`}<br />
                {String.raw`\( d_{via} \)`} is the outer diameter of the via in {String.raw`\( m \)`}<br />
              </span>
            </p>


            <p>The thermal resistance {String.raw`\( \theta_{via} \)`} (with units {String.raw`\( °C \cdot W^{-1} \)`}) is then calculated with:
            {String.raw`$$ \theta_{via} = \frac{h_{via}}{\lambda_{copper} \cdot A_{via}} $$`}
              <span className="centered">
                where:<br />
                {String.raw`\( h_{via} \)`} is the height of the via in {String.raw`\( m \)`}<br />
                {String.raw`\( \lambda_{copper} \)`} is the thermal conductivity of copper in {String.raw`\( W \cdot m^{-1} \cdot K^{-1} \)`}<br />
              </span>
            </p>

            <p>Degrees Kelvin is interchangable with degrees Celcius in this calculator as we are always dealing with temperature differences.</p>
          </div>


        </div>
        <style jsx>{`

          .var-name {
            padding-right: 10px;
          }

          .value input {
            width: 180px;
          }

          .value input.warning {
            border: 2px solid orange;
          }

          .value input.error {
            border: 2px solid red;
          }
          
          .units {
            width: 150px;
            font-size: 0.8em !important;
          }

          .calc-notes {
            max-width: 700px;
          }

        `}</style>
      </Layout>
    )
  }
}

export default UI