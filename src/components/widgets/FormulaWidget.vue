<template>
  <div class="as-box as-widget">
    <as-widget-header>
      <h2 class="as-widget-header__header">{{title}}</h2>
      <div v-if="error">
        <p class="as-widget-header__subheader as-body as-widget-header__subheader--error">{{errorLabel}}</p>
        <p class="as-body">{{errorDescription}}</p>
      </div>
    </as-widget-header>
    <div v-if="!error && value">
      <p class="as-body formula-value as-color--type-01 as-font--light as-mb--8">{{valueFormatted}}</p>
      <p class="as-body">{{unit}}</p>
    </div>
    <div v-else-if="isLoading">
      <p class="as-body">Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.formula-value{
  font-size: 2em;
}
</style>

<script>
export default {
  name: 'FormulaWidget',
  props: {
    title: String,
    unit: String,
    formatter: Intl.NumberFormat,
    value: Number,
    error: String
  },
  data: function () {
    return {
      errorLabel: 'Hidden',
      errorDescription: 'Layer is deactivated'
    }
  },
  computed: {
    valueFormatted: function () {
      return this.formatter.format(this.value)
    },
    isLoading: function () {
      return !this.value
    }
  }
}
</script>
