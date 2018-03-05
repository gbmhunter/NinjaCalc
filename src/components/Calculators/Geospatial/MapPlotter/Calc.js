import MainView from './MainView'

export var mapPlotter = {
  displayName: 'Map Plotter',
  description: 'Easily plot markers (points) and arcs (either as great circles or rhumb lines) on a map of the Earth.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Geospatial' ],
  tags: [ 'coordinate', 'distance', 'great circle', 'latitude', 'longitude' ],
  mainView: MainView
}
