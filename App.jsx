
import { useState } from "react";
import "./App.css";

const initialStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 1450, change: 2.4 },
  { symbol: "TCS", name: "Tata Consultancy", price: 3200, change: 1.8 },
  { symbol: "INFY", name: "Infosys", price: 1750, change: -0.8 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1680, change: 1.2 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 780, change: -1.4 },
  { symbol: "ITC", name: "ITC Limited", price: 430, change: 0.9 },
];

function App() {
  const [stocks] = useState(initialStocks);
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState({});
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const holdings = Object.entries(portfolio);
  const invested = holdings.reduce(
    (sum, [symbol, quantity]) =>
      sum + stocks.find(s => s.symbol === symbol).price * quantity,
    0
  );

  const buyStock = (stock) => {
    if (balance < stock.price) {
      setMessage("Insufficient virtual balance!");
      return;
    }

    setBalance(balance - stock.price);
    setPortfolio(prev => ({
      ...prev,
      [stock.symbol]: (prev[stock.symbol] || 0) + 1
    }));
    setMessage(`Successfully bought 1 ${stock.symbol}`);
  };

  const sellStock = (stock) => {
    if (!portfolio[stock.symbol]) {
      setMessage("You don't own this stock!");
      return;
    }

    setBalance(balance + stock.price);
    setPortfolio(prev => {
      const updated = { ...prev };
      updated[stock.symbol]--;

      if (updated[stock.symbol] === 0) {
        delete updated[stock.symbol];
      }

      return updated;
    });
    setMessage(`Successfully sold 1 ${stock.symbol}`);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(search.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const menu = ["Dashboard", "Stocks", "Portfolio", "Leaderboard", "Learn"];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>📈 TradeX</h2>
        <p className="subtitle">Virtual Trading Platform</p>

        {menu.map(item => (
          <button
            key={item}
            className={activeTab === item ? "nav active" : "nav"}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <p>Practice Trading</p>
          <small>Learn without financial risk.</small>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>{activeTab}</h1>
            <p>Welcome to your virtual trading dashboard!</p>
          </div>
          <div className="profile">👤 Trader</div>
        </header>

        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <p>Virtual Balance</p>
            <h2>₹{balance.toLocaleString("en-IN")}</h2>
          </div>

          <div className="stat-card">
            <p>Portfolio Value</p>
            <h2>₹{invested.toLocaleString("en-IN")}</h2>
          </div>

          <div className="stat-card">
            <p>Total Assets</p>
            <h2>₹{(balance + invested).toLocaleString("en-IN")}</h2>
          </div>

          <div className="stat-card">
            <p>Stocks Owned</p>
            <h2>{holdings.reduce((sum, [, qty]) => sum + qty, 0)}</h2>
          </div>
        </section>

        {activeTab === "Dashboard" && (
          <>
            <section className="content-card">
              <h2>Market Overview</h2>
              <p className="muted">Sample stock prices for practice trading</p>
              <StockChart />
            </section>
            <StockTable stocks={stocks.slice(0, 4)} buyStock={buyStock}
              sellStock={sellStock} portfolio={portfolio} />
          </>
        )}

        {activeTab === "Stocks" && (
          <section className="content-card">
            <h2>Explore Stocks</h2>
            <input
              className="search"
              placeholder="Search stocks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <StockTable stocks={filteredStocks} buyStock={buyStock}
              sellStock={sellStock} portfolio={portfolio} />
          </section>
        )}

        {activeTab === "Portfolio" && (
          <section className="content-card">
            <h2>My Holdings</h2>
            {holdings.length === 0 ? (
              <p className="muted">No stocks purchased yet. Visit Stocks to start trading.</p>
            ) : (
              holdings.map(([symbol, quantity]) => {
                const stock = stocks.find(s => s.symbol === symbol);
                return (
                  <div className="holding" key={symbol}>
                    <div>
                      <strong>{stock.name}</strong>
                      <p>{symbol} · {quantity} shares</p>
                    </div>
                    <strong>₹{(stock.price * quantity).toLocaleString("en-IN")}</strong>
                    <button onClick={() => sellStock(stock)}>Sell 1</button>
                  </div>
                );
              })
            )}
          </section>
        )}

        {activeTab === "Leaderboard" && (
          <section className="content-card">
            <h2>Trading Leaderboard</h2>
            {["Alex", "Rahul", "Priya", "You", "Sam"].map((name, i) => (
              <div className="holding" key={name}>
                <strong>#{i + 1} {name}</strong>
                <span>{name === "You" ? "₹" + (balance + invested).toLocaleString("en-IN") : "Practice account"}</span>
              </div>
            ))}
          </section>
        )}

        {activeTab === "Learn" && (
          <section className="content-card">
            <h2>Stock Market Learning Center</h2>
            {[
              ["What is a Stock?", "A stock represents a small ownership share in a company."],
              ["What is a Portfolio?", "A portfolio is a collection of investments owned by an investor."],
              ["What is a Bull Market?", "A bull market is a period when market prices generally rise."],
              ["What is a Bear Market?", "A bear market is a period when market prices generally fall."],
              ["What is Diversification?", "Diversification means spreading investments across different assets."]
            ].map(([title, description]) => (
              <div className="lesson" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </section>
        )}

        <footer>TradeX © 2026 | Educational Virtual Trading Platform</footer>
      </main>
    </div>
  );
}

function StockTable({ stocks, buyStock, sellStock, portfolio }) {
  return (
    <section className="content-card">
      <h2>Stock Market</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Price</th>
              <th>Change</th>
              <th>Owned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.symbol}>
                <td>
                  <strong>{stock.symbol}</strong>
                  <small>{stock.name}</small>
                </td>
                <td>₹{stock.price.toLocaleString("en-IN")}</td>
                <td className={stock.change >= 0 ? "green" : "red"}>
                  {stock.change > 0 ? "+" : ""}{stock.change}%
                </td>
                <td>{portfolio[stock.symbol] || 0}</td>
                <td className="actions">
                  <button onClick={() => buyStock(stock)}>Buy</button>
                  <button className="sell" onClick={() => sellStock(stock)}>Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StockChart() {
  const values = [30, 45, 38, 65, 52, 75, 68, 90, 80, 110];
  const points = values.map((v, i) => `${i * 55},${130 - v}`).join(" ");

  return (
    <div className="chart">
      <div className="chart-label">Sample market movement</div>
      <svg viewBox="0 0 495 140" preserveAspectRatio="none">
        {[30, 65, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="495" y2={y} stroke="#e5e7eb" />
        ))}
        <polyline points={points} fill="none" stroke="#16a34a"
          strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="chart-label">Illustrative data · Not live market prices</div>
    </div>
  );
}

export default App;
