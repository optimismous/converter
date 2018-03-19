import { getRateHistoryByDays } from "./api-requests";

const GET_RATE_HISTORY_REQUEST = 'GET_RATE_HISTORY_REQUEST';
const GET_RATE_HISTORY_SUCCESS = 'GET_RATE_HISTORY_SUCCESS';
const GET_RATE_HISTORY_FAIL = 'GET_RATE_HISTORY_FAIL';

const state = {
  rateHistory: {},
  fetching: false,
  error: undefined
};

const mutations = {
  [GET_RATE_HISTORY_REQUEST](state) {
    state.fetching = true;
    state.error = undefined;
  },
  [GET_RATE_HISTORY_SUCCESS](state, { currencyFrom, currencyTo, rateHistory }) {
    state.fetching = false;
    state.rateHistory[currencyFrom + currencyTo] = {
      rateHistory,
      lastUpdate: Date.now()
    }
  },
  [GET_RATE_HISTORY_FAIL](state, { currencyFrom, currencyTo }) {
    state.fetching = false;
    state.error = `Не удалось загрузить историю изменений курса по паре ${currencyFrom}/${currencyTo}`;
  }
};

const actions = {
  async getRateHistory({ commit }, { currencyFrom, currencyTo }) {
    commit(GET_RATE_HISTORY_REQUEST);
    try {
      const rateHistory = await getRateHistoryByDays(currencyFrom, currencyTo);
      commit(GET_RATE_HISTORY_SUCCESS, { currencyFrom, currencyTo, rateHistory });
    } catch (e) {
      console.error(e);
      commit(GET_RATE_HISTORY_FAIL, { currencyFrom, currencyTo });
    }
  }
};

export default {
  state,
  mutations,
  actions
};
