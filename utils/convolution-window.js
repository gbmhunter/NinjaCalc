export function convoluteWindow(data, window) {
  /*
  Slides window across data, multiplying and summing to get a result for each position (convolution).

  For example, if window w had 3 elements and the data x had 4: 
  First iteration:
        x0 x1 x2 x3
  w0 w1 w2

  Second iteration:
        x0 x1 x2 x3
     w0 w1 w2

  e.t.c

  */
  let output = []
  for(let i = 0; i < data.length; i++) {
    // Find at what index in the data the left side of the window starts at
    const windowStartInData = i - (window.length - 1)
    if (windowStartInData < 0 ) {
      output.push(NaN)
      continue
    }
    let sum = 0
    for(let j = 0; j < window.length; j++) {
      sum += data[windowStartInData + j]*window[j]
    }
    output.push(sum)
  }
  return output
}