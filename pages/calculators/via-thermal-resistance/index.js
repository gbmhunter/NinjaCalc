import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'

class CalculatorViaThermalResistance extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viaDiameterMm: 0.3,
      platingThicknessUm: 35.0,
      viaHeightMm: 1.6,
      copperThermalConductivityWmK: 401,
    }
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub])
    console.log('CalculatorViaThermalResistance mounted.')
  } // componentDidMount()

  inputChanged = (e) => {
    this.setState({
      [e.target.name]: e.target.valueAsNumber || e.target.value
  });
  }

  render() {

    // Area of ring = pi * inner diameter * thickness
    const viaCrossSectionalArea_m2 = Math.PI*(this.state.platingThicknessUm/1e6)*( (this.state.viaDiameterMm/1e3)-(this.state.platingThicknessUm/1e6) )
    const viaThermalResistance = (1/this.state.copperThermalConductivityWmK)*(this.state.viaHeightMm/1e3)/viaCrossSectionalArea_m2

    return (
      <Layout>
        <Head>
          <title>Via Thermal Resistance</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <table>
            <tbody>
              <tr>
                <td className="var-name">Via Diameter</td>
                <td className="value"><input name="viaDiameterMm" value={this.state.viaDiameterMm} onChange={this.inputChanged}></input></td>
                <td className="units">\(mm\)</td>
              </tr>
              <tr>
                <td className="var-name">Plating Thickness</td>
                <td className="value"><input name="platingThicknessUm" value={this.state.platingThicknessUm} onChange={this.inputChanged}></input></td>
                <td className="units">\(um\)</td>
              </tr>
              <tr>
                <td className="var-name">Via Height</td>
                <td className="value"><input name="viaHeightMm" value={this.state.viaHeightMm} onChange={this.inputChanged}></input></td>
                <td className="units">\(mm\)</td>
              </tr>
              <tr>
                <td className="var-name">Copper Thermal Conductivity</td>
                <td className="value"><input name="copperThermalConductivityWmK" value={this.state.copperThermalConductivityWmK} onChange={this.inputChanged}></input></td>
                <td className="units">\( W \cdot m^{'{'}-1{'}'} \cdot K^{'{'}-1{'}'} \)</td>
              </tr>
              <tr>
                <td className="var-name">Via Thermal Resistance</td>
                <td className="value"><input value={viaThermalResistance.toFixed(1)} readOnly></input></td>
                <td className="units">\( °C \cdot W^{'{'}-1{'}'} \)</td>
              </tr>
            </tbody>
          </table>

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

export default CalculatorViaThermalResistance