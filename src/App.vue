<template>
  <div>
    <header class="as-toolbar">
      <div class="as-toolbar__group">
          <img class="as-toolbar__item as-p--8" src="../src/assets/carto_negative_icon.png" alt="CARTO">
          <router-link class="as-toolbar__item" to="/">Home</router-link>|
          <router-link class="as-toolbar__item" to="/about">About</router-link>
      </div>
    </header>
    <div class="as-content">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
  .as-toolbar img{
    max-width: 60px;
    max-height: 60px;
  }
</style>
