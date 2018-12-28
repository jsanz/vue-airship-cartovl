<template>
  <as-responsive-content>
    <aside class="as-sidebar as-sidebar--left" data-name="Legend">
      <div class="as-container as-container--scrollable">
        <layer-selector :layers=layers />
      </div>
    </aside>
    <aside class="as-sidebar as-sidebar--right" data-name="Widgets">
      <div class="as-container as-container--scrollable">
        <formula-widget
          ref="countries_pop" class="js-worldborders-widget" title="Population" unit="Inhabitants"
          :value=countriesPop :formatter=numbFormatter :error=isCountriesDisabled
        />
        <formula-widget
          ref="countries_gdp" class="js-worldborders-widget" title="Average GDP" unit="Euros"
          :value=countriesGdp :formatter=currFormatter :error=isCountriesDisabled
        />
        <category-widget
          ref="population_featurecla" class="js-populated-places-widget" heading="Populated Places"
          description="By type" layerId="populated_places" field="featurecla"
          :show-clear=true :categories=populatedPlacesCat :is-loading=isPopulatedPlacesLoading
          :error=isPPDisabled v-on:new-categories="onNewCategories"
        />
        <category-widget
          ref="countries_economies" class="js-worldborders-widget" heading="Economies"
          description="Countries by economy" layerId="world_borders" field="economy"
          :show-clear=true :categories=countriesEconomiesCat :is-loading=isCategoriesLoading
          :error=isCountriesDisabled v-on:new-categories="onNewCategories"
        />
      </div>
    </aside>
    <main class="as-main">
      <div class="as-map-area">
        <mapbox-map
          v-on:update-countries="onUpdateCountries"
          v-on:update-populated-places="onUpdatePopulatedPlaces"
         />
      </div>
    </main>
  </as-responsive-content>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import FormulaWidget from '@/components/widgets/FormulaWidget'
import CategoryWidget from '@/components/widgets/CategoryWidget'
import LayerSelector from '@/components/widgets/LayerSelector'
import MapboxMap from '@/components/MapboxMap'

export default {
  name: 'Dashboard',
  props: {
  },
  components: {
    MapboxMap,
    FormulaWidget,
    CategoryWidget,
    LayerSelector
  },
  data: function () {
    return {
      numbFormatter: new Intl.NumberFormat('en-EN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      currFormatter: new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      countriesGdp: null,
      countriesPop: null,
      countriesEconomiesCat: null,
      populatedPlacesCat: null
    }
  },
  computed: {
    visibleLayers: function () {
      return this.layers.filter(l => { return l.visible }).length
    },
    isCategoriesLoading: function () {
      return this.countriesEconomiesCat === null
    },
    isPopulatedPlacesLoading: function () {
      return this.populatedPlacesCat === null
    },
    isCountriesDisabled: function () {
      const result = this.getLayerById('world_borders') && !this.getLayerById('world_borders').visible ? 'HIDDEN' : null
      return result
    },
    isPPDisabled: function () {
      const result = this.getLayerById('populated_places') && !this.getLayerById('populated_places').visible ? 'HIDDEN' : null
      return result
    },
    ...mapState([
      'delay',
      'center',
      'zoom',
      'auth',
      'layers'
    ])
  },
  watch: {
    /* TODO this should wait for events emited by the Legend widget */
    visibleLayers: function () {
      this.layers.forEach(l => {
        if (l.visible !== l.layer.visible) {
          if (l.visible) {
            l.layer.show()
          } else {
            l.layer.hide()
          }
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'moveTo',
      'setViz'
    ]),
    getLayerById: function (id) {
      return this.$store.getters.getLayerById(id)
    },
    onUpdateCountries: function ({ countriesGdp, countriesPop, countriesEconomiesCat }) {
      this.countriesGdp = countriesGdp
      this.countriesPop = countriesPop
      this.countriesEconomiesCat = countriesEconomiesCat
    },
    onUpdatePopulatedPlaces: function ({ populatedPlacesCat }) {
      this.populatedPlacesCat = populatedPlacesCat
    },
    /* Update the visualization when categories are selected on the widget */
    onNewCategories: function ({ layerId, field, categories }) {
      console.log('Received event from the widget')
      const layer = this.getLayerById(layerId)
      console.assert(layer !== undefined, 'Layer not found')
      const viz = layer.viz

      let filter = 1

      if (categories.length > 0) {
        const catFormatted = categories.map(c => { return `'${c}'` })
        filter = `$${field} in [${catFormatted.join(',')}]`
      }

      viz.filter.blendTo(filter, this.delay)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
@import "~mapbox-gl/dist/mapbox-gl.css";

#map {
  height: 100vh;
  width: 100%;
}

.mapboxgl-popup-tip {
  border-top-color: red;
}
.mapboxgl-popup-content {
  background: none;
}
.as-infowindow {
  color: red;
  background-color: red;
}
</style>
