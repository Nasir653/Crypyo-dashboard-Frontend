import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeRow, setActiveRow] = useState(null);
  const [historyMsg, setHistoryMsg] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const chartRef = React.useRef(null);

  const fetchHistory = async (coinId) => {
    setHistoryData([]);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/history/${coinId}`);
      setHistoryData(data);
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setHistoryData([]);
    }
  };

  const fetchCoins = async () => {
    const { data } = await axios.get('http://localhost:5000/api/coins');
    setCoins(data);
  };

  const saveHistory = async () => {
    setHistoryMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/history');
      setHistoryMsg(res.data.message || 'Snapshot saved!');
    } catch (err) {
      setHistoryMsg('Failed to save snapshot');
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30 * 60 * 1000); // 30 min
    return () => clearInterval(interval);
  }, []);

  const filtered = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    } else {
      return a[sortKey] < b[sortKey] ? 1 : -1;
    }
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Top 10 Cryptocurrencies</h1>
        <button onClick={saveHistory} style={{marginBottom: 16, padding: '8px 18px', borderRadius: 6, background: '#232526', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Save Snapshot</button>
        {historyMsg && <div style={{marginBottom: 12, color: historyMsg.includes('Failed') ? 'red' : 'green'}}>{historyMsg}</div>}
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search"
        />
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={sortKey === 'name' ? 'active' : ''}>
                Name
                {sortKey === 'name' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('symbol')} className={sortKey === 'symbol' ? 'active' : ''}>
                Symbol
                {sortKey === 'symbol' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('price')} className={sortKey === 'price' ? 'active' : ''}>
                Price (USD)
                {sortKey === 'price' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('marketCap')} className={sortKey === 'marketCap' ? 'active' : ''}>
                Market Cap
                {sortKey === 'marketCap' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('change24h')} className={sortKey === 'change24h' ? 'active' : ''}>
                24h % Change
                {sortKey === 'change24h' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('lastUpdated')} className={sortKey === 'lastUpdated' ? 'active' : ''}>
                Last Updated
                {sortKey === 'lastUpdated' && (
                  <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th>Chart</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin, idx) => (
              <tr
                key={coin.coinId}
                className={activeRow === idx ? 'active-row' : ''}
                onMouseDown={() => setActiveRow(idx)}
                onMouseUp={() => setActiveRow(null)}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <td>{coin.name}</td>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>${coin.price.toLocaleString()}</td>
                <td>${coin.marketCap.toLocaleString()}</td>
                <td className={coin.change24h > 0 ? 'green' : 'red'}>
                  {coin.change24h?.toFixed(2)}%
                </td>
                <td>{new Date(coin.lastUpdated).toLocaleString()}</td>
                <td>
                  <button onClick={() => { setSelectedCoin(coin); fetchHistory(coin.coinId); }} style={{padding: '4px 10px', borderRadius: 4, background: '#414345', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer'}}>Show Chart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedCoin && historyData.length > 0 && (
          <div ref={chartRef} style={{marginTop: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24}}>
            <h2 style={{marginBottom: 16}}>{selectedCoin.name} Price History</h2>
            <Line
              data={{
                labels: historyData.map(h => new Date(h.createdAt).toLocaleString()),
                datasets: [
                  {
                    label: `${selectedCoin.name} Price (USD)` ,
                    data: historyData.map(h => h.price),
                    fill: false,
                    borderColor: '#232526',
                    backgroundColor: '#232526',
                    tension: 0.2,
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true },
                  tooltip: { enabled: true }
                },
                scales: {
                  x: { display: true, title: { display: true, text: 'Time' } },
                  y: { display: true, title: { display: true, text: 'Price (USD)' } }
                }
              }}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
