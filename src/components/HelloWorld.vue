<template>
  <div class="hello">
    <line-chart :chart-data="chartData"></line-chart>
  </div>
</template>

<script>
import LineChart from './LineChart';
import fetch from 'isomorphic-fetch';

export default {
  name: 'HelloWorld',
  components: {
    LineChart
  },
  data () {
    return {
      msg: 'Currency exchange',
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
        datasets: [
          {
            label: 'GitHub Commits',
            backgroundColor: 'transparent',
            borderColor: '#41b883',
            data: null
          }
        ]
      }
    };
  },
  mounted () {
    fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=9`)
      .then((res) => {
        return res.json()
      })
      /**
       * result {Object}
       * result.Data {Object}
       */
      .then((result) => {
        const data = result && result.Data.map(item => item.close);
        const dataset = { ...this.chartData.datasets[0], data };

        this.chartData = { ...this.chartData, datasets: [dataset] };
      });
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
