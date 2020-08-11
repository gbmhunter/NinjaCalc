import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'

export var metadata = {
  id: 'via-thermal-resistance',
  name: 'Via Thermal Resistance',
  categories: ['Electronics', 'PCB Design'],
  tags: ['vias', 'electronics', 'thermal', 'resistance']
}

const MILS_TO_M = 25.4/1e6

class UI extends React.Component {

  constructor(props) {
    super(props)
    console.log('dfff')
    this.state = {
      vars: {
        viaDiameterMm: {
          value: 0.3,
          units: [ 'mm', 'mils' ],
          selUnit: 'mm',
          validationState: 'ok',
          validationMsg: '',
        },
        platingThicknessUm: {
          value: 35.0,
          validationState: 'ok',
          validationMsg: '',
        },
        viaHeightMm:{
          value: 1.6,
          validationState: 'ok',
          validationMsg: ''
        },
        copperThermalConductivityWmK: {
          value: 401,
          validationState: 'ok',
          validationMsg: '',
        }
      }
    }
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    console.log('CalculatorViaThermalResistance mounted.')
  } // componentDidMount()

  inputChanged = (e) => {
    this.setState({
      [e.target.name]: e.target.valueAsNumber || e.target.value
    });
  }

  viaDiameterMmValueChanged = (e) => {
    const value = e.target.valueAsNumber || e.target.value
    let validationMsg = ''
    let validationState = 'ok'
    if (value <= 0) {
      validationState = 'error'
      validationMsg = 'Via diameter must be positive and greater than 0.'
    } if (value > 10.0) {
      validationState = 'warning'
      validationMsg = 'Via diameter is typically <10.0mm.'
    }
    let vars = this.state.vars
    vars.viaDiameterMm.value = value
    vars.viaDiameterMm.validationState = validationState
    vars.viaDiameterMm.validationMsg = validationMsg
    this.setState({
      vars: vars
    })
  }

  viaDiameterMmUnitsChanged = (e) => {
    let vars = this.state.vars
    vars.viaDiameterMm.selUnit = e.target.value
    this.setState({
      vars: vars
    })
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const vars = this.state.vars

    let viaDiameter_m = null
    if (vars.viaDiameterMm.selUnit == 'mm') {
      viaDiameter_m = vars.viaDiameterMm.value / 1e3
    } else if (vars.viaDiameterMm.selUnit = 'mils') {
      viaDiameter_m = vars.viaDiameterMm.value * MILS_TO_M  
    }

    const viaCrossSectionalArea_m2 = Math.PI * (vars.platingThicknessUm.value / 1e6) *
      (viaDiameter_m - (vars.platingThicknessUm.value / 1e6))
    const viaThermalResistance = (1 / vars.copperThermalConductivityWmK.value)
      * (vars.viaHeightMm.value / 1e3) / viaCrossSectionalArea_m2

    const validationMsgs = Object.keys(vars).map((key, idx) => {
      const validationMsg = vars[key].validationMsg
      console.log(validationMsg)
      if (validationMsg != '') {
        return <li key={idx}>{vars[key].validationMsg}</li>
      } else {
        return
      }
    })

    return (
      <Layout>
        <Head>
          <title>Via Thermal Resistance</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <table>
            <tbody>
              
              <VarRow calcVar={vars.viaDiameterMm} valueChanged={this.viaDiameterMmValueChanged} unitsChanged={this.viaDiameterMmUnitsChanged}/>
              
              <tr>
                <td className="var-name">Plating Thickness</td>
                <td className="value"><input name="platingThicknessUm"
                  value={vars.platingThicknessUm.value} onChange={this.inputChanged}></input></td>
                <td className="units">\(um\)</td>
              </tr>
              <tr>
                <td className="var-name">Via Height</td>
                <td className="value"><input name="viaHeightMm"
                  value={vars.viaHeightMm.value} onChange={this.inputChanged}></input></td>
                <td className="units">\(mm\)</td>
              </tr>
              <tr>
                <td className="var-name">Copper Thermal Conductivity</td>
                <td className="value"><input name="copperThermalConductivityWmK"
                  value={vars.copperThermalConductivityWmK.value} onChange={this.inputChanged}></input></td>
                <td className="units">\( W \cdot m^{'{'}-1{'}'} \cdot K^{'{'}-1{'}'} \)</td>
              </tr>
              <tr>
                <td className="var-name">Via Thermal Resistance</td>
                <td className="value"><input value={viaThermalResistance.toFixed(1)} readOnly></input></td>
                <td className="units">\( °C \cdot W^{'{'}-1{'}'} \)</td>
              </tr>
            </tbody>
          </table>

          {validationMsgs}

          <div style={{ height: 20 }}></div>

          <p className="calc-notes"><i>Via Diameter</i> is the diameter of the drilled hole which is then plated to form the via (i.e. the via's outer diameter). For a via going from the top layer to the bottom layer on a standard 1.6mm thick FR-4 PCB, the <i>Via Height</i> would be 1.6mm.</p>

        </div>
        <style jsx>{`

          .var-name {
            padding-right: 10px;
          }

          .value input {
            width: 150px;
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