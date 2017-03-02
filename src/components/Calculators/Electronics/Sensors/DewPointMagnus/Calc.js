import MainView from './MainView'

/**
 * The model (code behind) for the dew-point calculator based upon the Magnus equation.
 *
 * RH: =100*(EXP((17.625*TD)/(243.04+TD))/EXP((17.625*T)/(243.04+T))
 * T: =243.04*(((17.625*TD)/(243.04+TD))-LN(RH/100))/(17.625+LN(RH/100)-((17.625*TD)/(243.04+TD)))
 * TD: =243.04*(LN(RH/100)+((17.625*T)/(243.04+T)))/(17.625-LN(RH/100)-((17.625*T)/(243.04+T)))
 *
 * RH is expressed as a percentage, T and TD are both in degrees Celcius
 *
 * @author          gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since           2016-04-14
 * @last-modified   2017-03-02
 */
export var dewPointMagnusCalculator = {
  displayName: 'Dew Point (Magnus Equation)',
  description: 'Calculate the dew point using the Magnus equation.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Sensors' ],
  tags: [ 'dew', 'point', 'magnus', 'temperature', 'humidity', 'condensation', 'pressure' ],
  mainView: MainView
}
