import MainView from './MainView'

export var crcCalculator = {
  displayName: 'CRC Calculator',
  description: 'Calculate CRC values from either a large number of popular CRC algorithms or define one yourself.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Software' ],
  tags: [ 'crc', 'cycle redundancy check', 'smbus', 'comms', 'bus', 'embedded', 'messaging', 'networking', 'parity', 'bits', 'xor' ],
  mainView: MainView
}
