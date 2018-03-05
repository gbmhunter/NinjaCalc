import MainView from './MainView'

export var mapPlotter = {
  displayName: 'Map Plotter',
  description: 'Plot stuff on a map.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Geospatial' ],
  tags: [ 'coordinate', 'distance', 'great circle', 'latitude', 'longitude' ],
  mainView: MainView
}
