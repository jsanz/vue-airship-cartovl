import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    center: { 'lng': 5, 'lat': 40 },
    zoom: 4,
    delay: 100,
    auth: {
      username: 'jsanzcdb',
      apiKey: 'default_public'
    },
    layers: [{
      id: 'populated_places',
      name: 'Populated Places',
      dataset: 'populated_places',
      vizDefinition: `
            color: ramp($featurecla, vivid)
            strokeColor: black
            strokeWidth: 1
      `,
      belowTo: 'watername_ocean',
      visible: false
    }, {
      id: 'world_borders',
      name: 'World Borders',
      sql: `select *,
                   case when gdp_md_est <> -99
                      then gdp_md_est
                      else gdp_year
                   end as gdp
              from world_borders_hd`,
      vizDefinition: `
            @viewPop: viewportSum($pop_est)
            @viewGDP: viewportAvg($gdp)
            @viewEconomies: viewportHistogram($economy)

            color: opacity(red,0.2)
            strokeColor: black
      `,
      belowTo: 'populated_places',
      visible: true
    }]
  },
  mutations: {
    changeCenter (state, center) {
      state.center = center
    },
    changeZoom (state, zoom) {
      state.zoom = zoom
    },
    addVLLayer (state, { id, vlLayer, viz }) {
      let layer = state.layers.filter(l => { return l.id === id })[0]
      layer['vlLayer'] = vlLayer
      layer['viz'] = viz
    },
    changeLayerVisibility (state, { id, visible }) {
      let layer = state.layers.filter(l => { return l.id === id })[0]
      layer.visible = visible
    }
  },
  actions: {
    moveTo ({ commit }, { map }) {
      if (map) {
        commit('changeCenter', map.getCenter())
        commit('changeZoom', map.getZoom())
      }
    },
    addVLLayer ({ commit }, payload) {
      commit('addVLLayer', payload)
    },
    changeLayerVisibilty ({ commit }, payload) {
      commit('changeLayerVisibility', payload)
    }
  }
})
