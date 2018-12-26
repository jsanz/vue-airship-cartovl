<template>
  <as-responsive-content>
    <aside class="as-sidebar as-sidebar--right as-sidebar--xl" data-name="Sidebar">
      <div class="as-container as-container--scrollable">
        <formula-widget
          title="View population"
          :value=countries_pop
          :formatter=numbFormatter
          unit="Inhabitants"
        />
        <formula-widget
          title="Average GDP"
          :value=countries_gdp
          :formatter=currFormatter
          unit="Euros"
        />
        <category-widget
          heading="Economies"
          description="Countries by economy"
          :show-clear=true
          :categories=countries_economies_cat
          v-on:new-categories="onWBNewCategories"
        />
      </div>
    </aside>
    <main class="as-main">
      <div class="as-map-area">
        <div id="map"></div>
        <!-- Map Panels -->
        <div class="as-map-panels">
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
    ...mapState([
      'delay',
      'center',
      'zoom',
      'auth',
      'layers'
    ])
  },
  mounted: function () {
    this.initialize()
  },
  watch: {
    visibleLayers: function () {
      this.layers.forEach(l => {
        if (l.visible !== l.vlLayer.visible) {
          if (l.visible) {
            l.vlLayer.show()
          } else {
            l.vlLayer.hide()
          }
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'moveTo',
      'addVLLayer'
    ]),
    getVLLayer: function (id) {
      const storeLayer = this.layers.filter(l => { return l.id === id })[0]
      return storeLayer.vlLayer
    },
    getViz: function (id) {
      const storeLayer = this.layers.filter(l => { return l.id === id })[0]
      return storeLayer.viz
    },
    initialize: function () {
      const responsiveContent = document.querySelector('as-responsive-content')
      const ctx = this
      responsiveContent.addEventListener('ready', () => {
        /* Create the map object from store properties */
        const map = new mapboxgl.Map({
          container: 'map',
          style: carto.basemaps.voyager,
          zoom: this.zoom,
          center: this.center
        })

        const nav = new mapboxgl.NavigationControl({
          showCompass: false
        })
        map.addControl(nav, 'top-left')

        /* whenever the map moves, update the store */
        map.on('moveend', this.moveTo)

        /* Set up the CARTO VL layers */
        carto.setDefaultAuth(this.auth)

        ctx.layers.forEach(layer => {
          const id = layer.id
          const name = layer.name
          let source = null

          if (layer.sql) {
            source = new carto.source.SQL(layer.sql)
          } else if (layer.dataset) {
            source = new carto.source.Dataset(layer.dataset)
          } else {
            throw new Error(`No source defined on for ${name}`)
          }

          if (layer.vizDefinition) {
            const viz = new carto.Viz(layer.vizDefinition)
            const vlLayer = new carto.Layer(id, source, viz)
            /* store the VL objects */
            ctx.addVLLayer({ 'id': id, 'vlLayer': vlLayer, 'viz': viz })

            /* add the layer to the map */
            vlLayer.addTo(map, layer.belowTo)

            vlLayer.on('loaded', () => {
              /* hide layer if needed */
              if (!layer.visible) {
                vlLayer.hide()
              }
            })
          } else {
            throw new Error(`No viz definition for ${name}`)
          }
        })

        /* Add widgets for the world borders layer */
        const id = 'world_borders'

        ctx.getVLLayer(id).on('updated', () => {
          const viz = ctx.getViz(id)
          ctx.countries_pop = viz.variables.viewPop.value
          ctx.countries_gdp = viz.variables.viewGDP.value
          ctx.countries_economies_cat = viz.variables.viewEconomies.value.map(f => {
            return {
              name: f.x,
              value: f.y
            }
          })
        })
      })
    },
    /* Update the visualization when categories are selected on the widget */
    onWBNewCategories: function (categories) {
      const viz = this.getViz('world_borders')
      if (categories.length > 0) {
        const catFormatted = categories.map(c => { return `'${c}'` })
        const filter = `$economy in [${catFormatted.join(',')}]`
        viz.filter.blendTo(filter, 200)
      } else {
        viz.filter.blendTo(1, 200)
      }
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
</style>
