<template>

  <div>
  <md-sidenav class="md-left" ref="leftSidenav" @close="sideBarClosed()">
    <md-toolbar class="md-large">
      <div class="md-toolbar-container">
        <h3 class="md-title">Menu</h3>
      </div>
    </md-toolbar>

    <div style="height: 50px;"></div>
    <ui-button @click.native="showCalculatorSelectionOverlay" color="primary">New Calculator</ui-button>
  </md-sidenav>
    <!--{{ this.$store.state.showLeftSideBar }}-->
  </div>

</template>

<script>
  export default {
    name: 'left-side',
    props: {},
    components: {},
    computed: {
      showLeftSideBar () {
        console.log('showLeftSideBar() called.')
        return this.$store.state.showLeftSideBar
      }
    },
    watch: {
      showLeftSideBar () {
        if (this.showLeftSideBar) {
          this.$refs.leftSidenav.show()
        } else {
          this.$refs.leftSidenav.close()
        }
      }
    },
    methods: {
      toggleLeftSidenav () {
        this.$refs.leftSidenav.toggle()
      },
      sideBarClosed () {
        console.log('sideBarClosed() called.')
        this.$store.commit('showLeftSideBar', {
          trueFalse: false
        })
      },
      showCalculatorSelectionOverlay: function () {
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: true
        })

        this.$store.commit('showLeftSideBar', {
          trueFalse: false
        })
      }
    },
    mounted () {
      // this.$refs.leftSidenav.toggle()
      console.log(this.showLeftSideBar)
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
