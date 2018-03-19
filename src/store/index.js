import Vue from 'vue';
import Vuex from 'vuex';
import currencies from './modules/currencies';
import rateHistory from './modules/rate-history';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    currencies,
    rateHistory
  },
  plugins: []
});
