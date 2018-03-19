<template>
  <div>
    <div class="header">
      <h1>{{ header }}</h1>
    </div>
    <converter
      v-bind:currencyFrom="currencyFrom"
      v-bind:currencyTo="currencyTo"
      v-bind:volume="volume"
      v-bind:currencies="currencies"
    ></converter>
    <div class="chart">
      <line-chart :chart-data="chartData"></line-chart>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart';
import Converter from './Converter.vue';
import { DateTime } from 'luxon';
import { getExchangeRate, getRateHistoryByDays } from '../store/modules/api-requests';
import config from '../config';

export default {
  name: 'currency-converter',
  components: {
    LineChart,
    Converter
  },
  data() {
    return {
      labels: [],
      volume: 1,
      result: undefined,
      header: '',
      currencies,
      chartPointsLimit: 7,
      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: 'transparent',
            borderColor: '#41b883',
            data: null
          }
        ]
      }
    };
  },
  computed: {
    chartLabel: function () {
      return `${this.currencyFrom}/${this.currencyTo}`;
    }
  },
  created: async function() {
    let curDate = DateTime.local().startOf('day');
    const labels = [curDate.toISODate()];

    for (let i = 1; i < this.chartPointsLimit; i++) {
      labels.unshift(curDate.minus({days: i}).toISODate());
    }
    this.chartData.labels = labels;
    this.reloadCurrencies();
  },
  watch: {
    currencyFrom: 'reloadCurrencies',
    currencyTo: 'reloadCurrencies',
    volume: async function (volume) {
      this.result = await this.getConversionResult(this.currencyFrom, this.currencyTo, volume)
    }
  },
  methods: {
    swapCurrencies: function() {
      const temp = this.currencyTo;
      this.currencyTo = this.currencyFrom;
      this.currencyFrom = temp;
    },
    reloadCurrencies: async function () {
      this.result = await this.getConversionResult(this.currencyFrom, this.currencyTo, this.volume);
      const points = await getRateHistoryByDays(this.currencyFrom, this.currencyTo, this.chartPointsLimit);
      this.chartData = this.refreshChartData(this.chartData, points, this.chartLabel);
    },
    getConversionResult: async function(currencyFrom, currencyTo, volume) {
      const rate = await getExchangeRate(currencyFrom, currencyTo);
      return rate * volume;
    },
    refreshChartData: function (chartData, chartPoints, chartLabel) {
      return { ...chartData, datasets: [{ ...chartData.datasets[0], data: chartPoints, label: chartLabel }] };
    }
  }
};
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
