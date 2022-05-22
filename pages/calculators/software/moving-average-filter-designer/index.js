import Head from 'next/head'
import React from 'react'

import LayoutCalc from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from './tile-image.png'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: 'moving-average-filter-designer', // Make sure this has the same name as the directory this file is in
  name: 'Moving Average Filter Designer',
  description:
    'Tool to help you design a moving average filter.',
  categories: [ 'Software' ], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: [ 'software' ],
  image: TileImage,
}

class CalcUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    } // this.state
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  } // componentDidMount()

  render = () => {    
    
    return (
      <LayoutCalc title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          Window size: 
        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }
        `}</style>
      </LayoutCalc>
    )
  } // render
} // CalcUI

export default CalcUI
