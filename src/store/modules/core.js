const state = {
  // Complete list of calculators that the user can open.
  // These are presented to the user, but filtered first.
  availableCalcs: []
}

// mutations
const mutations = {
  registerCalc (state, payload) {
    state.availableCalcs.push(payload)
  }
}

export default {
  state,
  mutations
}
