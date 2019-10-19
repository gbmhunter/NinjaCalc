
import { add, divide, matrix, multiply, norm } from 'mathjs'

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
      return matrix([angle, x, y, z]);
    }
    var s = Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01)); // used to normalise
    if (Math.abs(s) < 0.001) {
      return {
        matrix: matrix([NaN, NaN, NaN, NaN]),
        msg: "Matrix not orthogonal.",
      }
    }
    if (Math.abs((m00 + m11 + m22 - 1) / 2) > 1) {
      // input.type.value="matrix not normalised";
      return {
        matrix: matrix([NaN, NaN, NaN, NaN]),
        msg: "Matrix not normalized.",
      }
    }
    angle = Math.acos((m00 + m11 + m22 - 1) / 2);
    x = (m21 - m12) / s;
    y = (m02 - m20) / s;
    z = (m10 - m01) / s;
    return {
      matrix: matrix([angle, x, y, z]),
      msg: "Matrix o.k.",
    }
  }

  static quatToRotMatrix = (quat) => {
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
}

export default Rotations