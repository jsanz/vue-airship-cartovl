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
    </div>
  </div>
</template>

<script>
import SwitchWidget from '@/components/SwitchWidget'

export default {
  name: 'LayerSelector',
  props: {
    layers: Array
  },
  components: {
    SwitchWidget
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
