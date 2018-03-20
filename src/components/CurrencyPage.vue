<template>
  <div>
    <div class="header">
      <h1>{{ header }}</h1>
    </div>
    <div class="converter">
      <converter></converter>
    </div>
    <div class="chart">
      <currencies-chart></currencies-chart>
    </div>
  </div>
</template>

<script>
import CurrenciesChart from './CurrenciesChart';
import Converter from './Converter.vue';

export default {
  name: 'currency-page',
  data: function() {
    return {
      header: 'Конвертер валют'
    }
  },
  components: {
    CurrenciesChart,
    Converter
  }
};
</script>

<style scoped>
  .converter {
    margin-bottom: 20px;
  }
  .chart {
    max-width: 700px;
    margin: 0 auto;
  }  
</style>
