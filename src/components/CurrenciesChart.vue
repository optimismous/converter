<template>
  <div class="chart">
    <line-chart :chart-data="chartData"></line-chart>
  </div>
</template>

<script>
import LineChart from "./LineChart";
import { DateTime } from "luxon";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "currencies-chart",
  components: {
    LineChart
  },
  data() {
    return {
      labels: [],
      chartPointsLimit: 7,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "transparent",
            borderColor: "#41b883",
            data: null
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      currencyFrom: state => {
        return state.currencies.currencyFrom;
      },
      currencyTo: state => {
        return state.currencies.currencyTo;
      },
      rateHistory: state => {
        return state.rateHistory.rateHistory;
      }
    }),
    ...mapGetters(['getRateHistoryFor']),
    chartLabel: function() {
      return `${this.currencyFrom}/${this.currencyTo}`;
    }
  },
  created: async function() {
    let curDate = DateTime.local().startOf("day");
    const labels = [curDate.toISODate()];

    for (let i = 1; i < this.chartPointsLimit; i++) {
      labels.unshift(curDate.minus({ days: i }).toISODate());
    }
    this.chartData.labels = labels;
  },
  watch: {
    currencyFrom: function(currencyFrom) {
      this.reDraw(currencyFrom, this.currencyTo);
    },
    currencyTo: function(currencyTo) {
      this.reDraw(this.currencyFrom, currencyTo);
    }
  },
  methods: {
    ...mapActions(["getRateHistory"]),
    reDraw: async function(currencyFrom, currencyTo) {

      if (!this.getRateHistoryFor(currencyFrom, currencyTo) ||
        this.getRateHistoryFor(currencyFrom, currencyTo).lastUpdate < DateTime.local().startOf("day").ts) {

        await this.getRateHistory({
          currencyFrom,
          currencyTo
        });

      }

      const rateHistory = this.getRateHistoryFor(currencyFrom, currencyTo).rateHistory;

      this.chartData = this.refreshChartData(
        this.chartData,
        rateHistory,
        this.chartLabel
      );
    },
    refreshChartData: function(chartData, chartPoints, chartLabel) {
      const points = chartPoints.map(point => point * 1000);
      return {
        ...chartData,
        datasets: [
          { ...chartData.datasets[0], data: points, label: chartLabel }
        ]
      };
    }
  }
};
</script>
