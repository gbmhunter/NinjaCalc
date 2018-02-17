/* eslint-disable camelcase */

export class Coordinate {
  constructor () {
    this.lat_rad = 0.0
    this.lon_rad = 0.0
  }

  GetLat_rad () {
    return this.lat_rad
  }

  SetLat_rad (value) {
    this.lat_rad = value
  }

  GetLon_rad () {
    return this.lon_rad
  }

  SetLon_rad (value) {
    this.lon_rad = value
  }

  FromString (value) {
    var latlon = value.split(/, ?/)
    console.log('latlon = ' + latlon)
    this.lat_rad = parseFloat(latlon[0])
    console.log('this.lat_rad = ' + this.lat_rad)
    if (isNaN(this.lat_rad)) {
      throw new Error('String was not valid')
    }
    this.lon_rad = parseFloat(latlon[1])
    console.log('this.lon_rad = ' + this.lon_rad)
    if (isNaN(this.lon_rad)) {
      throw new Error('String was not valid')
    }
  }
}

export class Geospatial {

  constructor () {
    this.EARTH_RADIUS_M = 6371e3
  }

  DistanceBetweenTwoPoints_m = (coord1, coord2) => {
    var deltaLat = coord2.GetLat_rad() - coord1.GetLat_rad()
    var deltaLon = coord2.GetLon_rad() - coord1.GetLon_rad()

    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(coord1.GetLat_rad()) * Math.cos(coord2.GetLat_rad()) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    var distance_m = this.EARTH_RADIUS_M * c
    return distance_m
  }
}
