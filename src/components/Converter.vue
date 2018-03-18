<template>
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
</template>

<script>
  export default {
    name: 'converter',
    props: ['currencyFrom', 'currencyTo', 'volume']
  }
</script>
