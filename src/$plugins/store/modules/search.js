import { PUNK_API_BASE_URL, PUNK_API_DEBOUNCE_TIME } from '@/constants'
import http from '@/$plugins/http'

export default {
  namespaced: true,
  state: () => ({
    request: {
      timestamp: new Date().getTime(),
      millisecondsSinceLast: 0,
      timeout: null
    },
    results: []
  }),
  getters: {
    get: state => state.results,
    getById: state => id => state.results.find(r => r.id === Number(id))
  },
  mutations: {
    set (state, results = []) {
      state.results = results ?? []
    },
    reset (state) {
      state.results = []
    }
  },
  actions: {
    byName ({ state, getters, commit, dispatch }, { name = '' }) {
      return new Promise((resolve, reject) => {
        const timestamp = new Date().getTime()
        // measure ms_since_last search
        state.request.millisecondsSinceLast = timestamp - state.request.timestamp

        if (state.request.millisecondsSinceLast >= PUNK_API_DEBOUNCE_TIME) {
          // if ms_since_last search is bigger/same debounce_time and execute the request immediately
          execRequest()
        } else {
          // if not, clear existing timeout
          if (state.request.timeout) clearTimeout(state.request.timeout)
          // setup new timeout with minimal needed time to wait to execute the request
          state.request.timeout = setTimeout(execRequest, Math.max(0, PUNK_API_DEBOUNCE_TIME - state.request.millisecondsSinceLast))
        }

        function execRequest () {
          // update timestamp
          state.request.timestamp = timestamp

          if (name !== '') {
            http({
              method: 'get',
              url: `${PUNK_API_BASE_URL}/beers?beer_name=${name}`
            })
              .then(response => {
                commit('set', response.data)
                resolve(getters.get)
              })
              .catch(reject)
          } else {
            commit('reset')
            resolve(getters.get)
          }
        }
      })
    },
    byId ({ state, getters, commit, dispatch }, { id = null }) {
      return new Promise((resolve, reject) => {
        http({
          method: 'get',
          url: `${PUNK_API_BASE_URL}/beers/${id}`
        })
          .then(response => {
            commit('set', response.data)
            resolve(getters.get)
          })
          .catch(reject)
      })
    }
  }
}
