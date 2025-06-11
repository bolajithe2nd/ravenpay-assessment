let tradingViewWidget = null;
let chartReady = false;

const symbolDisplayNames = {
  "BINANCE:BTCUSDT": "Bitcoin/USDT",
  "BINANCE:ETHUSDT": "Ethereum/USDT",
  "BINANCE:ADAUSDT": "Cardano/USDT",
  "BINANCE:SOLUSDT": "Solana/USDT",
  "BINANCE:DOTUSDT": "Polkadot/USDT",
  "BINANCE:LINKUSDT": "Chainlink/USDT",
  "BINANCE:MATICUSDT": "Polygon/USDT",
};

const TradingView = window.TradingView || {};

function initializeTradingViewChart() {
  if (typeof TradingView === "undefined") {
    console.error("TradingView library not loaded");
    return null;
  }

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

  widget.onChartReady(() => {
    console.log("TradingView chart loaded successfully");
    tradingViewWidget = widget;
    chartReady = true;

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

  const newSelect = symbolSelect.cloneNode(true);
  symbolSelect.parentNode.replaceChild(newSelect, symbolSelect);

  newSelect.addEventListener("change", handleSymbolChange);

  console.log("Symbol selector initialized");
}

function handleSymbolChange(event) {
  const selectedSymbol = event.target.value;
  console.log("Symbol change requested:", selectedSymbol);

  if (!chartReady || !tradingViewWidget) {
    console.warn("Chart not ready or widget not available");
    return;
  }

  try {
    const chart = tradingViewWidget.chart();

    if (chart && typeof chart.setSymbol === "function") {
      console.log("Changing symbol using chart.setSymbol()");

      chart.setSymbol(selectedSymbol, () => {
        console.log(`Successfully changed symbol to: ${selectedSymbol}`);
        updateDisplayInfo(selectedSymbol);
      });
    } else {
      console.log("chart.setSymbol not available, trying alternative method");
      recreateChartWithSymbol(selectedSymbol);
    }
  } catch (error) {
    console.error("Error changing symbol:", error);
    recreateChartWithSymbol(selectedSymbol);
  }
}

function recreateChartWithSymbol(symbol) {
  console.log(`Recreating chart with symbol: ${symbol}`);

  try {
    chartReady = false;
    tradingViewWidget = null;

    const chartContainer = document.getElementById("chart");
    if (chartContainer) {
      chartContainer.innerHTML = "";
    }

    setTimeout(() => {
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
  const displayName = symbolDisplayNames[symbol] || symbol;
  console.log(`Updated display for: ${displayName}`);
}

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(
    ".main__content-item1-tab-toggle button"
  );
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(tabId) {
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    tabButtons.forEach((button) => {
      button.classList.remove("active");
    });

    const selectedTab = document.getElementById(tabId);
    const selectedButton = document.querySelectorAll(`[data-tab="${tabId}"]`);

    if (selectedTab && selectedButton) {
      selectedTab.classList.add("active");
      selectedButton.forEach((button) => button.classList.add("active"));
    }
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const mobileTabs = document.querySelectorAll(".chart-tabs-mobile button");
//   const chartTab = document.getElementById("chart");
//   const ordersTab = document.querySelector(".orders-tab");

//   function switchMobileTab(tabId) {
//     mobileTabs.forEach((tab) => tab.classList.remove("active"));

//     if (tabId === "chart") {
//       chartTab.style.display = "block";
//       ordersTab.style.display = "none";
//       document.querySelector('[data-tab="chart"]').classList.add("active");
//     } else {
//       chartTab.style.display = "none";
//       ordersTab.style.display = "block";
//       document.querySelector('[data-tab="trades"]').classList.add("active");
//     }
//   }

//   mobileTabs.forEach((tab) => {
//     tab.addEventListener("click", () => {
//       const tabId = tab.getAttribute("data-tab");
//       switchMobileTab(tabId);
//     });
//   });

//   // Handle resize events to reset layout
//   window.addEventListener("resize", () => {
//     if (window.innerWidth > 1024) {
//       chartTab.style.display = "block";
//       ordersTab.style.display = "block";
//     } else {
//       // Return to default mobile tab
//       switchMobileTab("chart");
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing chart...");

  setTimeout(() => {
    initializeTradingViewChart();
  }, 500);
});

window.addEventListener("resize", () => {
  if (tradingViewWidget && chartReady) {
    console.log("Window resized - chart will auto-adjust");
  }
});

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

window.initializeTradingViewChart = initializeTradingViewChart;
window.handleSymbolChange = handleSymbolChange;
window.recreateChartWithSymbol = recreateChartWithSymbol;

// Mobile Menu
const menuButton = document.querySelector(".header__menu-icon");
const mobileMenu = document.querySelector(".mobile__menu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("show-menu");
  document.body.style.overflow = mobileMenu.classList.contains("show-menu")
    ? "hidden"
    : "";
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("show-menu");
    document.body.style.overflow = "";
  }
});
