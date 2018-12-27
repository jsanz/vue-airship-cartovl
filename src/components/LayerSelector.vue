<template>
  <div class="as-box">
    <h2 class="as-title">Layers</h2>
    <div v-for="layer in layers" :key="layer.id" class="as-mb--8">
      <switch-widget
        :id=layer.id
        :checked=layer.visible
        :name=layer.id
        :label=layer.name
        v-on:switch="switchLayer">
      </switch-widget>
      <legend-widget v-if=layer.visible :viz=layer.viz />
    </div>
  </div>
</template>

<script>
import SwitchWidget from '@/components/SwitchWidget'
import LegendWidget from '@/components/LegendWidget'

export default {
  name: 'LayerSelector',
  props: {
    layers: Array
  },
  components: {
    SwitchWidget,
    LegendWidget
  },
  methods: {
    switchLayer: function (event) {
      this.$store.dispatch('changeLayerVisibilty', {
        id: event.id,
        visible: event.checked
      })
    }
  }
}
</script>
