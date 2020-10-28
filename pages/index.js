import React from "react"
import Head from "next/head"
import Link from "next/link"
import { SpringGrid, makeResponsive, measureItems } from 'react-stonecutter'
// Using CSSGrid here does not seem to work, only SprintGrid produces
// animations when tiles appear/dissappear
const Grid = makeResponsive(measureItems(SpringGrid), {
  maxWidth: 1920,
  // minPadding is important to fix the problem if the grid items start going of the right-hand side of the screen.
  // make sure this value is set to the same width as the left-hand column (essentially the number of pixels that
  // the grid layout doesn't get)
  minPadding: 220, 
});

import Layout from '~/components/layout'
import TreeView from '~/components/tree-view/tree-view'

import * as CalcCapacitorCharge from "./calculators/electronics/basics/capacitor-charge"
import * as CalcLedCurrentLimitingResistor from './calculators/electronics/basics/led-current-limiting-resistor'
import * as CalcOhmsLaw from "./calculators/electronics/basics/ohms-law"
import * as CalcResistorDivider from "./calculators/electronics/basics/resistor-divider"
import * as CalcStandardResistanceFinder from "./calculators/electronics/basics/standard-resistance-finder"

import * as CalcWireGauge from "./calculators/electronics/cabling/wire-gauge-calculator"

import * as CalcFilterLowPassRC from "./calculators/electronics/filters/filter-low-pass-rc"

import * as Calc555TimerRtRbC from "./calculators/electronics/ics/555-timer-astable-rt-rb-c"
import * as CalcMp4558 from "./calculators/electronics/ics/mp4558-design-tool"

import * as CalcMicrostripImpedance from "./calculators/electronics/pcb-design/microstrip-impedance"
import * as CalcTrackCurrentIpc2152 from "./calculators/electronics/pcb-design/track-current-ipc2152"
import * as CalcTrackCurrentIpc2221a from "./calculators/electronics/pcb-design/track-current-ipc2221a"
import * as CalcViaCurrentIpc2221a from "./calculators/electronics/pcb-design/via-current-ipc2221a"
import * as CalcViaThermalResistance from "./calculators/electronics/pcb-design/via-thermal-resistance"

import * as CalcDewPointMagnus from "./calculators/electronics/sensors/dew-point-magnus"
import * as CalcNtcThermistor from "./calculators/electronics/sensors/ntc-thermistor"

import * as CalcBuckConverter from "./calculators/electronics/smps/buck-converter"

import * as Calc3DRotations from './calculators/mathematics/geometry/3d-rotations'

import * as CalcCrcCalculator from './calculators/software/crc-calculator'

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calculators: [],
      filterByCategories: 'All',
      searchText: '',
    }

    // ADD CALCULATORS TO STATE

    // electronics/basics
    this.addCalc(CalcCapacitorCharge)
    this.addCalc(CalcLedCurrentLimitingResistor)
    this.addCalc(CalcOhmsLaw)
    this.addCalc(CalcResistorDivider)
    this.addCalc(CalcStandardResistanceFinder)
    // electronics/cabling
    this.addCalc(CalcWireGauge)
    // electronics/filters
    this.addCalc(CalcFilterLowPassRC)
    // electronics/ics
    this.addCalc(Calc555TimerRtRbC)
    this.addCalc(CalcMp4558)
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
    // software
    this.addCalc(CalcCrcCalculator)
  }

  componentDidMount = () => {}

  addCalc = (calcModule) => {
    let calculators = this.state.calculators
    calculators.push(calcModule)
  }

  categoryTreeNodeClicked = (categories) => {    
    this.setState({
      filterByCategories: categories
    })
  }

  onSearchTextChange = (event) => {
    this.setState({
      searchText: event.target.value,
    })
  }

  /**
   * Returns the URL to get to a specific calculator.
   * 
   * @param {object} calcMetadata Metadata object of calculator you want the URL for.
   * @returns Absolute path (URL) to calculator (excl. domain). 
   */
  getPath = (calcMetadata) => {
    let path = ''
    path += 'calculators/'
    for (const category of calcMetadata.categories) {
      // Make the category path suitable
      // "PCB Design" -> "pcb-design"
      // "Electronics" -> "electronics"
      path += category.toLowerCase().replace(' ', '-') + '/'
    }
    // No tailing forward slash!
    path += calcMetadata.id
    return path
  }

  render() {
    let filteredCalculators = null

    // Filter calculators by selected category
    if (this.state.filterByCategories == 'All') {
      filteredCalculators = this.state.calculators
    } else {
      filteredCalculators = this.state.calculators.filter((calculator) => {                      
        // Remove the 'All'
        let filterNoAll = this.state.filterByCategories.slice()
        filterNoAll.shift()        
        for(let i in filterNoAll) {
          if(filterNoAll[i] != calculator.metadata.categories[i]) {            
            return false
          }
        }
        return true
      })
    }

    // Filter calculators by search text
    if(this.state.searchText != ''){      
      const searchTextLower = this.state.searchText.toLowerCase()
      filteredCalculators = filteredCalculators.filter((calculator) => {
        for (const tag of calculator.metadata.tags) {          
          if(tag.toLowerCase().includes(searchTextLower)) {
            return true
          }
        }
        // If we reach here, there was no match
        return false
      })
    }

    const TILE_WIDTH = 200
    const TILE_HEIGHT = 300

    const calcList = filteredCalculators.map((calculator, idx) => {
      return (<div key={calculator.metadata.id}>
        <Link key={calculator.metadata.id} href={this.getPath(calculator.metadata)}>
        <div key={idx} className="calculator-tile" style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}>
          <div className="tile-image"><img src={calculator.metadata.image}></img></div>
          <div className="tile-title">
            
              <a>{calculator.metadata.name}</a>
            
          </div>
          <div className="tile-description">{calculator.metadata.description}</div>
          
          <style jsx>{`
            .calculator-tile {                            
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

              cursor: pointer;
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
              max-width: 190px;
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
        </div>
      )
    })

    return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        </Head>

        <div id="content-wrapper" style={{ display: 'flex', width: '100%' }}>
          <div id="left-column" style={{ minWidth: '200px', maxWidth: '200px', flexGrow: 0, marginLeft: '20px' }}>
            <TreeView calculators={this.state.calculators} nodeClicked={this.categoryTreeNodeClicked}/>
            </div>
          <div id="right-column">
            <div id="search-box" style={{ paddingLeft: '20px' }}>
              Search:&nbsp;&nbsp;
              <input value={this.state.searchText} onChange={this.onSearchTextChange} style={{ width: '400px' }}/>
            </div>
          <div id="calculator-selection-grid">
            <Grid
              component="div"
              // columns={5}
              columnWidth={TILE_WIDTH}
              gutterWidth={15}
              gutterHeight={15}
              itemHeight={TILE_HEIGHT}
              springConfig={{ stiffness: 170, damping: 26 }}
            >
              {calcList}
            </Grid>
          </div>
        </div>

        <style jsx>{`
          #calculator-selection-grid {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          
        `}</style>
        </div>
      </Layout>
    )
  }
}

export default Home
