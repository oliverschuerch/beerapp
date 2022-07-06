<template>
  <div class="result-view">
    <div>
      <router-link class="backlink" :to="{ name: 'Search' }">zurück zur Suche</router-link>

      <div v-if="result" class="beer">
        <h1>{{ result.name }}</h1>
        <p>{{ result.tagline }}</p>
        <div class="beer-image">
          <img :src="result.image_url" :alt="result.name"/>
        </div>
        <p>{{ result.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultView',
  computed: {
    result () {
      return this.$store.getters['search/getById'](this.$route.params.id)
    }
  },
  created () {
    this.$store.dispatch('search/byId', { id: this.$route.params.id })
  }
}
</script>

<style lang="scss">
.result-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgba(#fff, 0.25);

  > div {
    padding: 2vh 10vw 2vh;
  }

  .backlink {
    display: inline-block;
    margin-bottom: 2rem;
  }

  .beer {
    padding: 2rem;
    background-color: rgba(#fff, 0.5);

    .beer-image {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 410px;
      margin: 2rem 0;
      padding: 5px;

      img {
        display: block;
        max-width: 400px;
        max-height: 300px;
      }
    }
  }
}
</style>
