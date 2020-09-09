import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import Link from 'next/link'

import * as CalcViaThermalResistance from './calculators/via-thermal-resistance'
import * as Calc3DRotations from './calculators/3d-rotations'
import * as Calc555TimerRtRbC from './calculators/555-timer-astable-rt-rb-c'

class Home extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      calculators: []
    }
    
  }
  
  componentDidMount = () => {
    this.addCalc(CalcViaThermalResistance)
    this.addCalc(Calc3DRotations)
    this.addCalc(Calc555TimerRtRbC)
  }
  
  addCalc = (calcModule) => {
    console.log('addCalc() called.')
    let calculators = this.state.calculators
    calculators.push(calcModule)
    this.setState({
      calculators: calculators,
    })
  }
  
  render() {
    
    const calcList = this.state.calculators.map((calculator, idx) => {
      return <li key={idx}><Link href={'/calculators/' + calculator.metadata.id}><a>{calculator.metadata.name}</a></Link></li>
    })
    
    return (
      <div>
      <Head>
      <title>Home</title>
      <link rel='icon' href='/favicon.ico' />
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      </Head>
      
      <Nav />
      
      
      <ul>{calcList}</ul>
      
      
      <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
      `}</style>
      </div>
      )}
    }
    
    export default Home
    