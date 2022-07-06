<template>
  <div class="search-view">
    <h1>beer-o-meter</h1>

    <div class="beernput-wrapper">
      <div class="search-input">
        <input
          type="text"
          v-model="beernput"
          autofocus
          @input="searchByName"
          @keydown.esc="resetSearch"
          @keydown.up="setActiveResult(activeResultIndex - 1)"
          @keydown.down="setActiveResult(activeResultIndex + 1)"
          @keydown.enter="gotoResult()"
        />
      </div>

      <ul class="results" ref="results">
        <li
          v-for="(result, resultIndex) in results"
          :key="result.id"
          :class="['result', { active: resultIndex === activeResultIndex }]"
          role="button"
          @mouseover="setActiveResultByMouse(resultIndex)"
          @click="gotoResult()"
        >
          <div class="result-image">
            <img :src="result.image_url" :alt="result.name"/>
          </div>

          <div class="result-text">
            <h6 class="title">{{ result.name }}</h6>
            <p class="tagline">{{ result.tagline }}</p>
            <p class="description">
              <span>{{ result.description }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>

    <p>Find the beer you desire...</p>
  </div>
</template>

<script>
export default {
  name: 'SearchView',
  data () {
    return {
      beernput: '',
      activeResultIndex: 0,
      mouseEventEnabled: true
    }
  },
  computed: {
    results () {
      return this.$store.getters['search/get']
    }
  },
  methods: {
    searchByName (e) {
      this.$store.dispatch('search/byName', { name: this.beernput })
        .finally(this.setActiveResult)
    },
    resetSearch (e) {
      this.beernput = ''
      this.$store.commit('search/reset')
      this.activeResultId = null
    },
    setActiveResult (index = 0) {
      const hasResultAtIndex = this.results[index] !== undefined

      if (hasResultAtIndex) {
        this.activeResultIndex = index
        this.$nextTick(this.scrollToActiveResult)
      }
    },
    setActiveResultByMouse (index = 0) {
      if (this.mouseEventEnabled) this.setActiveResult(index)
    },
    scrollToActiveResult () {
      this.mouseEventEnabled = false

      const activeResultElement = this.$refs.results.querySelector('.result.active')

      if (activeResultElement) {
        const listBoundings = this.$refs.results.getBoundingClientRect()
        const elementBoundings = activeResultElement.getBoundingClientRect()

        const list = {
          top: this.$refs.results.scrollTop,
          bottom: this.$refs.results.scrollTop + listBoundings.height
        }

        const element = {
          top: activeResultElement.offsetTop,
          bottom: activeResultElement.offsetTop + elementBoundings.height
        }

        if (element.top < list.top) {
          this.$refs.results.scrollTo(0, element.top)
        } else if (element.bottom > list.bottom) {
          this.$refs.results.scrollTo(0, element.top - listBoundings.height + elementBoundings.height)
        }
      }

      setTimeout(() => {
        this.mouseEventEnabled = true
      }, 20)
    },
    gotoResult () {
      const activeResult = this.results[this.activeResultIndex] ?? {}

      if (activeResult.id) {
        this.$router.push({
          name: 'Result',
          params: {
            id: activeResult.id
          }
        })
      }
    }
  },
  created () {
    this.$store.commit('search/reset')
  }
}
</script>

<style lang="scss">
.search-view {
  padding: 2vh 10vw 18vh;

  h1, p {
    font-weight: bold;
    color: rgba(#000, 0.75);
    text-shadow: 0 0 1em rgba(255, 217, 113, 0.5);
    text-transform: lowercase;
  }

  .beernput-wrapper {
    position: relative;

    .search-input {
      position: relative;
      margin: 2rem 0;
      width: 60vw;
      background: linear-gradient(87deg, rgba(40, 71, 5, 0.75) 0%, rgba(59, 145, 38, 0.75) 50%, rgba(183, 224, 172, 0.75) 66%, rgba(18, 121, 9, 0.75) 80%);
      padding: 0.75rem;
      border-radius: 1.4rem;
      box-shadow: 0 0 25px 0 rgba(#000, 0.25), inset 0 0 35px 0 rgba(#000, 0.25);
      z-index: 2;

      input {
        display: block;
        padding: 0.75rem 1rem;
        width: 100%;
        background-color: rgba(#000, 0.1);
        border: 0 none;
        border-radius: 1rem;
        outline: 0 none;
        font-size: 2rem;
        color: #fff;
        text-align: center;
        transition: all 300ms ease-out;

        &:focus {
          background-color: rgba(#000, 0.3);
          box-shadow: inset 0 0 15px 0 rgba(#000, 0.2);
        }
      }
    }

    .results {
      position: absolute;
      top: 100%;
      left: 1.4rem;
      right: 1.4rem;
      overflow: hidden;
      overflow-y: auto;
      margin: 0;
      padding: 0;
      max-height: 35vh;
      list-style: none;
      background-color: rgba(#222, 0.9);
      z-index: 1;

      .result {
        display: flex;
        justify-content: flex-start;
        align-items: start;
        padding: 0.7rem 1.4rem;
        border-bottom: 1px solid rgba(#fff, 0.15);
        text-align: left;

        &,
        & * {
          color: #fff;
        }

        h6, p {
          text-shadow: none;
        }

        p {
          font-weight: normal;
        }

        .result-image {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 0 0 100px;
          margin-right: 1rem;
          padding: 5px;
          background-color: rgba(#fff, 0.1);

          img {
            display: block;
            max-width: 90px;
            max-height: 60px;
          }
        }

        .result-text {
          overflow: hidden;
          font-size: 14px;

          .title {
            margin-bottom: 0.5rem;
            font-size: inherit;
          }

          .tagline {
            opacity: 0.75;
          }

          .description {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &:last-child {
          border-bottom: 0;
        }

        &.active {
          background-color: rgba(#fff, 0.2);
        }
      }
    }
  }

  @media (max-width: 500px) {
    .beernput-wrapper {
      .search-input {
        width: 100%;
      }
    }
  }
}
</style>
