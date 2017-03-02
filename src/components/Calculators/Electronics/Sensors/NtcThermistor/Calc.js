import MainView from './MainView'

/**
 * The model (code behind) for the NTC thermistor calculator.
 *
 * This uses the beta equation in the form:
 * 1/T = 1/T_0 + (1/b)*ln(R/R_0)
 *
 * @author          gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @since           2016-04-14
 * @last-modified   2017-03-02
 */
export var ntcThermistorTemperature = {
  displayName: 'NTC Thermistor Temperature',
  description: 'Calculate the temperature of a NTC thermistor given it\'s resistance.',
  imagePath: require('./grid-icon.jpg'),
  category: [ 'Electronics', 'Sensors' ],
  tags: [ 'temperature', 'thermistor', 'ntc', 'negative', 'coefficient', 'sensor', 'resistor' ],
  mainView: MainView
}
