<template>
  <as-responsive-content>
    <aside class="as-sidebar as-sidebar--right as-sidebar--xl" data-name="Widgets">
      <div class="as-container as-container--scrollable">
        <formula-widget
          ref="countries_pop"
          class="js-worldborders-widget"
          title="Population"
          unit="Inhabitants"
          :value=countries_pop
          :formatter=numbFormatter
          :error=isCountriesDisabled
        />
        <formula-widget
          ref="countries_gdp"
          class="js-worldborders-widget"
          title="Average GDP"
          unit="Euros"
          :value=countries_gdp
          :formatter=currFormatter
          :error=isCountriesDisabled
        />
        <category-widget
          ref="countries_economies"
          class="js-worldborders-widget"
          heading="Economies"
          description="Countries by economy"
          :show-clear=true
          :categories=countries_economies_cat
          :is-loading=isCategoriesLoading
          :error=isCountriesDisabled
          v-on:new-categories="onWBNewCategories"
        />
      </div>
    </aside>
    <main class="as-main">
      <div class="as-map-area">
        <div id="map"></div>
        <div class="as-map-panels" data-name="Legend">
          <div class="as-panel as-panel--top as-panel--right">
            <div class="as-panel__element">
              <layer-selector :layers=layers />
            </div>
          </div>
        </div>
      </div>
    </main>
  </as-responsive-content>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import mapboxgl from 'mapbox-gl'
import carto from '@carto/carto-vl'

import FormulaWidget from '@/components/FormulaWidget'
import CategoryWidget from '@/components/CategoryWidget'
import LayerSelector from '@/components/LayerSelector'

export default {
  name: 'Dashboard',
  props: {
  },
  components: {
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
      viz: null,
      countries_pop: null,
      countries_gdp: null,
      countries_economies_cat: null
    }
  },
  computed: {
    visibleLayers: function () {
      return this.layers.filter(l => { return l.visible }).length
    },
    isCategoriesLoading: function () {
      return this.countries_economies_cat === null
    },
    isCountriesDisabled: function () {
      return !this.getLayer('world_borders').visible ? 'HIDDEN' : null
    },
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
  watch: {
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
    getLayer: function (id) {
      return this.layers.filter(l => { return l.id === id })[0]
    },
    initialize: function () {
      const responsiveContent = document.querySelector('as-responsive-content')
      const ctx = this
      const WIDGET_LAYER = 'world_borders'

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
        map.on('moveend', this.moveTo)

        ctx.layers.forEach(storeLayer => {
          const id = storeLayer.id
          const name = storeLayer.name

          if (storeLayer.layer) {
            const layer = storeLayer.layer
            /* add the layer to the map */
            layer.addTo(map, storeLayer.belowTo)

            layer.on('loaded', () => {
              /* hide layer if needed */
              if (!storeLayer.visible) {
                layer.viz.hide()
              }

              this.setViz({ 'id': id, 'viz': layer.viz })
            })

            if (id === WIDGET_LAYER) {
              const updateCountries = function () {
                ctx.countries_pop = layer.viz.variables.viewPop.value
                ctx.countries_gdp = layer.viz.variables.viewGDP.value
                ctx.countries_economies_cat = layer.viz.variables.viewEconomies.value.map(f => {
                  return {
                    name: f.x,
                    value: f.y
                  }
                })
              }

              layer.on('updated', updateCountries)
              layer.on('loaded', updateCountries)
            }
          } else {
            throw new Error(`No viz definition for ${name}`)
          }
        })
      })
    },
    /* Update the visualization when categories are selected on the widget */
    onWBNewCategories: function (categories) {
      const wbLayer = this.getLayer('world_borders')
      const viz = wbLayer.viz

      let filter = 1

      if (categories.length > 0) {
        const catFormatted = categories.map(c => { return `'${c}'` })
        filter = `$economy in [${catFormatted.join(',')}]`
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
