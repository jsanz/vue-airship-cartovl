<template>
  <as-switch
    ref="switchWidget"
    :id=id
    :checked=checked
    :name=name
    :label=label>
  </as-switch>
</template>

<script>
export default {
  name: 'SwitchWidget',
  props: {
    id: String,
    checked: Boolean,
    name: String,
    label: String
  },
  data: function () {
    return {
      switchWidget: null
    }
  },
  mounted: function () {
    this.switchWidget = this.$refs.switchWidget

    this.switchWidget.addEventListener('change', event => {
      this.$emit('switch', {
        id: this.id,
        checked: event.detail
      })
    })
  }
}
</script>
