const state = {
  // Complete list of calculators that the user can open.
  // These are presented to the user, but filtered first.
  availableCalcs: [],

  // This is updated whenever the search text is changed.
  filteredAvailableCalcs: []
}

// mutations
const mutations = {
  registerCalc (state, payload) {
    state.availableCalcs.push(payload)
  },
  updateFilteredAvailableCalcs (state, searchText) {
    console.log('updateFilteredAvailableCalcs() called with payload = ' + searchText)

    // Update the filtered available calculators. If the search text is '' (i.e.
    // empty), return all the calculators.
    if (searchText === '') {
      state.filteredAvailableCalcs = state.availableCalcs
      return
    }
    state.filteredAvailableCalcs = state.availableCalcs.filter(calc => {
      // Create regex pattern from search text
      var regex = new RegExp(searchText, 'gi')
      // Search in calculator title (display name)
      if (calc.displayName.match(regex)) return true
      // Search through the tags
      for (var tag of calc.tags) {
        if (tag.match(regex)) return true
      }
    })
  }
}

const actions = {
  /**
   * Call this to register a calculator with the app. This is typically done at
   * start-up.
   * @param context
   * @param value     The calculator you wish to register.
   */
  registerCalc ({state, commit, rootState}, value) {
    console.log('registerCalc() called with state =')
    console.log(state)
    console.log(rootState)
    commit('registerCalc', value)
    commit('updateFilteredAvailableCalcs', rootState.searchText)
  }
}

export default {
  state,
  mutations,
  actions
}
