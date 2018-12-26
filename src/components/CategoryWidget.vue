<template>
  <div class="as-box" v-if="categories">
    <as-category-widget
      ref="categoryWidget"
      :heading="heading"
      :description="description"
      :show-clear-button="showClear"
      :defaultBarColor="defaultBarColor"
    ></as-category-widget>
  </div>
</template>

<script>
export default {
  name: 'CategoryWidget',
  props: {
    heading: String,
    description: String,
    showClear: Boolean,
    defaultBarColor: String,
    categories: Array
  },
  data: function () {
    return {
      categoryWidget: null
    }
  },
  mounted: function () {
    if (this.$refs.categoryWidget) {
      this.categoryWidget = this.$refs.categoryWidget
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
      if (!this.categoryWidget && this.$refs.categoryWidget) {
        this.categoryWidget = this.$refs.categoryWidget
        this.categoryWidget.addEventListener('categoriesSelected', event => {
          this.$emit('new-categories', event.detail)
        })
      }
      if (this.categoryWidget) {
        this.categoryWidget.categories = newValue
      }
    }
  }
}
</script>
