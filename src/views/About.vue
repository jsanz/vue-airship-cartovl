<template>
  <div class="as-container">
    <div class="as-box">
      <h1 class="as-title">Testing Vue with Airship and CARTO VL</h1>

      <ul class="as-list">
        <li class="as-list__item"><a href="https://github.com/jsanz/vue-airship-cartovl">Source code in github</a></li>
      </ul>
    </div>
    <div class="as-box">
      <h2 class="as-title">Current execution details</h2>
      <ul class="as-list">
        <li class="as-list__item" v-if="center"><tt>center: {{center.lat.toFixed(2)}}, {{center.lng.toFixed(2)}}</tt></li>
        <li class="as-list__item"><tt>zoom: {{zoom}}</tt></li>
      </ul>
    </div>
    <div class="as-box">
      <h2 class="as-title">Layers</h2>
      <ul class="as-list" v-for="layer in layers" :key="layer.id">
        <li class="as-list__item">{{layer.name}}&nbsp;
          <span v-if="layer.visible">(visible)</span>
          <span v-else>(hidden)</span>
          <ul class="as-list">
            <li class="as-list__item">
              <span v-if="layer.dataset">Name:
                <tt>{{layer.dataset}}</tt>
              </span>
              <span v-else>Query: <code>{{layer.sql}}</code></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import { mapState } from 'vuex'

export default {
  name: 'About',
  props: {},
  computed: {
    ...mapState([
      'center',
      'zoom',
      'layers'
    ])
  }
}
</script>
