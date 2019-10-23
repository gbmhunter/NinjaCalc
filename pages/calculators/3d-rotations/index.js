import Head from 'next/head'
import React from 'react'
import { add, divide, matrix, multiply, norm } from 'mathjs'

import Layout from '~/components/layout'
import Rotations from '~/utils/rotations'

class Calculator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selInputType: 'quat',
      angleAxis: {
        angle: 0,
        x: 0,
        y: 0,
        z: 0,
      },
      angleAxisDisplay: {
        angle: '0',
        x: '0',
        y: '0',
        z: '0',
      },
      angleAxisMsg: '',
      quat: matrix([-0.2234, 0.0, 0.8944, -0.4472]), // wxyz. The initial rotation is driven from this
      quatDisplay: ['-0.2234', '0.0', '0.8944', '-0.4472'],
      rotMatrix: matrix([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]),
      rotMatrixDisplay: [
        ['0', '0', '0'],
        ['0', '0', '0'],
        ['0', '0', '0'],
      ],
      precision: 4,
      selRotationUnit: 'radians'
    }

    this.layout = {}
    this.frame1Color = 'blue'
    this.frame2Color = 'green'
  }

  componentDidMount() {

    // Run once to initialise
    // angleAxisToQuat()
    // Set the quaternion to the default value and then draw the graph from that
    console.log('Checking quat radio button...')

    // const rotMatrix = Rotations.quatToRotMatrix(this.state.quat)
    // this.updateAngleAxis(rotMatrix)
    // this.updateRotMatrix(rotMatrix)
    let newState = this.state
    this.recalculate(newState)
    this.drawGraph(newState.rotMatrix)
    this.setState(newState)

    MathJax.Hub.Queue(["Typeset",MathJax.Hub])
  } // componentDidMount()

  inputTypeChanged = (e) => {
    let newState = this.state
    newState.selInputType = e.currentTarget.value
    this.recalculate(newState)
    this.setState(newState)
  }


  add_axis(data, start_point, end_point, colorIn, legendText) {
    const x = [start_point.get([0]), end_point.get([0])]
    const y = [start_point.get([1]), end_point.get([1])]
    const z = [start_point.get([2]), end_point.get([2])]

    let showLegend = false
    if(legendText) {
      showLegend = true
    }

    data.push({
      type: 'scatter3d',
      mode: 'lines',
      x: x,
      y: y,
      z: z,
      opacity: 1.0,
      line: {
        width: 2,
        color: colorIn,
      },
      showlegend: showLegend,
      name: legendText,
    })
  }

  angleAxisChanged = (e) => {
    console.log('angleAxisChanged() called. e.target.value=' + e.target.value + ', name=' + e.target.name)
    let newState = this.state
    newState.angleAxisDisplay[e.target.name] = e.target.value
    this.recalculate(newState)
    this.setState(newState)
    this.updateGraph(newState.rotMatrix)
  }

  quatChanged = (e) => {
    let newState = this.state
    console.log('quatChanged() called. e.target.name=' + e.target.name + ', e.target.value=' + e.target.value)
    if (e.target.name == 'quatW') {
      newState.quatDisplay[0] = e.target.value
    } else if (e.target.name == 'quatX') {
      newState.quatDisplay[1] = e.target.value
    } else if (e.target.name == 'quatY') {
      newState.quatDisplay[2] = e.target.value
    } else if (e.target.name == 'quatZ') {
      newState.quatDisplay[3] = e.target.value
    }
    this.recalculate(newState)
    this.setState(newState)
    this.updateGraph(newState.rotMatrix)
  }

  rotMatrixChanged = (e) => {
    let newState = this.state
    const inputName = e.target.name
    // Should be something like "00", "21", e.t.c
    let arrayIndexes = inputName.substr(inputName.length - 2)
    newState.rotMatrixDisplay[arrayIndexes[0]][arrayIndexes[1]] = e.target.value
    this.recalculate(newState)
    this.updateGraph(newState.rotMatrix)
    this.setState(newState)
  }

  convertQuatToQuatDisplay = (quat) => {
    return [
      quat.get([0]).toPrecision(this.state.precision),
      quat.get([1]).toPrecision(this.state.precision),
      quat.get([2]).toPrecision(this.state.precision),
      quat.get([3]).toPrecision(this.state.precision),
    ]
  }

  normalizeQuat = () => {
    let newState = this.state
    const normalizedQuat = divide(this.state.quat, norm(this.state.quat))
    newState.quatDisplay = this.convertQuatToQuatDisplay(normalizedQuat)
    this.recalculate(newState)
    this.setState(newState)
    this.updateGraph(newState.rotMatrix)
  }

  addAxisLabels = (layout) => {
    let annotations = []
    annotations.push(
      {
        showarrow: false,
        x: 1,
        y: 0,
        z: 0,
        text: "x",
        font: {
          color: this.frame1Color,
          size: 12
        },
        xanchor: "left",
        xshift: 0,
        opacity: 0.7
      },
      {
        showarrow: false,
        x: 0,
        y: 1,
        z: 0,
        text: "y",
        font: {
          color: this.frame1Color,
          size: 12
        },
        xanchor: "left",
        xshift: 0,
        opacity: 0.7
      },
      {
        showarrow: false,
        x: 0,
        y: 0,
        z: 1,
        text: "z",
        font: {
          color: this.frame1Color,
          size: 12
        },
        xanchor: "left",
        xshift: 0,
        opacity: 0.7
      },
      {
        showarrow: false,
        x: 1,
        y: 0,
        z: 0,
        text: "x",
        font: {
          color: this.frame2Color,
          size: 12
        },
        xanchor: "left",
        xshift: 10,
        opacity: 0.7
      },
      {
        showarrow: false,
        x: 0,
        y: 1,
        z: 0,
        text: "y",
        font: {
          color: this.frame2Color,
          size: 12
        },
        xanchor: "left",
        xshift: 10,
        opacity: 0.7
      },
      {
        showarrow: false,
        x: 0,
        y: 0,
        z: 1,
        text: "z",
        font: {
          color: this.frame2Color,
          size: 12
        },
        xanchor: "left",
        xshift: 10,
        opacity: 0.7
      },
    )

    layout.scene.annotations = annotations
  }

  updateFrame2AxisLabels = (index, endPoint) => {
    this.layout.scene.annotations[index].x = endPoint.get([0])
    this.layout.scene.annotations[index].y = endPoint.get([1])
    this.layout.scene.annotations[index].z = endPoint.get([2])
  }

  drawGraph = (rotMatrix) => {
    console.log('drawGraph() called. rotMatrix=' + rotMatrix)

    const graphContainerEl = this.refs.graphContainer
    var data = []
    this.add_axis(data, matrix([0, 0, 0]), matrix([1, 0, 0]), 'blue', 'frame 1')
    this.add_axis(data, matrix([0, 0, 0]), matrix([0, 1, 0]), 'blue')
    this.add_axis(data, matrix([0, 0, 0]), matrix([0, 0, 1]), 'blue')

    const translation = matrix([0, 0, 0])

    this.layout = {
      // width: 500,
      // height: 500,
      margin: {
        l: 5,
        r: 5,
        b: 5,
        t: 5,
        pad: 5
      },
      scene: {
        // aspectmode: "manual",
        aspectratio: {
          x: 1, y: 1, z: 1,
        },
        xaxis: {
          range: [-1.2, 1.2],
        },
        yaxis: {
          range: [-1.2, 1.2],
        },
        zaxis: {
          range: [-1.2, 1.2],
        },
      },
    };
    this.addAxisLabels(this.layout)

    var vector = matrix([1, 0, 0])
    var result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), this.frame2Color, 'frame 2 (rotated)')
    this.updateFrame2AxisLabels(3, add(translation, result))
    vector = matrix([0, 1, 0])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), this.frame2Color)
    this.updateFrame2AxisLabels(4, add(translation, result))
    vector = matrix([0, 1, 0])
    vector = matrix([0, 0, 1])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), this.frame2Color)
    this.updateFrame2AxisLabels(5, add(translation, result))




    // react() updates existing plot
    Plotly.plot(graphContainerEl, data, this.layout);
  }

  updateGraph = (rotMatrix) => {
    console.log('updateGraph() called. rotMatrix=' + rotMatrix)

    const graphContainerEl = this.refs.graphContainer
    var data = []

    const translation = matrix([0, 0, 0])

    var vector = matrix([1, 0, 0])
    var result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    this.updateFrame2AxisLabels(3, add(translation, result))
    vector = matrix([0, 1, 0])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    this.updateFrame2AxisLabels(4, add(translation, result))
    vector = matrix([0, 0, 1])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    this.updateFrame2AxisLabels(5, add(translation, result))

    // Update annotations 3-5 in layout

    // Data array has to be wrapped in another array
    Plotly.restyle(graphContainerEl,
      {
        type: 'scatter3d',
        mode: 'lines',
        x: [data[0].x, data[1].x, data[2].x],
        y: [data[0].y, data[1].y, data[2].y],
        z: [data[0].z, data[1].z, data[2].z],
        opacity: 1.0,
        line: {
          width: 2,
          color: 'green',
          // colorscale: 'Viridis'
        },
        // showlegend: false,
      }, [3, 4, 5]
    )

  }

  calcAngleAxisFromAngleAxisDisp = (angleAxisDisp, units) => {
    let multiplier = null
    if(units == 'radians') {
      multiplier = 1.0
    } else if (units == 'degrees') {
      multiplier = Math.PI/180.0
    } else {
        throw Error('units "' + units + '" provided to calcQuatFromQuatDisp() not recognized.')
    }
    let angleAxis = {
      'angle': parseFloat(angleAxisDisp.angle)*multiplier,
      'x': parseFloat(angleAxisDisp.x),
      'y': parseFloat(angleAxisDisp.y),
      'z': parseFloat(angleAxisDisp.z),
    }
    return angleAxis
  }

  calcQuatFromQuatDisp = (quatDisp, units) => {
    let quat = []
    for(let i = 0; i < quatDisp.length; i++) {
      if(units == 'radians') {
        quat.push(parseFloat(quatDisp[i]))
      } else if(units == 'degrees') {
        quat.push((parseFloat(quatDisp[i])*Math.PI)/180.0)
      } else {
        throw Error('units provided to calcQuatFromQuatDisp() not recognized.')
      }
    }
    return matrix(quat)
  }

  calcRotMatrixFromRotDisp = (rotMatrixDisplay, units) => {
    let multiplier = null
    if(units == 'radians') {
      multiplier = 1.0
    } else if (units == 'degrees') {
      multiplier = Math.PI/180.0
    }
    let m00 = parseFloat(rotMatrixDisplay[0][0])
    let m01 = parseFloat(rotMatrixDisplay[0][1])
    let m02 = parseFloat(rotMatrixDisplay[0][2])
    let m10 = parseFloat(rotMatrixDisplay[1][0])
    let m11 = parseFloat(rotMatrixDisplay[1][1])
    let m12 = parseFloat(rotMatrixDisplay[1][2])
    let m20 = parseFloat(rotMatrixDisplay[2][0])
    let m21 = parseFloat(rotMatrixDisplay[2][1])
    let m22 = parseFloat(rotMatrixDisplay[2][2])
    let rotArray = [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]]
    return matrix(rotArray)
  }

  recalculate = (newState) => {
    if (newState.selInputType == 'angleAxis') {
      newState.angleAxis = this.calcAngleAxisFromAngleAxisDisp(newState.angleAxisDisplay, newState.selRotationUnit)
      newState.quat = Rotations.angleAxisToQuat(newState.angleAxis) // Returned quat should be normalized
      newState.rotMatrix = Rotations.quatToRotMatrix(newState.quat)
    } else if (newState.selInputType == 'quat') {
      let quatDisplay = newState.quatDisplay
      newState.quat = this.calcQuatFromQuatDisp(quatDisplay, newState.selRotationUnit)
      newState.rotMatrix = Rotations.quatToRotMatrix(newState.quat)
      let angleAxisOut = Rotations.rotMatrixToAngleAxis(newState.rotMatrix)
      newState.angleAxis = angleAxisOut.matrix
      newState.angleAxisMsg = angleAxisOut.msg
    } else if (newState.selInputType == 'rotMatrix') {
      newState.rotMatrix = this.calcRotMatrixFromRotDisp(newState.rotMatrixDisplay)
      newState.quat = Rotations.rotMatrixToQuatMatrix(newState.rotMatrix)
      let angleAxisOut = Rotations.rotMatrixToAngleAxis(newState.rotMatrix)
      newState.angleAxis = angleAxisOut.matrix
      newState.angleAxisMsg = angleAxisOut.msg
    } else {
      throw Error('selInputType ' + newState.selInputType + ' not recognized.')
    }

    // UPDATE DISPLAY
    let multiplier = null
    if(newState.selRotationUnit == 'radians') {
      multiplier = 1.0
    } else if (newState.selRotationUnit == 'degrees') {
      multiplier = 180.0/Math.PI
    }

    if (newState.selInputType != 'angleAxis') {
      newState.angleAxisDisplay = {
        angle: (newState.angleAxis.get([0])*multiplier).toPrecision(this.state.precision),
        x: (newState.angleAxis.get([1])).toPrecision(this.state.precision),
        y: (newState.angleAxis.get([2])).toPrecision(this.state.precision),
        z: (newState.angleAxis.get([3])).toPrecision(this.state.precision),
      }
    }

    if (newState.selInputType != 'quat') {
      newState.quatDisplay = [
        (newState.quat.get([0])*multiplier).toPrecision(this.state.precision),
        (newState.quat.get([1])).toPrecision(this.state.precision),
        (newState.quat.get([2])).toPrecision(this.state.precision),
        (newState.quat.get([3])).toPrecision(this.state.precision),
      ]
    }

    if (newState.selInputType != 'rotMatrix') {
      let rotMatrixDisplay = []
      let i = 0

      newState.rotMatrix.forEach((value, index, matrix) => {
        if (i % 3 == 0) {
          rotMatrixDisplay.push([])
        }
        rotMatrixDisplay[index[0]].push((value).toPrecision(this.state.precision))
        i += 1
      })
      newState.rotMatrixDisplay = rotMatrixDisplay
    }
  }

  onRotationUnitsChange = (e) => {
    console.log('onRotationUnitsChange() called. e.target.value='+e.target.value)
      let newState = this.state
      newState.selRotationUnit = e.target.value
      this.recalculate(newState)
      this.setState(newState)
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>3D Rotations</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper" >
          <div id="calc-3d-rotation-graph" className="vbox" style={{ maxWidth: '500px' }}>

            <p>This calculator allows you to convert between rotations in 3D space described in axis-angle format, quaternions and rotation matrices. It also shows you how the rotation would rotate reference frame one to reference frame two in the below graph.</p>

            <div ref="graphContainer" style={{ maxWidth: '500px', maxHeight: '500px' }}></div>

            <div className="hbox">
              <div>Rotation Units: </div>
              <select value={this.state.selRotationUnit} onChange={this.onRotationUnitsChange}>
                <option value="radians">radians</option>
                <option value="degrees">degrees</option>
              </select>
            </div>

            <div id="inputs-wrapper" className="hbox" style={{ alignItems: 'start', fontSize: '0.8em' }}>
              <div className="vbox">
                <b>Angle-Axis</b>
                <input type="radio" name="inputType" value="angleAxis" checked={this.state.selInputType == 'angleAxis'} onChange={this.inputTypeChanged} />
                <table>
                  <tbody>
                    <tr>
                      <td style={{ maxWidth: '20px' }}>\(\theta\)</td>
                      <td>
                        <input name="angle" value={this.state.angleAxisDisplay.angle} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'angleAxis'}
                        />
                      </td>
                      <td style={{ paddingLeft: '0px' }}>rad</td>
                    </tr>
                    <tr>
                      <td>\(x\)</td>
                      <td>
                        <input name="x" value={this.state.angleAxisDisplay.x} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'angleAxis'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(y\)</td>
                      <td>
                        <input name="y" value={this.state.angleAxisDisplay.y} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'angleAxis'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(z\)</td>
                      <td>
                        <input name="z" value={this.state.angleAxisDisplay.z} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'angleAxis'}
                        />
                      </td>
                    </tr>
                  </tbody>
                  <style jsx>{`
                td input {
                  width: 80px;
                }
              `}</style>
                </table>
                <div className="vbox">
                  <div >Angle-Axis status:</div>
                  <div><i>{this.state.angleAxisMsg}</i></div>
                </div>
              </div>

              <div style={{ width: '2em' }}></div>

              <div className="vbox">
                <b>Quaternion</b>
                <input type="radio" name="inputType" value="quat" checked={this.state.selInputType == 'quat'} onChange={this.inputTypeChanged} />
                <table>
                  <tbody>
                    <tr>
                      <td>\(w\)</td>
                      <td>
                        <input name="quatW" value={this.state.quatDisplay[0]} onChange={this.quatChanged}
                          disabled={this.state.selInputType != 'quat'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(x\)</td>
                      <td>
                        <input name="quatX" value={this.state.quatDisplay[1]} onChange={this.quatChanged}
                          disabled={this.state.selInputType != 'quat'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(y\)</td>
                      <td>
                        <input name="quatY" value={this.state.quatDisplay[2]} onChange={this.quatChanged}
                          disabled={this.state.selInputType != 'quat'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(z\)</td>
                      <td>
                        <input name="quatZ" value={this.state.quatDisplay[3]} onChange={this.quatChanged}
                          disabled={this.state.selInputType != 'quat'}
                        />
                      </td>
                    </tr>
                  </tbody>
                  <style jsx>{`
                td input {
                  width: 80px;
                }
              `}</style>
                </table>
                <div style={{ height: '10px' }} />
                <button onClick={this.normalizeQuat} disabled={this.state.selInputType != 'quat'}>Normalize Quaternion</button>
              </div>

              <div className="vbox spacer" style={{ width: '20px' }}></div>

              <div className="vbox">
                <b>Rotation Matrix</b>
                <input type="radio" name="inputType" value="rotMatrix" checked={this.state.selInputType == 'rotMatrix'} onChange={this.inputTypeChanged} />
                <table className="rotMatrix">
                  <tbody>
                    <tr>
                      <td><input name="rot00" value={this.state.rotMatrixDisplay[0][0]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot01" value={this.state.rotMatrixDisplay[0][1]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot02" value={this.state.rotMatrixDisplay[0][2]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                    </tr>
                    <tr>
                      <td><input name="rot10" value={this.state.rotMatrixDisplay[1][0]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot11" value={this.state.rotMatrixDisplay[1][1]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot12" value={this.state.rotMatrixDisplay[1][2]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                    </tr>
                    <tr>
                      <td><input name="rot20" value={this.state.rotMatrixDisplay[2][0]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot21" value={this.state.rotMatrixDisplay[2][1]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                      <td><input name="rot22" value={this.state.rotMatrixDisplay[2][2]} onChange={this.rotMatrixChanged} disabled={this.state.selInputType != 'rotMatrix'} /></td>
                    </tr>
                  </tbody>
                  <style jsx>{`
                td input {
                  width: 50px;
                }
              `}</style>
                </table>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    )
  }
}

export default Calculator
