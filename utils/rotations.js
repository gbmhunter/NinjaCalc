
import { add, divide, matrix, multiply, norm } from 'mathjs'
import * as mathjs from 'mathjs'
import * as THREE from 'three'

class Rotations {
  static rotMatrixToAngleAxis(rotMatrix) {
    console.log('rotMatrixToAngleAxis() called.')

    let m00 = rotMatrix.get([0, 0])
    let m01 = rotMatrix.get([0, 1])
    let m02 = rotMatrix.get([0, 2])
    let m10 = rotMatrix.get([1, 0])
    let m11 = rotMatrix.get([1, 1])
    let m12 = rotMatrix.get([1, 2])
    let m20 = rotMatrix.get([2, 0])
    let m21 = rotMatrix.get([2, 1])
    let m22 = rotMatrix.get([2, 2])
    var angle = 0;
    var x = 1;
    var y = 0;
    var z = 0;
    var epsilon = 0.01; // margin to allow for rounding errors
    if ((Math.abs(m01 - m10) < epsilon) && (Math.abs(m02 - m20) < epsilon) && (Math.abs(m12 - m21) < epsilon)) {
      // singularity found
      // first check for identity matrix which must have +1 for all terms in leading diagonal
      // and zero in other terms
      if ((Math.abs(m01 + m10) < 0.1) && (Math.abs(m02 + m20) < 0.1) && (Math.abs(m12 + m21) < 0.1) && (Math.abs(m00 + m11 + m22 - 3) < 0.1)) {
        // this singularity is identity matrix so angle = 0
        // note epsilon is greater in this case since we only have to distinguish between 0 and 180 degrees
        return {
          matrix: matrix([0, 1, 0, 0]), // zero angle, arbitrary axis
          msg: "Zero angle, so arbitrary axis.",
        }
      }
      // otherwise this singularity is angle = 180
      angle = Math.PI;
      var xx = (m00 + 1) / 2;
      var yy = (m11 + 1) / 2;
      var zz = (m22 + 1) / 2;
      var xy = (m01 + m10) / 4;
      var xz = (m02 + m20) / 4;
      var yz = (m12 + m21) / 4;
      if ((xx > yy) && (xx > zz)) { // m[0][0] is the largest diagonal term so base result on this
        if (xx < epsilon) {
          x = 0;
          y = 0.7071;
          z = 0.7071;
        } else {
          x = Math.sqrt(xx);
          y = xy / x;
          z = xz / x;
        }
      } else if (yy > zz) { // m[1][1] is the largest diagonal term so base result on this
        if (yy < epsilon) {
          x = 0.7071;
          y = 0;
          z = 0.7071;
        } else {
          y = Math.sqrt(yy);
          x = xy / y;
          z = yz / y;
        }
      } else { // m[2][2] is the largest diagonal term so base result on this
        if (zz < epsilon) {
          x = 0.7071;
          y = 0.7071;
          z = 0;
        } else {
          z = Math.sqrt(zz);
          x = xz / z;
          y = yz / z;
        }
      }
      // input.type.value="singularity at angle = 180";
      return {
        matrix: matrix([angle, x, y, z]),
        msg: "Singularity at angle = 180.",
      }
    }
    var s = Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01)); // used to normalise
    if (Math.abs(s) < 0.001) {
      return {
        matrix: matrix([NaN, NaN, NaN, NaN]),
        msg: "Input not orthogonal.",
      }
    }
    if (Math.abs((m00 + m11 + m22 - 1) / 2) > 1) {
      // input.type.value="matrix not normalised";
      return {
        matrix: matrix([NaN, NaN, NaN, NaN]),
        msg: "Input not normalized.",
      }
    }
    angle = Math.acos((m00 + m11 + m22 - 1) / 2);
    x = (m21 - m12) / s;
    y = (m02 - m20) / s;
    z = (m10 - m01) / s;
    return {
      matrix: matrix([angle, x, y, z]),
      msg: "Input o.k.",
    }
  }

  static quatToRotMatrix = (quat) => {
    console.log('quat=' + quat)
    const w = quat.get([0])
    const x = quat.get([1])
    const y = quat.get([2])
    const z = quat.get([3])
    let matrixArray = null
    // Validate inputs
    if (isNaN(w) | isNaN(x) | isNaN(y) | isNaN(z)) {
      matrixArray = [[NaN, NaN, NaN], [NaN, NaN, NaN], [NaN, NaN, NaN]]
    } else {
      matrixArray = [
        [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w],
        [2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w],
        [2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y],
      ]
    }
    return matrix(matrixArray)
  }

  static rotMatrixToQuatMatrix = (rotMatrix) => {
    let m00 = rotMatrix.get([0, 0])
    let m01 = rotMatrix.get([0, 1])
    let m02 = rotMatrix.get([0, 2])
    let m10 = rotMatrix.get([1, 0])
    let m11 = rotMatrix.get([1, 1])
    let m12 = rotMatrix.get([1, 2])
    let m20 = rotMatrix.get([2, 0])
    let m21 = rotMatrix.get([2, 1])
    let m22 = rotMatrix.get([2, 2])
    let q = null
    let t = null
    if (m22 < 0) {
      if (m00 > m11) {
        t = 1 + m00 - m11 - m22;
        q = matrix([m01 + m10, m20 + m02, m12 - m21, t])
      }
      else {
        t = 1 - m00 + m11 - m22;
        q = matrix([t, m12 + m21, m20 - m02, m01 + m10])
      }
    }
    else {
      if (m00 < -m11) {
        t = 1 - m00 - m11 + m22;
        q = matrix([m12 + m21, t, m01 - m10, m20 + m02])
      }
      else {
        t = 1 + m00 + m11 + m22;
        q = matrix([m20 - m02, m01 - m10, t, m12 - m21])
      }
    }
    q = multiply(q, 0.5 / Math.sqrt(t))
    return q
  }

  static rotMatrixToQuat = (rotMatrix) => {
    let m00 = rotMatrix.get([0, 0])
    let m01 = rotMatrix.get([0, 1])
    let m02 = rotMatrix.get([0, 2])
    let m10 = rotMatrix.get([1, 0])
    let m11 = rotMatrix.get([1, 1])
    let m12 = rotMatrix.get([1, 2])
    let m20 = rotMatrix.get([2, 0])
    let m21 = rotMatrix.get([2, 1])
    let m22 = rotMatrix.get([2, 2])
    let qw = 0
    let qx = 1
    let qy = 0
    let qz = 0
    let S = 0
    if (m00 + m11 + m22 > 2.9999) { // check for identity matrix
      qw = 1
      qx = 0
      qy = 0
      qz = 0
    } else if ((m00 + m11 + m22 + 1) > 0.0001) {
      S = Math.sqrt(m00 + m11 + m22 + 1) * 2
      qw = 0.25 * S
      qx = (m21 - m12) / S
      qy = (m02 - m20) / S
      qz = (m10 - m01) / S
    } else if ((m00 > m11) & (m00 > m22)) {
      if ((1.0 + m00 - m11 - m22) <= 0) {
        return {
          msg:"sqrt(" + (1.0 + m00 - m11 - m22) + ")",
          quat: matrix([ NaN, NaN, NaN, NaN ]) 
        } 
      }
      S = Math.sqrt(1.0 + m00 - m11 - m22) * 2; // S=4*qx 
      qw = (m21 - m12) / S
      qx = 0.25 * S
      qy = (m01 + m10) / S
      qz = (m02 + m20) / S
    } else if (m11 > m22) {
      if ((1.0 + m11 - m00 - m22) <= 0) {
        return {
          msg:"sqrt(" + (1.0 + m11 - m00 - m22) + ")",
          quat: matrix([ NaN, NaN, NaN, NaN ]) 
        } 
      }
      S = Math.sqrt(1.0 + m11 - m00 - m22) * 2 // S=4*qy
      qw = (m02 - m20) / S
      qx = (m01 + m10) / S
      qy = 0.25 * S
      qz = (m12 + m21) / S
    } else {
      if ((1.0 + m22 - m00 - m11) <= 0) {
        return {
          msg: "sqrt(" + (1.0 + m22 - m00 - m11) + ")",
          quat: matrix([ NaN, NaN, NaN, NaN ]) 
        } 
      }
      S = Math.sqrt(1.0 + m22 - m00 - m11) * 2 // S=4*qz
      qw = (m10 - m01) / S
      qx = (m02 + m20) / S
      qy = (m12 + m21) / S
      qz = 0.25 * S
    }
    return {
      msg: 'ok',
      quat: matrix([qw, qx, qy, qz]),
    }
  }

  /**
   * Converts a rotation specifies by an angle and a axis to a quaternion.
   * 
   * @param angleAxis An object where .x,.y,.z specifies the axis, and .angle specifies the angle.
   * @returns A quaternion in the form wxyz, as a mathjs.matrix object.
   */
  static angleAxisToQuat = (angleAxis) => {
    const quatW = Math.cos(angleAxis.angle / 2)
    const quatX = angleAxis.x * Math.sin(angleAxis.angle / 2)
    const quatY = angleAxis.y * Math.sin(angleAxis.angle / 2)
    const quatZ = angleAxis.z * Math.sin(angleAxis.angle / 2)

    var quaternion = matrix([quatW, quatX, quatY, quatZ]) // wxyz
    quaternion = divide(quaternion, norm(quaternion))
    return quaternion
  }

  /**
   * Converts Euler angles into a rotation matrix. This applys intrinisic rotations.
   * 
   * @param angles A list of rotation angles [angle1, angle2, angle3] which are paired with order.
   * @param order A sequence of axes (as a single string) to apply the rotations in angles to, e.g. 'XYZ', or 'XZX'.
   *    Must be in capital letters. 
   * @returns The resulting 3x3 rotation matrix, as a mathjs.matrix object.
   */
  static eulerAnglesToRotMatrix = (angles, order) => {
    const Rx = (angle) => {
      return mathjs.matrix([
        [1,0,0],
        [0,Math.cos(angle),Math.sin(angle)],
        [0,-Math.sin(angle),Math.cos(angle)],
      ])
    }
    const Ry = (angle) => {
      return mathjs.matrix([
        [Math.cos(angle),0,Math.sin(angle)],
        [0,1,0],
        [-Math.sin(angle),0,Math.cos(angle)],
      ])
    }
    const Rz = (angle) => {
      return mathjs.matrix([
        [Math.cos(angle),-Math.sin(angle),0],
        [Math.sin(angle),Math.cos(angle),0],
        [0,0,1],
      ])
    }

    // Maps the axis to the function which creates a rotation matrix around this axis
    const lookup = {
      X: Rx,
      Y: Ry,
      Z: Rz,
    }

    // Start with identity rotation, and then apply successive rotations
    // on the left
    let rotMatrix = mathjs.matrix([[1,0,0],[0,1,0],[0,0,1]])
    for(let i = 0; i < 3; i++) {
      // console.log(angles[i])
      // console.log(order[i])
      const rotMatrixPartial = lookup[order[i]](angles[i])
      // console.log(rotMatrixPartial)
      // Multiply on the left
      rotMatrix = mathjs.multiply(rotMatrixPartial, rotMatrix)
    }
    return rotMatrix
  }

  /**
   * Converts a rotation matrix into three Euler angles, where each angle corresponds to a rotation around the axes specified
   * by order.
   * 
   * @param order A sequence of axes (as a single string) that determines the axis of each Euler angle, e.g. 'XYZ', or 'XZX'.
   *    Must be in capital letters.
   * @returns The three rotations around each axis specified in order, as a THREE.js matrix.
   */
  static rotMatrixToEulerAngles = (rotMatrix, order) => {
    // Convert to THREE matrix
    console.log('rotMatrixToEulerAngles() called. order=')
    console.log(order)
    let rotMatrix3 = new THREE.Matrix4()
    // Convert from 3x3 to 4x4 matrix (with 4th elements being identity to make it a pure
    // rotation)
    // .set() takes elements in row-major order, even though Euler.js uses column-major
    // order internally
    rotMatrix3.set(
      rotMatrix.get([0,0]),rotMatrix.get([0,1]),rotMatrix.get([0,2]), 0,
      rotMatrix.get([1,0]),rotMatrix.get([1,1]),rotMatrix.get([1,2]), 0,
      rotMatrix.get([2,0]),rotMatrix.get([2,1]),rotMatrix.get([2,2]), 0,
      0,0,0,1)

    let eulerAngles = new THREE.Euler()
    eulerAngles.setFromRotationMatrix(rotMatrix3, order)
    // Re-order the THREE.js euler angles which are always attached
    // to the object as .x, .y and .z into the same order as the axes
    // in the order variable
    let outputArray = []
    for(let axis of order) {
      console.log(axis)
      outputArray.push(eulerAngles[axis.toLowerCase()])
    }
    console.log('outputArray=')
    console.log(outputArray)
    return matrix(outputArray)
  }

}

export default Rotations