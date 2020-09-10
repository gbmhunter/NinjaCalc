import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import Link from "next/link";

import * as CalcViaThermalResistance from "./calculators/via-thermal-resistance";
import * as Calc3DRotations from "./calculators/3d-rotations";
import * as Calc555TimerRtRbC from "./calculators/555-timer-astable-rt-rb-c";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calculators: [],
    };
  }

  componentDidMount = () => {
    this.addCalc(CalcViaThermalResistance);
    this.addCalc(Calc3DRotations);
    this.addCalc(Calc555TimerRtRbC);
  };

  addCalc = (calcModule) => {
    console.log("addCalc() called.");
    let calculators = this.state.calculators;
    calculators.push(calcModule);
    this.setState({
      calculators: calculators,
    });
  };

  render() {
    const calcList = this.state.calculators.map((calculator, idx) => {
      return (
        <Link href={"/calculators/" + calculator.metadata.id}>
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
      );
    });

    return (
      <div>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        </Head>

        <Nav />

        <div id="calculator-selection-grid">{calcList}</div>

        <style jsx>{`
          #calculator-selection-grid {
            display: flex;
            flex-direction: row;
          }
        `}</style>
      </div>
    );
  }
}

export default Home;
