
import { add, compare, deepEqual, divide, matrix, multiply, norm } from 'mathjs'

import Rotations from '~/utils/rotations.js'

test('noop rot matrix gives noop quat', () => {
  let retVal = Rotations.rotMatrixToQuat(matrix([[1,0,0],[0,1,0],[0,0,1]]))
  let quat = retVal.quat
  expect(deepEqual(quat, matrix([1,0,0,0]))).toBe(true)
})

test('noop quat gives noop rot matrix', () => {
  let rotMatrix = Rotations.quatToRotMatrix(matrix([1,0,0,0]))
  expect(deepEqual(rotMatrix, matrix([[1,0,0],[0,1,0],[0,0,1]]))).toBe(true)
})

test('euler angles to rot matrix', () => {
  let rotMatrix = Rotations.eulerAnglesToRotMatrix([0, 0, 0], 'xyz')
  expect(deepEqual(rotMatrix, matrix([[1,0,0],[0,1,0],[0,0,1]]))).toBe(true)
})

test('euler angles rotate around x', () => {
  // Rotating around x by Pi (180deg) should invert both the y and z axis 
  let rotMatrix = Rotations.eulerAnglesToRotMatrix([Math.PI, 0, 0], 'xyz')
  expect(deepEqual(rotMatrix, matrix([[1,0,0],[0,-1,0],[0,0,-1]]))).toBe(true)
})

test('euler angles rotate around y', () => {
  // Rotating around y by Pi (180deg) should invert both the x and z axis 
  let rotMatrix = Rotations.eulerAnglesToRotMatrix([0, Math.PI, 0], 'xyz')
  expect(deepEqual(rotMatrix, matrix([[-1,0,0],[0,1,0],[0,0,-1]]))).toBe(true)
})

test('euler angles rotate around x twice', () => {
  let rotMatrix = Rotations.eulerAnglesToRotMatrix([Math.PI/2, 0, Math.PI/2], 'xyx')
  expect(deepEqual(rotMatrix, matrix([[1,0,0],[0,-1,0],[0,0,-1]]))).toBe(true)
})

test('rot matrix to euler angles identity', () => {
  let rotMatrix = Rotations.rotMatrixToEulerAngles(matrix([[1,0,0],[0,1,0],[0,0,1]]), 'xyz')
  expect(deepEqual(rotMatrix, [0, 0, 0])).toBe(true)
})

test('rot matrix to euler angles rotate around x', () => {
  let rotMatrix = Rotations.rotMatrixToEulerAngles(matrix([[1,0,0],[0,-1,0],[0,0,-1]]), 'xyz')
  expect(deepEqual(rotMatrix, [-Math.PI, 0, 0])).toBe(true)
})