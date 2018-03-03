<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">

    <!-- LEFT-HAND SIDE PANE FOR ENTERING POINTS -->
    <div style="flex: 0 1 auto; width: 200px; height: 300px; display: flex; flex-direction: column;">
      <span>Points</span>
      <span style="font-size: 10px;">Enter Coordinates Here (lat, lon):</span>
      <textarea v-model="pointCoordinatesString" style="width: 100%; height: 400px;"></textarea>

      <span>Arcs</span>
      <textarea v-model="arcsString" style="width: 100%; height: 400px;"></textarea>
    </div>

    <div class="spacer" style="width: 10px;"></div>

    <!-- RIGHT-HAND SIDE MAP -->
    <gmap-map
      :center="center"
      :zoom="2"
      style="flex: 1 1 auto; height: 100%;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      ></gmap-marker>
      <gmap-polyline
        :path="[{ lat: 0.0, lng: 0.0 }, { lat: 45.0, lng: 45.0 }]"
        :options="{ geodesic: true }"></gmap-polyline>
    </gmap-map>

  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable */


  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'

  // import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcSelect from 'src/misc/CalculatorEngineV3/CalcSelect'


  export default {
    name: 'map-plotter', // This will show up in the URL
    components: { CalcInput, CalcSelect },
    data: function () {

      return {
        center: {lat: 10.0, lng: 10.0},
        // markers: [{
        //   position: {lat: 10.0, lng: 10.0}
        // }, {
        //   position: {lat: 11.0, lng: 11.0}
        // }],
        pointCoordinatesString: '0,  0\n10, 10',
        arcsString: '0,0,10,10',
        selCoordinateUnit: 'Degrees'
      }
    },
    computed: {
      markers () {
        var test = []

        var coordArray = this.pointCoordinatesString.split('\n')
        coordArray.map((coordString) => {
          console.log('coordString =')
          console.log(coordString)
          var pointCoord = new Coordinate()
          try {
            if (this.selCoordinateUnit === 'Degrees') {
              pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
            } else if (this.selCoordinateUnit === 'Radians') {
              pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
            }
          } catch (e) {
            return
          }
          test.push({
            position: {
              lat: pointCoord.GetLat_deg(),
              lng: pointCoord.GetLon_deg()
            }
          })
        })

        return test
      },
      arcs () {
        var arcs = []
        var arcsStringArray = this.arcsString.split('\n')
        arcsStringArray.map((arcString) => {
          var arc = {}
          arc.path = []

        })
      }
    },
    watch: {},
    methods: {
      test: function () {
        // var markers = []
        var coordArray = this.pointCoordinatesString.split('\n')
        coordArray.map((coordString) => {
          console.log('coordString =')
          console.log(coordString)
          var pointCoord = new Coordinate()
          try {
            if(this.selCoordinateUnit === 'Degrees') {
              pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
            } else if(this.selCoordinateUnit === 'Radians') {
              pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
            }
          } catch (e) {
            return null
          }
          this.markers.push({
            position: {
              lat: pointCoord.GetLat_deg(),
              lng: pointCoord.GetLon_deg()
            }
          })

          // markers = [{
          //   position: {lat: 10.0, lng: 10.0}
          // }, {
          //   position: {lat: 11.0, lng: 11.0}
          // }]

          // console.log('markers =')
          // console.log(markers)
          // return markers

        })
      }
    },
    mounted () {
      // this.markers[0].position.lat = 50.0
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
