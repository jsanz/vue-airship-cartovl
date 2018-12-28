<template>
  <div v-if=colorEntries>
    <ul class="legend">
      <li v-for="entry in colorEntries" :key="entry.id" class="as-caption">
        <span class="point-mark" :style="{ backgroundColor: entry.color }"></span>
        {{entry.label}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LegendWidget',
  props: {
    viz: Object
  },
  data: function () {
    return {}
  },
  computed: {
    colorEntries: function () {
      if (this.viz && this.viz.color && this.viz.color.getLegendData) {
        return this.viz.color.getLegendData().data.map(l => {
          return {
            id: l.index,
            label: l.key,
            color: this.rgbToHex(l.value)
          }
        })
      } else {
        return null
      }
    }
  },
  watch: {
  },
  methods: {
    rgbToHex: function (color) {
      return '#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)
    }
  }
}
</script>

<style scoped>

ul.legend {
  padding: 0 0 0 12px;
  margin: 5px;
}

ul.legend li {
  list-style-type: none;
  margin: 0 0 8px 0;
  display: flex;
  vertical-align: middle;
}

.point-mark {
  min-width: 10px;
  min-height: 10px;
  align-self: center;
  border-radius: 50%;
  margin-right: 12px;
  box-sizing: border-box;
}

</style>
