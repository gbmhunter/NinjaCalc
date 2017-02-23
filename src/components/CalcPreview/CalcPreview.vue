<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <md-card md-with-hover class="calc-preview">

    <md-card-header>
      <div class="md-title">{{title}}</div>
      <!--<div class="md-subhead">Subtitle here</div>-->
    </md-card-header>

    <md-card-content>
      Test description.
    </md-card-content>

    <img :src="imageUrl">

    <!--<md-button id="open-button" class="md-raised md-primary">Open</md-button>-->


    <md-card-actions>
      <md-button @click.native="open">Open</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>

  export default {
    name: 'calc-preview',
    props: ['title', 'componentName', 'imageUrl'],
    components: {},
    computed: {},
    methods: {
      open () {
        console.log('open() called.')

        // Hide the overlay
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })

        // Add calculator
        this.$store.commit('openCalculator', {
          name: this.title,
          componentName: this.componentName
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .calc-preview {
    width: 200px;
    height: 300px;
    margin: 15px;

  }

  #open-button {
    width: 70px;
  }

</style>
