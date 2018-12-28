<template>
  <div class="as-container">
    <div class="as-box">
      <h1 class="as-title">Testing Vue with Airship and CARTO VL</h1>

      <p class="as-body">
        This website is an experiment to build a non-trivial application using Vue.js along with
        the most recent front-end libraries developed by the <a href="https://carto.com">CARTO</a>
        Engineering team.
      </p>

      <ul class="as-list">
        <li class="as-list__item"><a href="https://github.com/jsanz/vue-airship-cartovl">Source code in github</a></li>
        <li class="as-list__item"><a href="https://carto.com/developers/carto-vl/">CARTO VL documentation</a></li>
        <li class="as-list__item"><a href="https://carto.com/developers/airship/">Airship documentation</a></li>

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
      <ul class="as-list">
        <li class="as-list__item" v-for="layer in layers" :key="layer.id">
          {{layer.name}}&nbsp;
          <span v-if="layer.visible">(visible)</span>
          <span v-else>(hidden)</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.as-box{
  padding-bottom: 2px;
}
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
