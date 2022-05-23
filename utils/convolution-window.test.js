import { convoluteWindow } from '~/utils/convolution-window'

test('integer-2-wide-window', () => {
  const data = [ 1, 2, 3, 4 ]
  const window = [ 1, 1 ]
  const result = convoluteWindow(data, window)
  expect(result.length).toBe(data.length)
  expect(String(result)).toBe(String([ NaN, 3, 5, 7 ]))
})

test('non-integer-2-wide-window', () => {
  const data = [ 1, 2, 3, 4 ]
  const window = [ 0.5, 0.5 ]
  const result = convoluteWindow(data, window)
  expect(String(result)).toBe(String([ NaN, 1.5, 2.5, 3.5 ]))
})

test('1-wide-window', () => {
  const data = [ 1, 2, 3, 4 ]
  const window = [ 2 ]
  const result = convoluteWindow(data, window)
  expect(String(result)).toBe(String([ 2, 4, 6, 8 ]))
})

test('window-as-wide-as-data', () => {
  const data = [ 1, 2, 3, 4 ]
  const window = [ 1, 1, 1, 1 ]
  const result = convoluteWindow(data, window)
  expect(String(result)).toBe(String([ NaN, NaN, NaN, 10 ]))
})
