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
      <span v-on:click="swapCurrencies" class="swap" />
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
      v-model.number="from"
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
import fetch from 'isomorphic-fetch';

export default {
  name: 'currency-converter',
  components: {
    LineChart
  },
  data() {
    return {
      currencyFrom: 'BTC',
      labels: [],
      currencyTo: 'USD',
      from: 1,
      result: undefined,
      header: '',
      currencies: [
        { text: "BTC" },
        { text: "LTC" },
        { text: "USD" },
        { text: "RUB" }
      ],
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
  created: function() {
    let curDate = DateTime.local().startOf('day');
    const labels = [curDate.toISODate()];

    for (let i = 1; i < this.chartPointsLimit; i++) {
      labels.unshift(curDate.minus({days: i}).toISODate());
    }
    this.chartData.labels = labels;
    this.getConversionResult();
    this.loadChartPoints(this.currencyFrom, this.currencyTo, this.chartPointsLimit)
      .then(newChartPoints => this.chartData = this.refreshChartData(this.chartData, newChartPoints, this.chartLabel));
  },
  watch: {
    currencyFrom: function (currencyFrom) {
      this.getConversionResult(currencyFrom, this.currencyTo);
      this.loadChartPoints(currencyFrom, this.currencyTo, this.chartPointsLimit)
        .then(newChartPoints => this.chartData = this.refreshChartData(this.chartData, newChartPoints, this.chartLabel));
    },
    currencyTo: function (currencyTo) {
      this.getConversionResult(this.currencyFrom, currencyTo);
      this.loadChartPoints(this.currencyFrom, currencyTo, this.chartPointsLimit)
        .then(newChartPoints => this.chartData = this.refreshChartData(this.chartData, newChartPoints, this.chartLabel));
    },
    from: 'getConversionResult'
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
    getConversionResult: function() {
      const self = this;
      // todo handle API Error ("Response" field in JSON)
      fetch(`https://min-api.cryptocompare.com/data/price?fsym=${this.currencyFrom}&tsyms=${this.currencyTo}`)
        .then(function (response) {
          // handle errors
          return response.json();
        })
        .then(function (data) {
          if (data.Response === 'Error') {
            return Promise.reject(new Error(`API Error: ${data.Message}`));
          }
          if (data && data[self.currencyTo]) {
            self.result = data[self.currencyTo] * Number(self.from);
          }
        })
        .catch((err) => console.log(err))
    },
    loadChartPoints: function (currencyFrom, currencyTo, limit = 7) {
      return fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${currencyFrom}&tsym=${currencyTo}&limit=${limit}`)
        .then((res) => {
          return res.json()
        })
        .then((result) => {
          if (result.Response === 'Error') {
            return Promise.reject(new Error(`API Error: ${result.Message}`));
          }
          return result && result.Data.map(item => item.close);
        })
        .catch(err => console.error(err))
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
