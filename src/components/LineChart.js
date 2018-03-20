import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData"],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function(tick, index, ticks) {
                return `${tick / 1000}`;
              }
            }
          }
        ]
      }
    }
  }),
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
