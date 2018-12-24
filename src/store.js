import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    center: [5, 40],
    zoom: 4,
    delay: 100
  },
  mutations: {
    changeCenter (state, center) {
      state.center = center
    },
    changeZoom (state, zoom) {
      state.zoom = zoom
    }
  },
  actions: {
    moveTo (context, event) {
      const commit = context.commit
      const map = event.target
      commit('changeCenter', map.getCenter())
      commit('changeZoom', map.getZoom())
    }
  }
})
