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
          v-on:new-categories="onNewCategories"
        />
      </div>
    </aside>
    <main class="as-main">
      <div class="as-map-area">
        <div id="map"></div>
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

export default {
  name: 'Dashboard',
  props: {
  },
  components: {
    FormulaWidget,
    CategoryWidget
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
    ...mapState({
      delay: 'delay',
      center: 'center',
      zoom: 'zoom'
    })
  },
  mounted: function () {
    this.initialize()
  },
  methods: {
    ...mapActions([
      'moveTo'
    ]),
    numberFormat: function (number) {
      return this.numbFormatter.format(number)
    },
    initialize: function () {
      const responsiveContent = document.querySelector('as-responsive-content')
      responsiveContent.addEventListener('ready', () => {
        const map = new mapboxgl.Map({
          container: 'map',
          style: carto.basemaps.voyager,
          zoom: this.zoom,
          center: this.center
        })

        const nav = new mapboxgl.NavigationControl({
          showCompass: true
        })

        map.addControl(nav, 'top-left')

        carto.setDefaultAuth({
          username: 'jsanzcdb',
          apiKey: 'default_public'
        })

        const source = new carto.source.SQL(`
        select *,
               case when gdp_md_est <> -99
                  then gdp_md_est
                  else gdp_year
               end as gdp
          from world_borders_hd
        `)
        const viz = new carto.Viz(`

        @viewPop: viewportSum($pop_est)
        @viewGDP: viewportAvg($gdp)
        @viewEconomies: viewportHistogram($economy)

        color: opacity(red,0.2)
        strokeColor: black
        `)

        const layer = new carto.Layer('layer', source, viz)
        layer.addTo(map, 'watername_ocean')

        layer.on('updated', () => {
          this.countries_pop = viz.variables.viewPop.value
          this.countries_gdp = viz.variables.viewGDP.value
          this.countries_economies_cat = viz.variables.viewEconomies.value.map(f => {
            return {
              name: f.x,
              value: f.y
            }
          })
        })

        map.on('moveend', this.moveTo)

        this.viz = viz
      })
    },
    onNewCategories: function (categories) {
      if (categories.length > 0) {
        const catFormatted = categories.map(c => { return `'${c}'` })
        const filter = `$economy in [${catFormatted.join(',')}]`
        console.log('FILTER:', filter)
        this.viz.filter.blendTo(filter, 200)
      } else {
        this.viz.filter.blendTo(1, 200)
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
