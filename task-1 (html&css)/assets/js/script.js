let tradingViewWidget = null;
let chartReady = false;

// Symbol mapping for display names
const symbolDisplayNames = {
  "BINANCE:BTCUSDT": "Bitcoin/USDT",
  "BINANCE:ETHUSDT": "Ethereum/USDT",
  "BINANCE:ADAUSDT": "Cardano/USDT",
  "BINANCE:SOLUSDT": "Solana/USDT",
  "BINANCE:DOTUSDT": "Polkadot/USDT",
  "BINANCE:LINKUSDT": "Chainlink/USDT",
  "BINANCE:MATICUSDT": "Polygon/USDT",
};

// Declare TradingView variable
const TradingView = window.TradingView || {};

function initializeTradingViewChart() {
  // Check if TradingView library is loaded
  if (typeof TradingView === "undefined") {
    console.error("TradingView library not loaded");
    return null;
  }

  // Clear any existing chart
  const chartContainer = document.getElementById("chart");
  if (chartContainer) {
    chartContainer.innerHTML = "";
  }

  console.log("Initializing TradingView chart...");

  // Create the widget
  const widget = new TradingView.widget({
    width: "100%",
    height: 700,
    symbol: "BINANCE:BTCUSDT",
    interval: "15",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    container_id: "chart",
    enable_publishing: false,
    withdateranges: true,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    details: true,
    hotlist: true,
    calendar: true,
    studies: ["MASimple@tv-basicstudies", "RSI@tv-basicstudies"],
    overrides: {
      // Chart colors
      "paneProperties.background": "#20252B",
      "paneProperties.backgroundType": "solid",

      // Grid
      "paneProperties.vertGridProperties.color": "#1e2329",
      "paneProperties.horzGridProperties.color": "#1e2329",

      // Candles
      "mainSeriesProperties.candleStyle.upColor": "#00C076",
      "mainSeriesProperties.candleStyle.downColor": "#FF4747",
      "mainSeriesProperties.candleStyle.borderUpColor": "#00C076",
      "mainSeriesProperties.candleStyle.borderDownColor": "#FF4747",
      "mainSeriesProperties.candleStyle.wickUpColor": "#00C076",
      "mainSeriesProperties.candleStyle.wickDownColor": "#FF4747",

      // Volume
      "volume.volume.color.0": "#FF474780",
      "volume.volume.color.1": "#00C07680",

      // Scale
      "scalesProperties.backgroundColor": "#0d1421",
      "scalesProperties.lineColor": "#1e2329",
      "scalesProperties.textColor": "#A7B1BC",
    },

    custom_css_url: "../css/style.css",
  });

  // Set up chart ready callback
  widget.onChartReady(() => {
    console.log("TradingView chart loaded successfully");
    tradingViewWidget = widget;
    chartReady = true;

    // Initialize symbol selector after chart is ready
    initializeSymbolSelector();
  });

  return widget;
}

function initializeSymbolSelector() {
  const symbolSelect = document.getElementById("symbolSelect");

  if (!symbolSelect) {
    console.warn("Symbol selector not found");
    return;
  }

  // Remove existing event listeners to prevent duplicates
  const newSelect = symbolSelect.cloneNode(true);
  symbolSelect.parentNode.replaceChild(newSelect, symbolSelect);

  // Add event listener to the new element
  newSelect.addEventListener("change", handleSymbolChange);

  console.log("Symbol selector initialized");
}

function handleSymbolChange(event) {
  const selectedSymbol = event.target.value;
  console.log("Symbol change requested:", selectedSymbol);

  // Check if chart is ready
  if (!chartReady || !tradingViewWidget) {
    console.warn("Chart not ready or widget not available");
    return;
  }

  try {
    // The correct way to change symbol in TradingView widget
    // Use the chart() method to get chart instance, then setSymbol
    const chart = tradingViewWidget.chart();

    if (chart && typeof chart.setSymbol === "function") {
      console.log("Changing symbol using chart.setSymbol()");

      chart.setSymbol(selectedSymbol, () => {
        console.log(`Successfully changed symbol to: ${selectedSymbol}`);
        updateDisplayInfo(selectedSymbol);
      });
    } else {
      console.log("chart.setSymbol not available, trying alternative method");
      // Alternative method: recreate the widget
      recreateChartWithSymbol(selectedSymbol);
    }
  } catch (error) {
    console.error("Error changing symbol:", error);
    // Fallback: recreate the widget
    recreateChartWithSymbol(selectedSymbol);
  }
}

function recreateChartWithSymbol(symbol) {
  console.log(`Recreating chart with symbol: ${symbol}`);

  try {
    // Reset state
    chartReady = false;
    tradingViewWidget = null;

    // Clear container
    const chartContainer = document.getElementById("chart");
    if (chartContainer) {
      chartContainer.innerHTML = "";
    }

    // Small delay to ensure cleanup
    setTimeout(() => {
      // Create new widget with selected symbol
      const widget = new TradingView.widget({
        width: "100%",
        height: 700,
        symbol: symbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        container_id: "chart",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        studies: ["MASimple@tv-basicstudies", "RSI@tv-basicstudies"],
        loading_screen: {
          backgroundColor: "#20252B",
          foregroundColor: "#A7B1BC",
        },
        auto_save_delay: 5,
      });

      widget.onChartReady(() => {
        console.log(`Chart recreated successfully with symbol: ${symbol}`);
        tradingViewWidget = widget;
        chartReady = true;
        updateDisplayInfo(symbol);
      });
    }, 100);
  } catch (error) {
    console.error("Error recreating chart:", error);
  }
}

function updateDisplayInfo(symbol) {
  // Update any display elements that show the current symbol
  const displayName = symbolDisplayNames[symbol] || symbol;
  console.log(`Updated display for: ${displayName}`);

  // You can add code here to update price displays, etc.
  // For example, update the price display in the top info section
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing chart...");

  // Small delay to ensure TradingView library is fully loaded
  setTimeout(() => {
    initializeTradingViewChart();
  }, 500);
});

// Handle window resize
window.addEventListener("resize", () => {
  if (tradingViewWidget && chartReady) {
    console.log("Window resized - chart will auto-adjust");
  }
});

// Debug function for troubleshooting
window.debugChart = () => {
  console.log("=== Chart Debug Info ===");
  console.log("Chart ready:", chartReady);
  console.log("Widget available:", !!tradingViewWidget);

  if (tradingViewWidget) {
    try {
      const chart = tradingViewWidget.chart();
      console.log("Chart instance available:", !!chart);

      if (chart) {
        console.log(
          "Chart methods:",
          Object.getOwnPropertyNames(Object.getPrototypeOf(chart))
        );
      }
    } catch (e) {
      console.log("Error accessing chart:", e.message);
    }
  }

  const symbolSelect = document.getElementById("symbolSelect");
  console.log("Symbol selector found:", !!symbolSelect);
  if (symbolSelect) {
    console.log("Current selected value:", symbolSelect.value);
  }
};

// Export functions for external access
window.initializeTradingViewChart = initializeTradingViewChart;
window.handleSymbolChange = handleSymbolChange;
window.recreateChartWithSymbol = recreateChartWithSymbol;
