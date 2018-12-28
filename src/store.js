import Vue from 'vue'
import Vuex from 'vuex'
import carto from '@carto/carto-vl'

Vue.use(Vuex)

const auth = {
  username: 'jsanzcdb',
  apiKey: 'default_public'
}

/* Set up the CARTO VL layers */
carto.setDefaultAuth(auth)

export default new Vuex.Store({
  state: {
    auth,
    center: { 'lng': 5, 'lat': 40 },
    zoom: 4,
    delay: 400,
    layers: [{
      id: 'airports',
      name: 'Airports',
      viz: null,
      layer: new carto.Layer('airports',
        new carto.source.Dataset('airports'),
        new carto.Viz(`
            color: ramp($airp_group, [#5F4690,#1D6996,#38A6A5,#0F8554,#73AF48,#EDAD08,#E17C05,#CC503E,#94346E,#6F4070,#994E95,#666666])
            width: ramp(zoomrange([2, 7]), [3, 15])
            strokeWidth: 0
        `)
      ),
      belowTo: 'watername_ocean',
      visible: false
    }, {
      id: 'populated_places',
      name: 'Populated Places',
      viz: null,
      layer: new carto.Layer('populated_places',
        new carto.source.Dataset('populated_places'),
        new carto.Viz(`
            @name: $name
            @popMax: $pop_max
            @viewFeatureCla: viewportHistogram($featurecla)

            color: ramp($featurecla, [#E58606,#5D69B1,#52BCA3,#99C945,#CC61B0,#24796C,#DAA51B,#2F8AC4,#764E9F,#ED645A,#CC3A8E,#A5AA99])
            width: ramp(zoomrange([2, 7]), [3, 15])
            strokeColor: black
            strokeWidth: 1
        `)
      ),
      belowTo: 'airports',
      visible: true
    }, {
      id: 'world_borders',
      name: 'World Borders',
      viz: null,
      layer: new carto.Layer('world_borders',
        new carto.source.SQL(`select *,
                   case when gdp_md_est <> -99
                      then gdp_md_est
                      else gdp_year
                   end as gdp
              from world_borders_hd`),
        new carto.Viz(`
            @viewPop: viewportSum($pop_est)
            @viewGDP: viewportAvg($gdp)
            @viewEconomies: viewportHistogram($economy)

            color: ramp(globalQuantiles($pop_est, 7), [#63589f,#826dba,#9f82ce,#b998dd,#d1afe8,#e4c7f1,#f3e0f7])
            strokeColor: rgba(0,0,0,0.6)
        `)
      ),
      belowTo: 'populated_places',
      visible: true
    }]
  },
  getters: {
    getLayerById: (state) => (id) => {
      return state.layers.filter(l => { return l.id === id })[0]
    }
  },
  mutations: {
    changeCenter (state, center) {
      state.center = center
    },
    changeZoom (state, zoom) {
      state.zoom = zoom
    },
    changeLayerVisibility (state, { id, visible }) {
      let layer = state.layers.filter(l => { return l.id === id })[0]
      layer.visible = visible
    },
    setViz (state, { id, viz }) {
      let layer = state.layers.filter(l => { return l.id === id })[0]
      layer.viz = viz
    }
  },
  actions: {
    moveTo ({ commit }, { target }) {
      const map = target
      if (map) {
        commit('changeCenter', map.getCenter())
        commit('changeZoom', map.getZoom())
      }
    },
    changeLayerVisibilty ({ commit }, payload) {
      commit('changeLayerVisibility', payload)
    },
    setViz ({ commit }, payload) {
      commit('setViz', payload)
    }
  }
})
