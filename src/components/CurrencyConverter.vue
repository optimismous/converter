<template>
  <div>
    <div class="header">
      <h1>{{ header }}</h1>
    </div>
    <div class="selectors">
      <select class="select" v-model="currencyFrom">
        <option
          v-for="option in currencies"
          v-bind:disabled="option.text === currencyTo"
          v-bind:key="option.text"
          v-bind:value="option.text">
          {{ option.text }}
        </option>
      </select>
      <span v-on:click="swapCurrencies" class="swap"></span>
      <select class="select" v-model="currencyTo">
        <option
          v-for="option in currencies"
          v-bind:disabled="option.text === currencyFrom"
          v-bind:key="option.text"
          v-bind:value="option.text">
          {{ option.text }}
        </option>
      </select>
    </div>
    <input
      name="fromCurrency"
      placeholder="Введите сумму"
      v-model.number="volume"
    />
    {{ currencyFrom }}
    <div class="content">
      {{result | precision(6)}} {{ currencyTo }}
    </div>
    <div class="chart">
      <line-chart :chart-data="chartData"></line-chart>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart';
import { DateTime } from 'luxon';
import { getConversionRate, getRateHistoryByDays } from '../api-requests';
import config from '../config';

export default {
  name: 'currency-converter',
  components: {
    LineChart
  },
  data() {
    const currencies = (config.currenciesList || ['USD', 'RUB']).map(currency => ({ text: currency }));

    return {
      currencyFrom: 'BTC',
      labels: [],
      currencyTo: 'USD',
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
  filters: {
    numbersOnly: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.replace(/[^0-9]*/ig, '');
    },
    precision: function (value, signsAfterPoint) {
      if (!value) return '';
      const factor = Math.pow(10, signsAfterPoint);
      return Math.round(value * factor) / factor;
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
      const rate = await getConversionRate(currencyFrom, currencyTo);
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
  .selectors {
    margin: 0 auto;
    max-width: 300px;
  }
  .select {
    vertical-align: top;
  }
  .swap {
    cursor: pointer;
    position: relative;
    top: -6px;
    line-height: 32px;
    display: inline-block;
    width: 32px;
    height: 32px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJElEQVRYR+3U20nGQBCG4ecvQGxAOxBvFaxC9MIyBK884PkAP1iI6IVdiKhFiBWIDciCgRCT7GZJDEL2dmfme/ebmZ0Z+cxG1jcBTA4M6cAiPmNDPiTANlZx3AYxNMA9znHSBPEXAEG7ESIXYAPLkf6uYbcUc4bTak4uwAO2YgNWc/8L4t8CrGMp4kCI2eurBUk7XQEKaxi2IJza/oeLlBbc4BmPHXteADSKpwBcYx+bmQArdZNffkibA4V4iM8BWMBXzLUmgCsclJJv8Rop9o6nmGDKP3CJw66FcIedrnl1DlzgqGuhPgGCdhVijpcI1MfPtnRibxvCMkTOECaBxP6BAmI0gKIdbxn/QC8OFEWSdjpJsRIUa0FOzU45E8DkwOgOfAOH8S4h2pbkIQAAAABJRU5ErkJggg==);
  }

  .currency-from {
    float: left;
  }

  .currency-to {
    float: right;
  }
</style>
