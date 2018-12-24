<template>
  <section class="as-box" v-if="value">
        <h2 class="as-subheader as-color--type-01 as-mb--12">{{title}}</h2>
        <p class="as-display as-mb--0">{{valueFormatted}}</p>
        <p class="as-body">{{unit}}</p>
  </section>
</template>

<style scoped>

</style>

<script>
export default {
  name: 'FormulaWidget',
  props: {
    title: String,
    unit: String,
    formatter: Intl.NumberFormat,
    value: Number
  },
  computed: {
    valueFormatted: function () {
      return this.formatter.format(this.value)
    }
  }
}
</script>
