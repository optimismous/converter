import { getExchangeRate } from "./api-requests";
import config from '../../config';
const currencies = (config.currenciesList || ['BTC', 'USD']).map(currency => ({ text: currency }));

const GET_EXCHANGE_RATE_REQUEST = 'GET_EXCHANGE_RATE_REQUEST';
const GET_EXCHANGE_RATE_SUCCESS = 'GET_EXCHANGE_RATE_SUCCESS';
const GET_EXCHANGE_RATE_FAIL = 'GET_EXCHANGE_RATE_FAIL';
const SET_ACTIVE_CURRENCY_PAIR = 'SET_ACTIVE_CURRENCY_PAIR';

const state = {
  currencyFrom: "USD",
  currencyTo: "BTC",
  exchangeRate: undefined,
  allCurrencies: currencies,
  exchangeRateFetching: false,
  fetching: false,
  error: undefined
};

const mutations = {
  [SET_ACTIVE_CURRENCY_PAIR](state, { currencyFrom, currencyTo }) {
    // return { ...state, currencyFrom, currencyTo };
    // Object.assign(state, { currencyFrom, currencyTo });
    state.currencyFrom = currencyFrom;
    state.currencyTo = currencyTo;
  },
  [GET_EXCHANGE_RATE_REQUEST](state) {
    state.exchangeRateFetching = true;
  },
  [GET_EXCHANGE_RATE_SUCCESS](state, { exchangeRate }) {
    state.exchangeRateFetching = false;
    state.exchangeRate = exchangeRate;
  },
  [GET_EXCHANGE_RATE_FAIL](state, { currencyFrom, currencyTo }) {
    state.exchangeRateFetching = false;
    state.error = `Не удалось загрузить обменный курс по паре ${currencyFrom}/${currencyTo}`;
  }
};

const actions = {
  async getExchangeRate({ commit }, { currencyFrom, currencyTo }) {
    commit(GET_EXCHANGE_RATE_REQUEST);
    try {
      const exchangeRate = await getExchangeRate(currencyFrom, currencyTo);
      commit(SET_ACTIVE_CURRENCY_PAIR, { currencyFrom, currencyTo });
      commit(GET_EXCHANGE_RATE_SUCCESS, { exchangeRate });
    } catch (e) {
      console.error(e);
      commit(GET_EXCHANGE_RATE_FAIL, { currencyFrom, currencyTo });
    }
  }
};

export default {
  state,
  mutations,
  actions
};
