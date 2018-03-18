import fetch from 'isomorphic-fetch';

const apiHost = `https://min-api.cryptocompare.com`;

export function getConversionRate(from, to) {
  // todo handle API Error ("Response" field in JSON)
  return fetch(`${apiHost}/data/price?fsym=${from}&tsyms=${to}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.Response === "Error") {
        return Promise.reject(new Error(`API Error: ${data.Message}`));
      }
      return data && data[to];
    })
    .catch(err => console.log(err));
}

export function getRateHistoryByDays(from, to, limit = 7) {
  return fetch(
    `${apiHost}/data/histoday?fsym=${from}&tsym=${to}&limit=${limit}`
  )
    .then(res => {
      return res.json();
    })
    .then(result => {
      if (result.Response === "Error") {
        return Promise.reject(new Error(`API Error: ${result.Message}`));
      }
      return result && result.Data.map(item => item.close);
    })
    .catch(err => console.error(err));
}
