<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">

    <!-- LEFT-HAND SIDE PANE FOR ENTERING POINTS -->
    <div style="flex: 0 1 auto; width: 200px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <span style="font-weight: bold;">Points</span>
      <span style="font-size: 10px;">Enter point coordinates here<br>&lt;lat, lon&gt;:</span>
      <calc-textarea v-model="pointCoordinatesTextArea" style="width: 100%; height: 200px;"/>

      <div class="spacer" style="height: 20px;"></div>

      <span style="font-weight: bold;">Arcs</span>
      <span style="font-size: 10px;">Enter arc start and end coordinates here<br>&lt;lat_start, lon_start, lat_end, lon_end&gt;:</span>
      <calc-textarea v-model="arcsTextArea" style="width: 100%; height: 200px;"/>

      <span style="font-size: 12px;">Draw arcs as:</span>
      <div style="display: flex;">
        <input type="radio" id="greatCircles" value="Great Circles" v-model="drawArcsAs"/>
        <label for="greatCircles" style="font-size: 10px;">Great circles</label>
      </div>
      <div style="display: flex;">
        <input type="radio" id="rhumbLines" value="Rhumb Lines" v-model="drawArcsAs"/>
        <label for="rhumbLines" style="font-size: 10px;">Rhumb lines</label>
      </div>

      <div class="spacer" style="height: 20px;"></div>
      <button @click="clearAll" style="width: 100px; height: 40px;">Clear All</button>

      <div class="spacer" style="height: 20px;"></div>
      <button @click="zoomToFit" style="width: 100px; height: 40px;">Zoom To Fit</button>
    </div>

    <div class="spacer" style="width: 10px;"></div>

    <!-- RIGHT-HAND SIDE MAP -->
    <gmap-map
      ref="map"
      :center="center"
      :zoom="2"
      style="flex: 1 1 auto; height: 100%;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"/>
      <gmap-polyline
        v-for="(arc, index) in arcs"
        :key="'a' + index.toString()"
        :path="arc.path"
        :options="{ geodesic: arc.geodesic }" />
    </gmap-map>

  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable */


  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'

  import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcSelect from 'src/misc/CalculatorEngineV3/CalcSelect'
  import CalcTextArea from 'src/misc/CalculatorEngineV3/CalcTextArea'

  export default {
    name: 'map-plotter', // This will show up in the URL
    components: { 'calc-input': CalcInput, CalcSelect, 'calc-textarea': CalcTextArea },
    data: function () {

      return {
        center: {lat: 10.0, lng: 10.0},
        pointCoordinatesTextArea: {
          dir: 'in',
          value: '20, -10\n20, 10',
          help: 'Enter the coordinates for one point per line.',
          validator: {
            state: 'ok',
            msg: 'Test'
          }
        },
        arcsTextArea: {
          dir: 'in',
          value:
          '15,-20,5,-10\n' +
          '5,-10,5,10\n' +
          '5,10,15,20',
          help: 'Enter the start and end coordinates for one arc per line.',
          validator: {
            state: 'ok',
            msg: 'Test'
          }
        },
        selCoordinateUnit: 'Degrees',
        drawArcsAs: 'Great Circles'
      }
    },
    computed: {
      markers () {
        var points = []

        var coordArray = this.pointCoordinatesTextArea.value.split('\n')
        var allPointsValid = true
        coordArray.map((coordString) => {
          // Ignore empty lines
          if (coordString === '') return

          var pointCoord = new Coordinate()
          try {
            if (this.selCoordinateUnit === 'Degrees') {
              pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
            } else if (this.selCoordinateUnit === 'Radians') {
              pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
            }
          } catch (e) {
            allPointsValid = false
            return
          }
          points.push({
            position: {
              lat: pointCoord.GetLat_deg(),
              lng: pointCoord.GetLon_deg()
            }
          })
        })

        if (allPointsValid) {
          this.pointCoordinatesTextArea.validator.state = 'ok'
          this.pointCoordinatesTextArea.validator.msg = ''
        } else {
          this.pointCoordinatesTextArea.validator.state = 'error'
          this.pointCoordinatesTextArea.validator.msg = 'One or more points is not in the correct format.'
        }

        return points
      },
      arcs () {
        var arcs = []
        var arcsTextAreaArray = this.arcsTextArea.value.split('\n')
        var allPointsValid = true
        arcsTextAreaArray.map((arcString) => {

          // Ignore a line which is empty
          if (arcString === '') return

          var arc = {}
          arc.path = []

          const numbers = arcString.split(',')

          // Make sure there is just not one point (only one coordinate error will
          // be handled by the 'FromString' method call below)
          if (numbers.length === 2) allPointsValid = false

          for (var i = 0; i < numbers.length/2; i++) {
            var pointCoord = new Coordinate()
            const coordString = numbers[2*i] + ', ' + numbers[2*i + 1]
            try {
              if (this.selCoordinateUnit === 'Degrees') {
                pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
              } else if (this.selCoordinateUnit === 'Radians') {
                pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
              }
            } catch (e) {
              allPointsValid = false
              return
            }
            arc.path.push({ lat: pointCoord.GetLat_deg(), lng: pointCoord.GetLon_deg() })
          }

          if (this.drawArcsAs === 'Great Circles') {
            arc.geodesic = true
          } else if (this.drawArcsAs === 'Rhumb Lines') {
            arc.geodesic = false
          } else {
            throw Error('drawArcsAs type not recognized.')
          }

          arcs.push(arc)

        })

        if (allPointsValid) {
          this.arcsTextArea.validator.state = 'ok'
          this.arcsTextArea.validator.msg = ''
        } else {
          this.arcsTextArea.validator.state = 'error'
          this.arcsTextArea.validator.msg = 'One or more arcs is not in the correct format.'
        }

        return arcs
      }
    },
    watch: {},
    methods: {
      clearAll () {
        // Clears all points and arcs from map (as well as from text boxes)
        this.pointCoordinatesTextArea.value = ''
        this.arcsTextArea.value = ''
      },
      zoomToFit () {
        // The Google map object is stored with the vue2-google-maps component,
        // we need to access it directly
        var map = this.$refs.map.$mapObject

        var bounds = new google.maps.LatLngBounds();

        // Capture all markers
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend({ lat: this.markers[i].position.lat, lng: this.markers[i].position.lng });
        }

        // Capture all points on arcs
        for (var i = 0; i < this.arcs.length; i++) {
          // console.log('this.arc)
          for (var j = 0; j < this.arcs[i].path.length; j++) {
            bounds.extend({lat: this.arcs[i].path[j].lat, lng: this.arcs[i].path[j].lng });
          }
        }

        map.setCenter(bounds.getCenter())
        map.fitBounds(bounds);

        // fitBounds() is async so we perform the zoom manipulation from within a callback
        google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
          this.setZoom(map.getZoom()-1)
          if (this.getZoom() > 15) {
            this.setZoom(15)
          }
        })
      }
    },
    mounted () {}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
