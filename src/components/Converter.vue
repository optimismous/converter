<template>
  <div>
    <div class="selectors">
      <input
        name="volume"
        class="volume"
        type="number"
        placeholder="Введите сумму"
        v-model="volume"
      />
      <select class="select" :value="currencyFrom" v-on:change="onCurrencyFromChange">
        <option
          v-for="option in currencies"
          v-bind:disabled="option.text === currencyTo"
          v-bind:key="option.text"
          v-bind:value="option.text">
          {{ option.text }}
        </option>
      </select>
      <span v-on:click="swapCurrencies" class="swap"></span>
      <select class="select" :value="currencyTo" v-on:change="onCurrencyToChange">
        <option
          v-for="option in currencies"
          v-bind:disabled="option.text === currencyFrom"
          v-bind:key="option.text"
          v-bind:value="option.text">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div class="content">
      {{result | precision(6)}} {{ currencyTo }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "converter",
  filters: {
    precision: function(value, signsAfterPoint) {
      if (!value) return "";
      const factor = Math.pow(10, signsAfterPoint);
      return Math.round(value * factor) / factor;
    }
  },
  created: function() {
    this.getExchangeRate({
      currencyTo: this.currencyFrom,
      currencyFrom: this.currencyTo
    });
  },
  data() {
    return {
      volume: 1
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
      currencies: state => {
        return state.currencies.allCurrencies;
      },
      exchangeRate: state => state.currencies.exchangeRate
    }),
    result: function() {
      if (!this.exchangeRate) return undefined;
      return this.exchangeRate * this.volume;
    }
  },
  methods: {
    ...mapActions(["getExchangeRate"]),
    swapCurrencies: function() {
      this.getExchangeRate({
        currencyFrom: this.currencyTo,
        currencyTo: this.currencyFrom
      });
    },
    onCurrencyFromChange: function(e) {
      this.getExchangeRate({
        currencyFrom: e.target.value,
        currencyTo: this.currencyTo
      });
    },
    onCurrencyToChange: function(e) {
      this.getExchangeRate({
        currencyFrom: this.currencyFrom,
        currencyTo: e.target.value
      });
    }
  }
};
</script>

<style scoped>
.selectors {
  margin: 0 auto 10px;
  max-width: 300px;
}
.select {
  vertical-align: top;
  min-width: 60px;
  height: 25px;
}
.swap {
  cursor: pointer;
  position: relative;
  top: -4px;
  line-height: 32px;
  display: inline-block;
  width: 32px;
  height: 32px;
  margin: 0 10px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJElEQVRYR+3U20nGQBCG4ecvQGxAOxBvFaxC9MIyBK884PkAP1iI6IVdiKhFiBWIDciCgRCT7GZJDEL2dmfme/ebmZ0Z+cxG1jcBTA4M6cAiPmNDPiTANlZx3AYxNMA9znHSBPEXAEG7ESIXYAPLkf6uYbcUc4bTak4uwAO2YgNWc/8L4t8CrGMp4kCI2eurBUk7XQEKaxi2IJza/oeLlBbc4BmPHXteADSKpwBcYx+bmQArdZNffkibA4V4iM8BWMBXzLUmgCsclJJv8Rop9o6nmGDKP3CJw66FcIedrnl1DlzgqGuhPgGCdhVijpcI1MfPtnRibxvCMkTOECaBxP6BAmI0gKIdbxn/QC8OFEWSdjpJsRIUa0FOzU45E8DkwOgOfAOH8S4h2pbkIQAAAABJRU5ErkJggg==);
}
.volume {
  vertical-align: top;
  box-sizing: border-box;
  padding: 3px;
  width: 90px;
  height: 25px;
}
.content {
  font-size: 25px;
}
</style>
