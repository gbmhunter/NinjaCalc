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

    const rotMatrix = Rotations.quatToRotMatrix(this.state.quat)
    this.updateAngleAxis(rotMatrix)
    this.updateRotMatrix(rotMatrix)
    this.drawGraph(rotMatrix)

  } // componentDidMount()

  inputTypeChanged = (e) => {
    let value = e.currentTarget.value
    this.setState({
      selInputType: e.currentTarget.value
    })

    if (value == 'axisAngle') {
      this.updateQuat(this.state.rotMatrix)
      this.updateRotMatrix(this.state.rotMatrix)
    } else if (value == 'quat') {
      this.updateAngleAxis(this.state.rotMatrix)
      this.updateRotMatrix(this.state.rotMatrix)
    } else if (value == 'rotMatrix') {
      this.updateAngleAxis(this.state.rotMatrix)
      this.updateQuat(this.state.rotMatrix)
    } else {
      throw Error('Unrecognized radio button value.' + value)
    }
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
    console.log('angleAxisChanged() called. e.target.value=' + e.target.value)
    const angle = angleEl.val()
    const axisX = axisXEl.val()
    const axisY = axisYEl.val()
    const axisZ = axisZEl.val()

    const quatW = Math.cos(angle / 2)
    const quatX = axisX * Math.sin(angle / 2)
    const quatY = axisY * Math.sin(angle / 2)
    const quatZ = axisZ * Math.sin(angle / 2)

    var quaternion = math.matrix([quatW, quatX, quatY, quatZ]) // wxyz
    quaternion = math.divide(quaternion, math.norm(quaternion))
    const rotMatrix = Rotations.quatToRotMatrix(quaternion)
    updateQuatEl(rotMatrix)
    updateRotMatrixEl(rotMatrix)
    updateGraph(rotMatrix)
  }

  quatChanged = (e) => {
    console.log('quatChanged() called. e.target.name=' + e.target.name + ', e.target.value=' + e.target.value)

    let quat = this.state.quat
    let valueAsFloat = parseFloat(e.target.value)
    let quatDisplay = this.state.quatDisplay.slice()
    if (e.target.name == 'quatW') {
      quatDisplay[0] = e.target.value
      quat.set([0], valueAsFloat)
    } else if (e.target.name == 'quatX') {
      quatDisplay[1] = e.target.value
      quat.set([1], valueAsFloat)
    } else if (e.target.name == 'quatY') {
      quatDisplay[2] = e.target.value
      quat.set([2], valueAsFloat)
    } else if (e.target.name == 'quatZ') {
      quatDisplay[3] = e.target.value
      quat.set([3], valueAsFloat)
    }

    console.log('quat=' + quat)
    let quat_norm = divide(quat, norm(quat))
    const rotMatrix = Rotations.quatToRotMatrix(quat_norm)

    this.setState({
      'quat': quat,
      'quatDisplay': quatDisplay,
    })

    this.updateAngleAxis(rotMatrix)
    this.updateRotMatrix(rotMatrix)
    this.updateGraph(rotMatrix)
  }

  rotMatrixChanged = (e) => {
    let rotMatrixDisplay = this.state.rotMatrixDisplay.slice()
    const inputName = e.target.name
    // Should be something like "00", "21", e.t.c
    let arrayIndexes = inputName.substr(inputName.length - 2)

    console.log('rotMatrixDisplay(before)=')
    console.log(rotMatrixDisplay)
    rotMatrixDisplay[arrayIndexes[0]][arrayIndexes[1]] = e.target.value
    console.log('rotMatrixDisplay=')
    console.log(rotMatrixDisplay)

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
    let rotMatrix = matrix(rotArray)

    this.updateAngleAxis(rotMatrix)
    this.updateQuat(rotMatrix)
    this.updateGraph(rotMatrix)
    this.setState({
      rotMatrixDisplay: rotMatrixDisplay,
      rotMatrix: rotMatrix,
    })
  }

  updateAngleAxis = (rotMatrix) => {
    console.log('updateAngleAxis() called.')

    let output = Rotations.rotMatrixToAngleAxis(rotMatrix)
    let angleAxisMatrix = output.matrix
    let msg = output.msg
    console.log('angleAxisMatrix=' + angleAxisMatrix)
    console.log('msg=' + msg)
    this.setState({
      angleAxis: {
        angle: angleAxisMatrix.get([0]),
        x: angleAxisMatrix.get([1]),
        y: angleAxisMatrix.get([2]),
        z: angleAxisMatrix.get([3]),
      },
      angleAxisDisplay: {
        angle: angleAxisMatrix.get([0]).toPrecision(this.state.precision),
        x: angleAxisMatrix.get([1]).toPrecision(this.state.precision),
        y: angleAxisMatrix.get([2]).toPrecision(this.state.precision),
        z: angleAxisMatrix.get([3]).toPrecision(this.state.precision),
      },
      angleAxisMsg: msg,
    })

  }

  updateQuat = (rotMatrix) => {
    console.log('updateQuatEl() called')
    const quat = Rotations.rotMatrixToQuatMatrix(rotMatrix)
    const quatDisplay = [
      quat.get([0]).toPrecision(this.state.precision),
      quat.get([1]).toPrecision(this.state.precision),
      quat.get([2]).toPrecision(this.state.precision),
      quat.get([3]).toPrecision(this.state.precision),
    ]
    this.setState({
      quat: quat,
      quatDisplay: quatDisplay,
    })
  }

  updateRotMatrix = (rotMatrix) => {
    let rotMatrixDisplay = []
    let i = 0

    rotMatrix.forEach((value, index, matrix) => {
      if (i % 3 == 0) {
        rotMatrixDisplay.push([])
      }
      rotMatrixDisplay[index[0]].push(value.toPrecision(this.state.precision))
      i += 1
    })

    this.setState({
      rotMatrix: rotMatrix,
      rotMatrixDisplay: rotMatrixDisplay
    })
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
    const normalizedQuat = divide(this.state.quat, norm(this.state.quat))
    this.setState({
      quat: normalizedQuat,
      quatDisplay: this.convertQuatToQuatDisplay(normalizedQuat),
    })
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

    // graphContainerEl = document.getElementById('graph-container');
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

    // react() updates existing plot
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
              <select>
                <option>radians</option>
                <option>degrees</option>
              </select>
            </div>

            <div className="hbox" style={{ alignItems: 'start'}}>
              <div className="vbox">
                <b>Axis-Angle</b>
                <input type="radio" name="inputType" value="axisAngle" checked={this.state.selInputType == 'axisAngle'} onChange={this.inputTypeChanged} />
                <table>
                  <tbody>
                    <tr>
                      <td style={{ maxWidth: '20px' }}>\(\theta\)</td>
                      <td>
                        <input name="angle" value={this.state.angleAxisDisplay.angle} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'axisAngle'}
                        />
                      </td>
                      <td style={{ paddingLeft: '0px' }}>rad</td>
                    </tr>
                    <tr>
                      <td>\(x\)</td>
                      <td>
                        <input name="axisX" value={this.state.angleAxisDisplay.x} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'axisAngle'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(y\)</td>
                      <td>
                        <input name="axisY" value={this.state.angleAxisDisplay.y} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'axisAngle'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>\(z\)</td>
                      <td>
                        <input name="axisZ" value={this.state.angleAxisDisplay.z} onChange={this.angleAxisChanged}
                          disabled={this.state.selInputType != 'axisAngle'}
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
                  <div>Axis-angle status:</div>
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
