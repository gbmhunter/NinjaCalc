
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