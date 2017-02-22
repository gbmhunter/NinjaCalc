<template>

  <div>
    <div>V = <input v-model="voltage"></div>
  </div>

</template>

<script>
  export default {
    name: 'ohms-law-calculator-main-view',
    props: {},
    components: {},
    computed: {
    },
    watch: {
    },
    methods: {
    },
    mounted () {
      console.log('OhmsLawCalculatorMainView.mounted() called.');
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
