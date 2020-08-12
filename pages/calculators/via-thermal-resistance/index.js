import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'
import VarRowOutput from '~/components/VarRowOutput'

export var metadata = {
  id: 'via-thermal-resistance',
  name: 'Via Thermal Resistance',
  categories: ['Electronics', 'PCB Design'],
  tags: ['vias', 'electronics', 'thermal', 'resistance']
}

const MILS_TO_M = 25.4 / 1e6

class UI extends React.Component {

  constructor(props) {
    super(props)
    console.log('dfff')
    this.state = {
      vars: {
        viaDiameter: {
          value: 0.3,
          units: [
            ['mm', 1e-3],
            ['mils', MILS_TO_M],
          ],
          selUnit: 'mm',
          validationState: 'ok',
          validationMsg: '',
        },
        platingThickness: {
          value: 35.0,
          units: [
            ['um', 1e-6]
          ],
          selUnit: 'um',
          validationState: 'ok',
          validationMsg: '',
        },
        viaHeight: {
          value: 1.6,
          units: [
            ['mm', 1e-3],
            ['mils', MILS_TO_M],
          ],
          selUnit: 'mm',
          validationState: 'ok',
          validationMsg: ''
        },
        copperThermalConductivity: {
          value: 401,
          units: [
            ['W•m-1•K-1', 1e0],
          ],
          selUnit: 'W•m-1•K-1',
          validationState: 'ok',
          validationMsg: '',
        },
        viaThermalResistance: {
          type: 'output',
          units: [
            ['°C•W-1', 1e0],
          ],
          selUnit: '°C•W-1',
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

  viaDiameterValueChanged = (e) => {
    let vars = this.state.vars
    const value = e.target.valueAsNumber || e.target.value
    let validationMsg = ''
    let validationState = 'ok'
    const viaDiameter_m = this.scaleByUnits(value, vars.viaDiameter.units, vars.viaDiameter.selUnit)
    console.log('viaDiameter_m=' + viaDiameter_m)
    if (viaDiameter_m <= 0) {
      validationState = 'error'
      validationMsg = 'Via diameter must be positive and greater than 0.'
    } if (viaDiameter_m > 10.0e-3) {
      validationState = 'warning'
      validationMsg = 'Via diameter is typically <10.0mm.'
    }

    vars.viaDiameter.value = value
    vars.viaDiameter.validationState = validationState
    vars.viaDiameter.validationMsg = validationMsg
    this.setState({
      vars: vars
    })
  }

  valueChanged = (e) => {
    let vars = this.state.vars
    const value = e.target.valueAsNumber || e.target.value
    vars[e.target.name].value = value
    this.setState({
      vars: vars
    })
  }

  unitsChanged = (e) => {
    let vars = this.state.vars
    vars[e.target.name].selUnit = e.target.value
    this.setState({
      vars: vars
    })
  }

  /**
   * Scales a raw value by the selected unit for this value, typically
   * resulting in a value in SI units. 
   * 
   * @param {*} value The raw value to scale.
   * @param {*} units Array of all units for this calculator variable. Each element should consist of [ <name>, <multiplier> ].
   * @param {*} selUnit The selected unit name.
   * @returns The scaled value.
   */
  scaleByUnits(value, units, selUnit) {
    const unit = units.filter(unit => {
      return unit[0] == selUnit
    })[0]
    const scaledValue = value * unit[1]
    return scaledValue
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const vars = this.state.vars

    const viaDiameter_m = this.scaleByUnits(vars.viaDiameter.value, vars.viaDiameter.units, vars.viaDiameter.selUnit)
    console.log('viaDiameter_m=' + viaDiameter_m)

    const viaCrossSectionalArea_m2 = Math.PI * (vars.platingThickness.value / 1e6) *
      (viaDiameter_m - (vars.platingThickness.value / 1e6))
    const viaThermalResistance = (1 / vars.copperThermalConductivity.value)
      * (vars.viaHeight.value / 1e3) / viaCrossSectionalArea_m2

    const validationMsgs = Object.keys(vars).map((key, idx) => {
      const validationMsg = vars[key].validationMsg
      console.log(validationMsg)
      if (validationMsg != '') {
        return <li key={idx}>{vars[key].validationMsg}</li>
      } else {
        return
      }
    })

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

              <VarRow id="viaDiameter" name="Via Diameter" calcVar={vars.viaDiameter} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="platingThickness" name="Plating Thickness" calcVar={vars.platingThickness} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="viaHeight" name="Via Height" calcVar={vars.viaHeight} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="copperThermalConductivity" name="Copper Thermal Conductivity" calcVar={vars.copperThermalConductivity} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowOutput id="viaThermalResistance" name="Via Thermal Resistance" calcVar={vars.viaThermalResistance} value={viaThermalResistance} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          {validationMsgs}

          <div style={{ height: 20 }}></div>

          <div className="calc-notes">
          <p><i>Via Diameter</i> is the diameter of the drilled hole which is then plated to form the via (i.e. the via's outer diameter). Standard <i>Via Plating Thickness</i> is approximately 25um. For a via going from the top layer to the bottom layer on a standard 1.6mm thick FR-4 PCB, the <i>Via Height</i> would be 1.6mm. A copper thermal conductivity of {'\\(401Wm^{-1}K^{-1}\\)'} is a good general estimate for copper plated into the via by electrolysis.</p>

          <p>
            The cross-sectional area {String.raw`\( A_{via} \)`} in units {String.raw`\( m^2 \)`} is calculated with:
            {String.raw`$$ A_{via} = \pi \cdot t_{plating} \cdot ( d_{via} - t_{plating} )  $$`}
            <span className="centered">
              where:<br />
              {String.raw`\( t_{plating} \)`} is the plating thinkness in {String.raw`\( m \)`}<br />
              {String.raw`\( d_{via} \)`} is the outer diameter of the via in {String.raw`\( m \)`}<br />
              {String.raw`\( d_{via} \)`} is the outer diameter of the via in {String.raw`\( m \)`}<br />
            </span>
          </p>


          <p>The thermal resistance {String.raw`\( \theta_{via} \)`} (with units {String.raw`\( °C \cdot W^{-1} \)`}) is then calculated with:
            {String.raw`$$ \theta_{via} = \frac{h_{via}}{\lambda_{copper} \cdot A_{via}} $$`}
            <span className="centered">
              where:<br />
              {String.raw`\( h_{via} \)`} is the height of the via in {String.raw`\( m \)`}<br />
              {String.raw`\( \lambda_{copper} \)`} is the thermal conductivity of the copper in {String.raw`\( W \cdot m^{-1} \cdot K^{-1} \)`}<br />
            </span>
          </p>
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