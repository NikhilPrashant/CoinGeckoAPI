let data;

const fetchData = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
  data = await response.json();
  console.log("Data fetched:", data);
  return data;
};

const renderData = (data) => {
  const table = document.getElementById("table");
  table.innerHTML = "";

  for (const coin of data) {
    const priceChange = coin.price_change_percentage_24h.toFixed(2);
    const colorClass = priceChange >= 0 ? "positive" : "negative";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${coin.image}" alt=""></td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td style="text-align: right;">$${coin.current_price}</td>
      <td style="text-align: right;">$${addCommas(coin.total_volume)}</td>
      <td class="${colorClass}" style="text-align: right;">${priceChange}%</td>
      <td style="text-align: right;">${"Mkt Cap : $" + addCommas(coin.market_cap)}</td>
    `;
    table.appendChild(row);
  }
};

const searchData = (event) => {
  const searchTerm = event.target.value;
  const filteredData = data.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));
  console.log("Filtered data:", filteredData);
  renderData(filteredData);
};

const sortDataByMarketCap = () => {
  data.sort((a, b) => a.market_cap - b.market_cap);
  console.log("Data sorted by market cap:", data);
  renderData(data);
};

const sortDataByPercentageChange = () => {
  data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
  console.log("Data sorted by percentage change:", data);
  renderData(data);
};

fetchData().then(() => {
  renderData(data);
});

document.querySelector("#search").addEventListener("input", searchData);
document.querySelector("#market-cap").addEventListener("click", sortDataByMarketCap);
document.querySelector("#percentage-change").addEventListener("click", sortDataByPercentageChange);

function addCommas(n) {
  const parts = n.toString().split("");
  const result = parts.reduce((acc, part, i) => {
    if (i % 3 === 0 && i !== 0) {
      acc += ",";
    }
    acc += part;
    return acc;
  }, "");
  return result;
}
