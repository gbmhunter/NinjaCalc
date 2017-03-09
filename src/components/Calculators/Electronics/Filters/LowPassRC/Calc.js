import MainView from './MainView'

export default {
  displayName: 'Low Pass RC',
  description: 'The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering and adding to the output of a PWM signal to make a cheap DAC.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Filters' ],
  tags: [ 'rc', 'filters', 'filtering', 'low-pass', 'adc', 'signal', 'conditioning', 'processing' ],
  mainView: MainView
}
