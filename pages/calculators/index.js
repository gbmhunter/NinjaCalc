import Head from 'next/head'

import React, { useEffect, useState } from 'react'

import { add, divide, matrix, multiply, norm } from 'mathjs'

import Layout from '~/components/layout'

class Calculator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selInputType: 'quat',
      angle: 0,
      axisX: 0,
      axisY: 0,
      axisZ: 0,
      quat: matrix([1, 0, 0, 0]), // wxyz
      quatDisplay: ['1', '0', '0', '0'],
      rotMatrix: matrix([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]),
    }
  }

  componentDidMount() {
    console.log('test calculator')

    // Run once to initialise
    // angleAxisToQuat()
    // Set the quaternion to the default value and then draw the graph from that
    console.log('Checking quat radio button...')

    this.drawGraph(matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]))
    // quatChanged()

  } // componentDidMount()

  axisAngleChanged() {
    console.log('axisAngleChanged() called.')
  }

  quatChanged() {
    console.log('quatChanged() called.')
  }

  rotMatrixChanged() {
    console.log('rotMatrixChanged() called.')
  }

  inputTypeChanged = (e) => {
    console.log('inputTypeChanged() ' + e.currentTarget.value)
    this.setState({
      selInputType: e.currentTarget.value
    })

    // console.log('radiobutton change handler called.')
    // if (this.value == 'axisAngle') {
    //   for(const el of axisAngleElGroup) {
    //     el.prop('disabled', false)
    //   }
    //   for(const el of quatElGroup) {
    //     el.prop('disabled', true)
    //   }
    //   for(const el of rotMatrixElGroup) {
    //     el.prop('disabled', true)
    //   }
    // } else if (this.value == 'quaternion') {
    //   for(const el of axisAngleElGroup) {
    //     el.prop('disabled', true)
    //   }
    //   for(const el of quatElGroup) {
    //     el.prop('disabled', false)
    //   }
    //   for(const el of rotMatrixElGroup) {
    //     el.prop('disabled', true)
    //   }
    // } else if (this.value == 'rotMatrix') {
    //   for(const el of axisAngleElGroup) {
    //     el.prop('disabled', true)
    //   }
    //   for(const el of quatElGroup) {
    //     el.prop('disabled', true)
    //   }
    //   for(const el of rotMatrixElGroup) {
    //     el.prop('disabled', false)
    //   }
    // } else {
    //   throw Error('Unrecognized radio button value.')
    // }
  }


  add_axis(data, start_point, end_point, colorIn) {
    console.log('start_point=' + start_point)
    console.log('end_point=' + end_point)
    console.log('colorIn=' + colorIn)
    const x = [start_point.get([0]), end_point.get([0])]
    const y = [start_point.get([1]), end_point.get([1])]
    const z = [start_point.get([2]), end_point.get([2])]
    data.push(
      {
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 1.0,
        line: {
          width: 2,
          color: colorIn,
          // colorscale: 'Viridis'
        },
        showlegend: false,
      }
    )
  }

  quatToRotMatrix(quat) {
    console.log('quat=' + quat)
    const w = quat.get([0])
    const x = quat.get([1])
    const y = quat.get([2])
    const z = quat.get([3])
    var matrixArray = [
      [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w],
      [2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w],
      [2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y],
    ]
    return matrix(matrixArray)
  }

  rotToQuatMatrix(rotMatrix) {
    m00 = rotMatrix.get([0, 0])
    m01 = rotMatrix.get([0, 1])
    m02 = rotMatrix.get([0, 2])
    m10 = rotMatrix.get([1, 0])
    m11 = rotMatrix.get([1, 1])
    m12 = rotMatrix.get([1, 2])
    m20 = rotMatrix.get([2, 0])
    m21 = rotMatrix.get([2, 1])
    m22 = rotMatrix.get([2, 2])
    if (m22 < 0) {
      if (m00 > m11) {
        t = 1 + m00 - m11 - m22;
        q = math.matrix([m01 + m10, m20 + m02, m12 - m21, t])
      }
      else {
        t = 1 - m00 + m11 - m22;
        q = math.matrix([t, m12 + m21, m20 - m02, m01 + m10])
      }
    }
    else {
      if (m00 < -m11) {
        t = 1 - m00 - m11 + m22;
        q = math.matrix([m12 + m21, t, m01 - m10, m20 + m02])
      }
      else {
        t = 1 + m00 + m11 + m22;
        q = math.matrix([m20 - m02, m01 - m10, t, m12 - m21])
      }
    }
    q = math.multiply(q, 0.5 / Math.sqrt(t))
    return q
  }

  angleAxisChanged() {
    console.log('angleAxisChanged() called.')
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
    const rotMatrix = quatToRotMatrix(quaternion)
    updateQuatEl(rotMatrix)
    updateRotMatrixEl(rotMatrix)
    updateGraph(rotMatrix)
  }

  quatChanged = (e) => {
    console.log('quatChanged() called. e.target.name=' + e.target.name + ', e.target.value=' + e.target.value)

    let quat = this.state.quat
    let valueAsFloat = parseFloat(e.target.value)
    let quatDisplay = this.state.quatDisplay.slice()
    if(e.target.name == 'quatW') {
        quatDisplay[0] = e.target.value
        quat.set([0], valueAsFloat)
    } else if(e.target.name == 'quatX') {
        quatDisplay[1] = e.target.value
        quat.set([1], valueAsFloat)
    } else if(e.target.name == 'quatY') {
        quatDisplay[2] = e.target.value
        quat.set([2], valueAsFloat)
    } else if(e.target.name == 'quatZ') {
        quatDisplay[3] = e.target.value
        quat.set([3], valueAsFloat)
    }

    console.log('quat=' + quat)
    let quat_norm = divide(quat, norm(quat))
    const rotMatrix = this.quatToRotMatrix(quat_norm)

    this.setState({
        'quat': quat,
        'quatDisplay': quatDisplay,
        'rotMatrix': rotMatrix,
    })

    // updateAngleAxisEl(rotMatrix)
    // updateRotMatrixEl(rotMatrix)
    this.updateGraph(rotMatrix)
  }

  rotMatrixChanged() {
    m00 = parseFloat(rot00El.val())
    m01 = parseFloat(rot01El.val())
    m02 = parseFloat(rot02El.val())
    m10 = parseFloat(rot10El.val())
    m11 = parseFloat(rot11El.val())
    m12 = parseFloat(rot12El.val())
    m20 = parseFloat(rot20El.val())
    m21 = parseFloat(rot21El.val())
    m22 = parseFloat(rot22El.val())
    rotArray = [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]]
    rotMatrix = math.matrix(rotArray)
    updateAngleAxisEl(rotMatrix)
    updateQuatEl(rotMatrix)
    updateGraph(rotMatrix)
  }

  updateAngleAxisEl(rotMatrix) {
    m00 = rotMatrix.get([0, 0])
    m01 = rotMatrix.get([0, 1])
    m02 = rotMatrix.get([0, 2])
    m10 = rotMatrix.get([1, 0])
    m11 = rotMatrix.get([1, 1])
    m12 = rotMatrix.get([1, 2])
    m20 = rotMatrix.get([2, 0])
    m21 = rotMatrix.get([2, 1])
    m22 = rotMatrix.get([2, 2])
    angle = Math.acos((m00 + m11 + m22 - 1) / 2)
    x = (m21 - m12) / Math.sqrt((m21 - m12) * 2 + (m02 - m20) * 2 + (m10 - m01) * 2)
    y = (m02 - m20) / Math.sqrt((m21 - m12) * 2 + (m02 - m20) * 2 + (m10 - m01) * 2)
    z = (m10 - m01) / Math.sqrt((m21 - m12) * 2 + (m02 - m20) * 2 + (m10 - m01) * 2)
    angleEl.val(angle.toPrecision(PRECISION))
    axisXEl.val(x.toPrecision(PRECISION))
    axisYEl.val(y.toPrecision(PRECISION))
    axisZEl.val(z.toPrecision(PRECISION))
  }

  updateQuatEl(rotMatrix) {
    console.log('updateQuatEl() called')
    const quat = rotToQuatMatrix(rotMatrix)
    quatWEl.val(quat.get([0]).toPrecision(PRECISION))
    quatXEl.val(quat.get([1]).toPrecision(PRECISION))
    quatYEl.val(quat.get([2]).toPrecision(PRECISION))
    quatZEl.val(quat.get([3]).toPrecision(PRECISION))
  }

  updateRotMatrixEl(rotMatrix) {
    rot00El.val(rotMatrix.get([0, 0]).toPrecision(PRECISION))
    rot01El.val(rotMatrix.get([0, 1]).toPrecision(PRECISION))
    rot02El.val(rotMatrix.get([0, 2]).toPrecision(PRECISION))
    rot10El.val(rotMatrix.get([1, 0]).toPrecision(PRECISION))
    rot11El.val(rotMatrix.get([1, 1]).toPrecision(PRECISION))
    rot12El.val(rotMatrix.get([1, 2]).toPrecision(PRECISION))
    rot20El.val(rotMatrix.get([2, 0]).toPrecision(PRECISION))
    rot21El.val(rotMatrix.get([2, 1]).toPrecision(PRECISION))
    rot22El.val(rotMatrix.get([2, 2]).toPrecision(PRECISION))
  }

  drawGraph = (rotMatrix) => {
    console.log('drawGraph() called. rotMatrix=' + rotMatrix)

    // let calc = $('#')
    var x1 = [0, 1];
    var y1 = [0, 0];
    var z1 = [0, 0];
    var x2 = [0, 0];
    var y2 = [0, 1];
    var z2 = [0, 0];

    const graphContainerEl = this.refs.graphContainer
    var data = []
    this.add_axis(data, matrix([0, 0, 0]), matrix([1, 0, 0]), 'blue')
    this.add_axis(data, matrix([0, 0, 0]), matrix([0, 1, 0]), 'blue')
    this.add_axis(data, matrix([0, 0, 0]), matrix([0, 0, 1]), 'blue')

    const translation = matrix([0, 0, 0])

    var vector = matrix([1, 0, 0])
    var result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    vector = matrix([0, 1, 0])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    vector = matrix([0, 0, 1])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')

    var layout = {
      scene: {
        aspectmode: "manual",
        aspectratio: {
          x: 1, y: 1, z: 1,
        },
        xaxis: {
          range: [-1.5, 1.5],
        },
        yaxis: {
          range: [-1.5, 1.5],
        },
        zaxis: {
          range: [-1.5, 1.5],
        }
      },
    };

    // react() updates existing plot
    Plotly.plot(graphContainerEl, data, layout);
  }

  updateGraph(rotMatrix) {
    console.log('updateGraph() called. rotMatrix=' + rotMatrix)

    // let calc = $('#')
    var x1 = [0, 1];
    var y1 = [0, 0];
    var z1 = [0, 0];
    var x2 = [0, 0];
    var y2 = [0, 1];
    var z2 = [0, 0];

    // graphContainerEl = document.getElementById('graph-container');
    const graphContainerEl = this.refs.graphContainer
    var data = []
    // add_axis(data, math.matrix([0,0,0]), math.matrix([1,0,0]), 'blue')
    // add_axis(data, math.matrix([0,0,0]), math.matrix([0,1,0]), 'blue')
    // add_axis(data, math.matrix([0,0,0]), math.matrix([0,0,1]), 'blue')

    const translation = matrix([0, 0, 0])

    var vector = matrix([1, 0, 0])
    var result = multiply(rotMatrix, vector)

    this.add_axis(data, translation, add(translation, result), 'orange')
    vector = matrix([0, 1, 0])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')
    vector = matrix([0, 0, 1])
    result = multiply(rotMatrix, vector)
    this.add_axis(data, translation, add(translation, result), 'orange')

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
        showlegend: false,
      }, [3, 4, 5]);

  }

  render() {
    return (
      <Layout>
    <Head>
      <title>Home</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      <div id="calc-3d-rotation-graph" className="vbox">
        <div ref="graphContainer" style={{width: '600px', height: '600px'}}></div>

        <div className="hbox">
          <div className="vbox">
            <b>Axis-Angle</b>
            <input type="radio" name="inputType" value="axisAngle" checked={this.state.selInputType == 'axisAngle'} onChange={this.inputTypeChanged} />
            <table>
              <tbody>
                <tr>
                  <td style={{ maxWidth: '20px' }}>theta</td>
                  <td><input name="angle" value={this.state.angle} onChange={this.axisAngleChanged}></input></td>
                  <td style={{ paddingLeft: '0px' }}>rad</td>
                </tr>
                <tr>
                  <td>x</td>
                  <td><input name="axisX" value={this.state.axisX} onChange={this.axisAngleChanged} /></td>
                </tr>
                <tr>
                  <td>y</td>
                  <td><input name="axisY" value={this.state.axisY} onChange={this.axisAngleChanged} /></td>
                </tr>
                <tr>
                  <td>z</td>
                  <td><input name="axisZ" value={this.state.axisZ} onChange={this.axisAngleChanged} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ width: '2em' }}></div>

          <div className="vbox">
            <b>Quaternion</b>
            <input type="radio" name="inputType" value="quat" checked={this.state.selInputType == 'quat'} onChange={this.inputTypeChanged} />
            <table>
              <tbody>
                <tr>
                  <td>w</td>
                  <td><input name="quatW" value={this.state.quatDisplay[0]} onChange={this.quatChanged}></input></td>
                </tr>
                <tr>
                  <td>x</td>
                  <td><input name="quatX" value={this.state.quatDisplay[1]} onChange={this.quatChanged}></input></td>
                </tr>
                <tr>
                  <td>y</td>
                  <td><input name="quatY" value={this.state.quatDisplay[2]} onChange={this.quatChanged}></input></td>
                </tr>
                <tr>
                  <td>z</td>
                  <td><input name="quatZ" value={this.state.quatDisplay[3]} onChange={this.quatChanged}></input></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="vbox spacer" style={{ width: '20px' }}></div>

          <div className="vbox">
            <b>Rotation Matrix</b>
            <input type="radio" name="inputType" value="rotMatrix" checked={this.state.selInputType == 'rotMatrix'} onChange={this.inputTypeChanged} />
            <table className="rotMatrix">
              <tbody>
                <tr>
                  <td><input name="rot00" value={this.state.rotMatrix.get([0,0])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot01" value={this.state.rotMatrix.get([0,1])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot02" value={this.state.rotMatrix.get([0,2])} onChange={this.rotMatrixChanged} /></td>
                </tr>
                <tr>
                  <td><input name="rot10" value={this.state.rotMatrix.get([1,0])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot11" value={this.state.rotMatrix.get([1,1])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot12" value={this.state.rotMatrix.get([1,2])} onChange={this.rotMatrixChanged} /></td>
                </tr>
                <tr>
                  <td><input name="rot20" value={this.state.rotMatrix.get([2,0])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot21" value={this.state.rotMatrix.get([2,1])} onChange={this.rotMatrixChanged} /></td>
                  <td><input name="rot22" value={this.state.rotMatrix.get([2,2])} onChange={this.rotMatrixChanged} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      </Layout>
    )
  }
}

export default Calculator
