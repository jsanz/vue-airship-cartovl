<template>
  <div id="map"></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import mapboxgl from 'mapbox-gl'
import carto from '@carto/carto-vl'

export default {
  name: 'MapboxMap',
  computed: {
    ...mapState([
      'delay',
      'center',
      'zoom',
      'auth',
      'layers'
    ])
  },
  mounted: function () {
    this.$nextTick(function () {
      this.initialize()
    })
  },
  methods: {
    ...mapActions([
      'moveTo',
      'setViz',
      'getLayerById'
    ]),
    updatePopulatedPlaces: function (variables) {
      const payload = {
        populatedPlacesCat: variables.viewFeatureCla.value.map(f => {
          return {
            name: f.x,
            value: f.y
          }
        })
      }
      this.$emit('update-populated-places', payload)
    },
    updateCountries: function (variables) {
      const payload = {
        countriesPop: variables.viewPop.value,
        countriesGdp: variables.viewGDP.value,
        countriesEconomiesCat: variables.viewEconomies.value.map(f => {
          return {
            name: f.x,
            value: f.y
          }
        })
      }
      this.$emit('update-countries', payload)
    },
    initialize: function () {
      console.log('Initializing map...')
      const WORLD_BORDERS = 'world_borders'
      const POPULATED_PLACES = 'populated_places'
      const layers = this.layers

      const responsiveContent = document.querySelector('as-responsive-content')
      responsiveContent.addEventListener('ready', () => {
        /* Create the map object from store properties */
        const map = new mapboxgl.Map({
          container: 'map',
          style: carto.basemaps.voyager,
          zoom: this.zoom,
          center: this.center,
          hash: true
        })

        const nav = new mapboxgl.NavigationControl({
          showCompass: false
        })
        map.addControl(nav, 'top-left')

        /* whenever the map moves, update the store */
        map.on('load', this.moveTo)
        map.on('moveend', this.moveTo)

        layers.forEach(storeLayer => {
          const id = storeLayer.id
          const name = storeLayer.name
          const updateCountries = this.updateCountries
          const updatePopulatedPlaces = this.updatePopulatedPlaces

          if (storeLayer.layer) {
            const layer = storeLayer.layer
            /* add the layer to the map */
            layer.addTo(map, storeLayer.belowTo)

            layer.on('loaded', () => {
              /* hide layer if needed */
              if (!storeLayer.visible) {
                layer.hide()
              }

              this.setViz({ 'id': id, 'viz': layer.viz })
            })

            if (id === WORLD_BORDERS) {
              const updateDashboardCountriesWidgets = function () {
                updateCountries(layer.viz.variables)
              }

              layer.on('updated', updateDashboardCountriesWidgets)
              layer.on('loaded', updateDashboardCountriesWidgets)
            } else if (id === POPULATED_PLACES) {
              const updateDashboardPopulatedPlacesCategories = function () {
                updatePopulatedPlaces(layer.viz.variables)
              }

              layer.on('updated', updateDashboardPopulatedPlacesCategories)
              layer.on('loaded', updateDashboardPopulatedPlacesCategories)
            }
          } else {
            throw new Error(`No viz definition for ${name}`)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
