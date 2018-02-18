<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      This calculator finds the great-circle (shortest) distance between two points on the earth defined by latitude and longitude.
    </ui-collapsible>

    <table>
      <tbody>
      <tr>

        <!-- ========================================= -->
        <!-- ========= TRACK LAYER (combobox) ======== -->
        <!-- ========================================= -->
        <td>
          <span class="variable-name">Coordinate Units</span>
        </td>
        <td>
          <select v-model="calc.getVar('coordinateUnits').val" v-on:change="calc.getVar('coordinateUnits').onValChange()"
                  style="width: 100px; height: 30px;">
            <option v-for="option in calc.getVar('coordinateUnits').options" v-bind:value="option">
              {{ option }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Point 1</td>
        <td><calc-var-string :calcVar="calc.getVar('point1')" style="left: 0px; top: 70px;" :width=150 /></td>
      </tr>
      <tr>
        <td>Point 2</td>
        <td><calc-var-string :calcVar="calc.getVar('point2')" style="left: 0px; top: 70px;" :width=150 /></td>
      </tr>
      <tr>
        <td>Distance</td>
        <td><calc-value-and-unit :calcVar="calc.getVar('distance')" style="left: 0px; top: 70px;" :width=150 /></td>
      </tr>
      </tbody>
    </table>

    <div id="globe-container" />


  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable camelcase */
  /* eslint-disable */

  import * as d3 from 'd3'
  import * as topojson from 'topojson'
  import versor from 'versor';

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  // import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {CalcVarString} from 'src/misc/CalculatorEngineV2/CalcVarString'
  import { UnitMulti } from 'src/misc/CalculatorEngineV2/UnitMulti'
  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'
  import { CalcVarNumeric } from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import { CalcVarComboBox } from 'src/misc/CalculatorEngineV2/CalcVarComboBox'

  var self = null

  export default {
    name: 'distance-between-two-coordinates', // This will show up in the URL
    components: {},
    data: function () {
      console.log('data() called')

      var calc = new Calc()

      // ============================================================================================= //
      // ==================================== COORDINATE TYPE (combobox) ============================= //
      // ============================================================================================= //
      calc.addVar(new CalcVarComboBox({
        name: 'coordinateUnits',
        options: [
          'Degrees',
          'Radians'
        ],
        defaultVal: 'Degrees',
        validators: [],
        helpText: 'The units used for the latitude/longitude values.'
      }))

      // ============================================ //
      // =================== POINT 1 ================ //
      // ============================================ //

      calc.addVar(new CalcVarString({
        name: 'point1',
        typeEqn: () => {
          return 'input'
        },
        defaultVal: '',
        validators: [],
        helpText: 'The point that the great-circle begins at.'
      }))

      // ============================================ //
      // =================== POINT 2 ================ //
      // ============================================ //

      calc.addVar(new CalcVarString({
        name: 'point2',
        typeEqn: () => {
          return 'input'
        },
        defaultVal: '',
        validators: [],
        helpText: 'The point that the great-circle ends at.'
      }))

      // ============================================ //
      // ================== DISTANCE ================ //
      // ============================================ //

      calc.addVar(new CalcVarNumeric({
        name: 'distance',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          const coordinateUnits = calc.getVar('coordinateUnits').getVal()

          console.log('Y')
          const point1 = calc.getVar('point1').getVal()
          console.log('point1 = ' + point1)
          const point2 = calc.getVar('point2').getVal()

          // Create Coordinate objects from point1,2 inputs
          var point1Coord = new Coordinate()
          try {
            if (coordinateUnits === 'Degrees') {
              point1Coord.FromString(point1, CoordinateUnits.DEGREES)
            } else if (coordinateUnits === 'Radians') {
              point1Coord.FromString(point1, CoordinateUnits.RADIANS)
            } else {
              throw Error('Coordinate unit type not supported.')
            }
          } catch (e) {
            console.log('1 failed')
            return NaN
          }
          this.point1 = point1Coord

          var point2Coord = new Coordinate()
          try {
            if (coordinateUnits === 'Degrees') {
              point2Coord.FromString(point2, CoordinateUnits.DEGREES)
            } else if (coordinateUnits === 'Radians') {
              point2Coord.FromString(point2, CoordinateUnits.RADIANS)
            } else {
              throw Error('Coordinate unit type not supported.')
            }
          } catch (e) {
            console.log('2 failed')
            return NaN
          }
          this.point2 = point2Coord

          return this.geospatial.DistanceBetweenTwoPoints_m(point1Coord, point2Coord)
        },
        units: [
          new UnitMulti({name: 'm', multi: 1e0}),
          new UnitMulti({name: 'km', multi: 1e3})
        ],
        defaultUnitName: 'km',
        roundTo: 4,
        defaultVal: '',
        validators: [],
        helpText: 'The great-circle distance between point 1 and point 2.'
      }))

      return {
        calc: calc,
        geospatial: new Geospatial(),
        inputType: [
          {name: 'Lat, Lon (degrees)'},
          {name: 'Lat, Lon (radians)'}
        ],
        selInputType: 'test',

        // current: d3.select('#current'),
        // canvas: d3.select('#globe'),
        // context: canvas.node().getContext('2d'),
        // water: {type: 'Sphere'},
        // projection: d3.geoOrthographic().precision(0.1),
        // graticule: d3.geoGraticule10(),
        // path: d3.geoPath(this.projection).context(context),
        // v0, // Mouse position in Cartesian coordinates at start of drag gesture.
        // r0, // Projection rotation as Euler angles at start.
        // q0, // Projection rotation as versor at start.
        // lastTime: d3.now(),
        // degPerMs: degPerSec / 1000,
        // width,height,
        // land, countries,
        // countryList,
        // autorotate, now, diff, rotation,
        // currentCountry

        canvas: null,
        water: {type: 'Sphere'},
        colorWater: '#fff',
        land: null,
        colorLand: '#111',
        projection: null,
        graticule: null,
        colorGraticule: '#ccc',
        path: null,
        width: 400,
        height: 400,
        scaleFactor: 0.90,
        point1: null,
        point2: null
      }
    },
    methods: {
      calculate: function () {
        console.log('ZZZZ')
      },
      onUnitChange: function () {
        console.log('ABABAB')
      },
      fill: function(obj, color) {
        // console.log('fill() called. this.context =')
        // console.log(this.context)
        this.context.beginPath()
        this.path(obj)
        this.context.fillStyle = color
        this.context.fill()
      },
      stroke: function(obj, color) {
        this.context.beginPath()
        this.path(obj)
        this.context.strokeStyle = color
        this.context.stroke()
      },
      loadData: function (cb) {
        d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
          if (error) throw error
          d3.tsv('https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv', function(error, countries) {
            if (error) throw error
            cb(world, countries)
          })
        })
      },
      loadDataCallback: function (world, cList) {
        this.land = topojson.feature(world, world.objects.land)
        this.countries = topojson.feature(world, world.objects.countries)
        this.countryList = cList
        this.scale()

      },
      scale: function () {
        // console.log('scale() called. this.canvas = ' + this.canvas)
        // this.width = document.documentElement.clientWidth
        // this.height = document.documentElement.clientHeight
        this.canvas.attr('width', this.width).attr('height', this.height)
        this.projection
          .scale((this.scaleFactor * Math.min(this.width, this.height)) / 2)
          .translate([this.width / 2, this.height / 2])
        this.render()
      },
      render: function () {
        // console.log('render() called. this.water =')
        this.context.clearRect(0, 0, this.width, this.height)
        this.fill(this.water, this.colorWater)
        this.stroke(this.graticule, this.colorGraticule)
        this.fill(this.land, this.colorLand)


        if(this.point1 != null) {
          console.log('this.point1 = ' + this.point1.GetLat_rad() + ', ' + this.point1.GetLon_rad())
          var point = this.projection([this.point1.GetLon_deg(), this.point1.GetLat_deg()])
          this.context.beginPath()
          this.context.fillStyle = "red";
          this.context.arc(point[0], point[1], 10, 0, 2*Math.PI)
          this.context.fill()
        }

        if(this.point2 != null) {
          var point = this.projection([this.point2.GetLon_deg(), this.point2.GetLat_deg()])
          this.context.beginPath()
          this.context.fillStyle = "red";
          this.context.arc(point[0], point[1], 10, 0, 2*Math.PI)
          this.context.fill()
        }




      },
      dragstarted: function() {
        this.v0 = versor.cartesian(this.projection.invert(d3.mouse(window.document.getElementById("globe-container"))))
        this.r0 = this.projection.rotate()
        this.q0 = versor(this.r0)
      },
      dragged: function () {
        var v1 = versor.cartesian(this.projection.rotate(this.r0).invert(d3.mouse(window.document.getElementById("globe-container"))))
        var q1 = versor.multiply(this.q0, versor.delta(this.v0, v1))
        var r1 = versor.rotation(q1)
        this.projection.rotate(r1)
        self.render()
      },
      dragended: function () {
        // startRotation(rotationDelay)
      }
    },
    mounted () {
      // Configure calculator to default state now that
      // UI has been created
      this.calc.init()

      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
      }

      this.canvas = d3.select('#globe-container').append('canvas')
        .attr('width', this.width)
        .attr('height', this.height)

      this.context = this.canvas.node().getContext('2d')
      this.projection = d3.geoOrthographic().precision(0.1)
      this.graticule = d3.geoGraticule10()
      this.path = d3.geoPath(this.projection).context(this.context)
      this.loadData(this.loadDataCallback)

      self = this

      this.canvas
        .call(d3.drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended)
        )


    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
