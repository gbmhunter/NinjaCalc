const xah_format_number = ((n, m = 1) => {
  /* [
  format number with metric prefix, example: 1.2 k
  n is integer. The number to be converted
  m is integer. The number of decimal places to show. Default to 1.
  returns a string, with possibly one of k M G T ... suffix.
  
  http://xahlee.info/js/javascript_format_number.html
  version 2019-04-15
   ] */
      const prefix = ["", " k", " M", " G", " T", " P", " E", " Z", " Y", " * 10^27", " * 10^30", " * 10^33"]; // should be enough. Number.MAX_VALUE is about 10^308
      let ii = 0;
      while ((n = n/1000) >= 1) { ii++; }
      return (n * 1000).toFixed(m) + prefix[ii];
  });