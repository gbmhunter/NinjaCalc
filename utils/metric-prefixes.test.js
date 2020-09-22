

import { MetricPrefixes } from '~/utils/metric-prefixes'

//===========================================================================//
//============================ NUMBER TO STRING =============================//
//===========================================================================//

test('8n', () => {
  expect(MetricPrefixes.numToString(0.00000000845, 1)).toBe('8n')
})

test('1u', () => {
  expect(MetricPrefixes.numToString(0.000001, 1)).toBe('1u')
})

test('1.00u', () => {
  expect(MetricPrefixes.numToString(0.000001, 3)).toBe('1.00u')
})

test('1.00m', () => {
  expect(MetricPrefixes.numToString(0.001, 3)).toBe('1.00m')
})

test('102m', () => {
  expect(MetricPrefixes.numToString(0.102, 3)).toBe('102m')
})

test('56', () => {
  expect(MetricPrefixes.numToString(56, 2)).toBe('56')
})

test('999', () => {
  expect(MetricPrefixes.numToString(999, 3)).toBe('999')
})

test('2k', () => {
  expect(MetricPrefixes.numToString(2000, 1)).toBe('2k')
})

test('2.00000k', () => {
  expect(MetricPrefixes.numToString(2000, 6)).toBe('2.00000k')
})

test('98.34M', () => {
  expect(MetricPrefixes.numToString(98340000, 4)).toBe('98.34M')
})

test('4.5e27to4.500e+27', () => {
  expect(MetricPrefixes.numToString(4.5e27, 4)).toBe('4.500e+27')
})

//===========================================================================//
//============================ STRING TO NUMBER =============================//
//===========================================================================//

test('50uto0.00005', () => {
  expect(MetricPrefixes.stringToNum('50u')).toBeCloseTo(0.00005)
})

test('999mto0.999', () => {
  expect(MetricPrefixes.stringToNum('999m')).toBeCloseTo(0.999)
})

test('4500mto4.5', () => {
  expect(MetricPrefixes.stringToNum('4500m')).toBeCloseTo(4.5)
})

test('1mto0.001', () => {
  expect(MetricPrefixes.stringToNum('1m')).toBeCloseTo(0.001)
})

test('1to1', () => {
  expect(MetricPrefixes.stringToNum('1')).toBeCloseTo(1.0)
})

test('1.00to1', () => {
  expect(MetricPrefixes.stringToNum('1.00')).toBeCloseTo(1.0)
})

test('2kto2000', () => {
  expect(MetricPrefixes.stringToNum('2k')).toBeCloseTo(2000)
})

test('2.345kto2345', () => {
  expect(MetricPrefixes.stringToNum('2.345k')).toBeCloseTo(2345)
})