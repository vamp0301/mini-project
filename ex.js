const ctx = document.getElementById('liveStockChart').getContext('2d');

const data = {
    labels: [], // Time labels
    datasets: [{
        label: 'Stock Price',
        data: [], // Price data
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
};

const liveStockChart = new Chart(ctx, config);

// Function to fetch stock data
async function fetchStockData() {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=STOCK_SYMBOL&interval=1min&apikey=YOUR_API_KEY`);
    const result = await response.json();
    const timeSeries = result['Time Series (1min)'];

    const times = Object.keys(timeSeries);
    const prices = times.map(time => parseFloat(timeSeries[time]['1. open']));

    // Update chart data
    if (data.labels.length >= 10) { // Keep the last 10 points
        data.labels.shift();
        data.datasets[0].data.shift();
    }
    
    data.labels.push(times[0]); // Use the latest time
    data.datasets[0].data.push(prices[0]); // Use the latest price
    
    liveStockChart.update();
}

// Fetch stock data every minute
setInterval(fetchStockData, 60000);
fetchStockData(); // Initial fetch
