<template>
  <div class="as-box">
    <as-category-widget
      ref="categoryWidget"
      :heading="heading"
      :description="description"
      :show-clear-button="showClear"
      :defaultBarColor="defaultBarColor"
      :error="error"
      :error-description="errorDescription"
      :is-loading="isLoading"
    ></as-category-widget>
  </div>
</template>

<script>
export default {
  name: 'CategoryWidget',
  props: {
    layerId: String,
    field: String,
    heading: String,
    description: String,
    showClear: Boolean,
    defaultBarColor: String,
    categories: Array,
    error: String,
    isLoading: Boolean
  },
  data: function () {
    return {
      categoryWidget: null
    }
  },
  computed: {
    errorDescription: function () {
      if (this.error) {
        return 'Layer is deactivated'
      } else {
        return false
      }
    }
  },
  mounted: function () {
    if (this.$refs.categoryWidget) {
      this.categoryWidget = this.$refs.categoryWidget
      const layerId = this.layerId
      const field = this.field
      this.categoryWidget.addEventListener('categoriesSelected', event => {
        this.$emit('new-categories', {
          'layerId': layerId,
          'field': field,
          'categories': event.detail
        })
      })
    }
  },
  methods: {
    getSelectedCategories: function () {
      return this.categoryWidget.getSelectedCategories()
    },
    clearSelection: function () {
      return this.categoryWidget.clearSelection()
    }
  },
  watch: {
    categories: function (newValue) {
      if (this.categoryWidget) {
        this.categoryWidget.categories = newValue
      }
    }
  }
}
</script>
