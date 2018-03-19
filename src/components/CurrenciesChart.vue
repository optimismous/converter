<template>
  <div class="chart">
    <line-chart :chart-data="chartData"></line-chart>
  </div>
</template>

<script>
  import LineChart from './LineChart';
  import { DateTime } from 'luxon';
  import config from '../config';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'currencies-chart',
    data() {
      return {
        labels: [],
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
      },
      ...mapState({
        currencyFrom: (state) => {
          return state.currencies.currencyFrom
        },
        currencyTo: (state) => {
          return state.currencies.currencyTo
        },
        rateHistory: (state) => {
          return state.rateHistory.rateHistory;
        }
      })
    },
    created: async function() {
      let curDate = DateTime.local().startOf('day');
      const labels = [curDate.toISODate()];

      for (let i = 1; i < this.chartPointsLimit; i++) {
        labels.unshift(curDate.minus({days: i}).toISODate());
      }
      this.chartData.labels = labels;
      this.getRateHistory({ currencyFrom: this.currencyFrom, currencyTo: this.currencyTo });
    },
    watch: {
      currencyFrom: 'getRateHistory',
      currencyTo: 'getRateHistory'
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

      refreshChartData: function (chartData, chartPoints, chartLabel) {
        return { ...chartData, datasets: [{ ...chartData.datasets[0], data: chartPoints, label: chartLabel }] };
      },
      ...mapActions(['getRateHistory'])
    }
  };
</script>
