import MainView from './MainView'

export var lowPassRcCalculator = {
  displayName: 'Low Pass RC',
  description: 'The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Filters' ],
  tags: [ 'rc', 'filters', 'filtering', 'low-pass', 'adc', 'signal', 'conditioning', 'processing' ],
  mainView: MainView
}
