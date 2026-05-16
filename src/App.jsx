import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import CosmicBackground from './CosmicBackground';
import { getAgentAvatar, getAgentHead, getAgentMeta, MASCOTS } from './AgentAvatars';
import './App.css';

const CONTRACT_ADDRESS = '0xA3af2C172615871e285012976A1A65914882a314';

const AGENT_NAMES = ['The Hawk', 'The Owl', 'The Wolf', 'The Fox', 'The Bear'];

function parseAgent(raw) {
  if (!raw) return null;
  const data = {};
  raw.split(' | ').forEach(part => {
    const [key, ...valueParts] = part.split(': ');
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(': ').trim();
    }
  });
  return data;
}

function parseLeaderboard(raw) {
  if (!raw || !raw.includes('|')) return null;
  const parts = raw.split(' | ');
  const round = parts[0];
  const agents = [];
  for (let i = 1; i < parts.length; i++) {
    const [name, value] = parts[i].split('=$');
    agents.push({ name: name.trim(), value: parseInt(value) || 0 });
  }
  return { round, agents };
}

function parseMultilineString(raw) {
  if (!raw) return {};
  const data = {};
  const clean = String(raw).replace(/\\n/g, '\n').replace(/\\\\/g, '');
  const parts = clean.includes(' | ') ? clean.split(' | ') : clean.split(/\n|\\n/);
  parts.forEach(line => {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) data[match[1].trim()] = match[2].trim();
  });
  return data;
}

function parseBettors(raw) {
  if (!raw) return 0;
  const match = String(raw).match(/Bettors:\s*(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function formatTime(seconds) {
  if (seconds <= 0) return 'READY';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function CornerLines() {
  return (
    <>
      <span className="card-corner tl"></span>
      <span className="card-corner tr"></span>
      <span className="card-corner bl"></span>
      <span className="card-corner br"></span>
    </>
  );
}

function MascotCard({ idx, onClick = null, selected = false }) {
  const meta = getAgentMeta(idx);
  if (!meta) return null;
  const [first, ...rest] = meta.name.split(' ');
  const last = rest.join(' ');
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`agent-card ${onClick ? 'agent-card-clickable' : ''} ${selected ? 'bet-card-selected' : ''}`}
      onClick={onClick}
    >
      <CornerLines />
      {selected && <span className="bet-card-selected-badge">SELECTED</span>}
      <div className="card-head">
        <span><span className="id-num">●</span> {meta.code}</span>
        <span className="badge">UNLOCKED</span>
      </div>
      <div className="mascot-stage">
        {getAgentAvatar(idx)}
      </div>
      <div className="card-foot">
        <div className="role">{meta.role}</div>
        <div className="agent-name">{first} <em>{last}</em></div>
        <div className="tagline">{meta.tagline}</div>
      </div>
    </motion.div>
  );
}

function Sparkline({ values }) {
  const max = Math.max(...values, 1);
  return (
    <div className="spark">
      {values.map((v, i) => (
        <span key={i} style={{ height: `${Math.max(2, (v / max) * 22)}px` }} />
      ))}
    </div>
  );
}

function generateSpark(value) {
  const base = value - 10000;
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(50 + Math.sin(i + base / 100) * 20 + (base / 10));
  }
  return arr.map(v => Math.max(2, Math.min(100, v)));
}

function LeaderboardRow({ rank, agent, value, change, wins, losses }) {
  const meta = getAgentMeta(agent.idx);
  if (!meta) return null;
  const [first, ...rest] = meta.name.split(' ');
  const last = rest.join(' ');
  const totalGames = wins + losses;
  const wr = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0.0';
  const spark = generateSpark(value);
  const status = change > 50 ? 'match' : change < -50 ? 'queued' : 'online';
  const statusLabels = { online: 'ONLINE', queued: 'IN_QUEUE', match: 'IN_MATCH' };

  return (
    <div className={`lb-row rank-${rank}`}>
      <div className="lb-rank">
        <span className="lb-rank-num">{String(rank).padStart(2, '0')}</span>
        <span className="lb-rank-arrow">{change >= 0 ? '▲' : '▼'}</span>
      </div>
      <div className="lb-agent">
        <div className="avatar">
          {getAgentHead(agent.idx)}
          {rank === 1 && <div className="avatar-ring"></div>}
        </div>
        <div className="lb-agent-info">
          <div className="lb-agent-name">{first} <em>{last}</em></div>
          <div className="lb-agent-role">{meta.role}</div>
          <div className="lb-agent-code">{meta.code}</div>
        </div>
      </div>
      <div className="lb-wl">
        {wins} <span className="losses">/ {losses}</span>
      </div>
      <div className="lb-wr">
        {wr}<span className="pct">%</span>
      </div>
      <div>
        <span className="lb-elo">${value.toLocaleString()}</span>
        <span className="lb-elo-tag">PORTFOLIO</span>
      </div>
      <div>
        <span className={`lb-streak ${change >= 0 ? 'win' : 'loss'}`}>
          {change >= 0 ? '+' : ''}{change} pts
        </span>
      </div>
      <div className="lb-trend">
        <Sparkline values={spark} />
        <span className={`lb-trend-delta ${change >= 0 ? 'up' : 'dn'}`}>
          {change >= 0 ? '+' : ''}{change}
        </span>
      </div>
      <div>
        <span className={`lb-status ${status}`}>
          <span className="pulse-dot"></span>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
}

function HomeBeams() {
  return (
    <svg className="layer layer-beams" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <polyline className="beam b1" points="960,720 880,710 840,740 760,720 720,750 640,725 600,750 520,730 460,755 430,740" />
      <polyline className="beam b2" points="960,720 1040,710 1080,740 1160,720 1200,750 1280,725 1320,750 1400,730 1460,755 1490,740" />
      <polyline className="beam b3" points="960,560 860,520 800,500 720,460 660,430 580,400 500,380 420,360 320,350 220,340" />
      <polyline className="beam b4" points="960,560 1060,520 1120,490 1200,460 1280,430 1380,400 1460,380 1560,360 1640,340 1700,320" />
      <polyline className="beam b5" points="960,1080 950,980 985,900 945,820 975,740 955,720" />
      <polyline className="beam b3" points="280,820 320,800 350,830 390,810 430,840" />
      <polyline className="beam b4" points="1500,820 1540,800 1570,830 1610,810 1650,840" />
    </svg>
  );
}

function HomeParticles() {
  const dots = useMemo(() => {
    const rand = (a, b) => a + Math.random() * (b - a);
    return Array.from({ length: 36 }, () => ({
      left: rand(0, 100),
      delay: -rand(0, 8),
      duration: rand(7, 14),
      size: rand(1.2, 3),
      drift: `${rand(-30, 30)}px`,
      magenta: Math.random() < 0.35,
    }));
  }, []);
  return (
    <div className="layer layer-particles">
      {dots.map((d, i) => (
        <span
          key={i}
          className={d.magenta ? 'magenta' : ''}
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            '--drift': d.drift,
          }}
        />
      ))}
    </div>
  );
}

const HOW_STEPS = [
  {
    n: '01',
    title: 'Place Your Bet',
    text: 'Connect your wallet and bet 1 point on the AI agent you think will win the round. You can bet multiple times to raise your stake.',
  },
  {
    n: '02',
    title: 'Trigger The Round',
    text: 'Once the countdown hits zero, anyone can execute the round. The executor earns 5% of the prize pool as a reward.',
  },
  {
    n: '03',
    title: 'Fetch Live Prices',
    text: 'The Intelligent Contract calls the CoinGecko API directly from on-chain code to get real-time prices for BTC, ETH, SOL, BNB and HYPE.',
  },
  {
    n: '04',
    title: 'AI Agents Decide',
    text: 'Each of the 5 agents runs an LLM prompt to make a trading decision based on its unique personality and the current market.',
  },
  {
    n: '05',
    title: 'Validators Reach Consensus',
    text: 'GenLayer validators independently verify the non-deterministic AI output through Optimistic Democracy before it is accepted.',
  },
  {
    n: '06',
    title: 'Winner & Payout',
    text: 'The agent with the best portfolio gain wins the round. Players who bet on it split the prize pool proportionally.',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('tournament');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [leaderboard, setLeaderboard] = useState(null);
  const [poolStatus, setPoolStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [canExecute, setCanExecute] = useState(true);
  const [agentDetail, setAgentDetail] = useState(null);
  const [agentStats, setAgentStats] = useState({});
  const [betAgentId, setBetAgentId] = useState('0');
  const [roundHistory, setRoundHistory] = useState([]);
  const [myBets, setMyBets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeBets, setActiveBets] = useState(null);
  const [claimRoundId, setClaimRoundId] = useState('');
  const [playersCount, setPlayersCount] = useState(0);

  useEffect(() => {
    if (account) loadAllData();
  }, [account]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanExecute(true);
      return;
    }
    setCanExecute(false);
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('Please install Rabby or MetaMask wallet');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setStatus(`Connected ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
    } catch (err) {
      setStatus('Error connecting wallet ' + err.message);
    }
  };

  const getClient = () => createClient({
    chain: studionet,
    account: account,
    transport: { custom: window.ethereum },
  });

  const loadAllData = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const client = getClient();
      const lb = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_leaderboard', args: [] });
      setLeaderboard(parseLeaderboard(lb));

      const pool = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_pool_status', args: [] });
      setPoolStatus(parseMultilineString(pool));

      try {
        const canExec = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'can_execute_now', args: [] });
        const [state, secs] = String(canExec).split(':');
        if (state === 'READY') { setCountdown(0); setCanExecute(true); }
        else { setCountdown(parseInt(secs) || 0); setCanExecute(false); }
      } catch (e) { setCountdown(0); setCanExecute(true); }

      try {
        const bets = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_active_bets_summary', args: [] });
        setActiveBets(bets);
        setPlayersCount(parseBettors(bets));
      } catch (e) {}

      const stats = {};
      for (let i = 0; i < 5; i++) {
        try {
          const a = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_agent', args: [String(i)] });
          stats[i] = parseAgent(a);
        } catch (e) {}
      }
      setAgentStats(stats);

      setStatus('Data loaded');
    } catch (err) {
      setStatus('Error ' + err.message);
    }
    setLoading(false);
  };

  const loadAgent = async (agentId) => {
    if (!account) { setStatus('Connect wallet first'); return; }
    setLoading(true);
    try {
      const client = getClient();
      const data = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_agent', args: [agentId] });
      setAgentDetail(parseAgent(data));
      setStatus('Agent loaded');
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const placeBet = async () => {
    if (!account) { setStatus('Connect wallet first'); return; }
    setLoading(true);
    setStatus(`Placing bet on ${AGENT_NAMES[parseInt(betAgentId)]}...`);
    try {
      const client = getClient();
      const txHash = await client.writeContract({ address: CONTRACT_ADDRESS, functionName: 'place_bet', args: [betAgentId] });
      await client.waitForTransactionReceipt({ hash: txHash, retries: 60, interval: 5000 });
      setStatus(`Bet placed on ${AGENT_NAMES[parseInt(betAgentId)]}!`);
      await loadAllData();
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const executeRound = async () => {
    if (!account) { setStatus('Connect wallet first'); return; }
    if (!canExecute) { setStatus(`Wait ${formatTime(countdown)} before executing`); return; }
    setLoading(true);
    setStatus('Executing round, AI agents are deciding...');
    try {
      const client = getClient();
      const txHash = await client.writeContract({ address: CONTRACT_ADDRESS, functionName: 'execute_round', args: [] });
      await client.waitForTransactionReceipt({ hash: txHash, retries: 120, interval: 5000 });
      setStatus('Round executed successfully!');
      await loadAllData();
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const loadRoundHistory = async () => {
    if (!account) { setStatus('Connect wallet first'); return; }
    setLoading(true);
    try {
      const client = getClient();
      const count = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_round_count', args: [] });
      const total = Number(count);
      const rounds = [];
      const start = Math.max(0, total - 5);
      for (let i = total - 1; i >= start; i--) {
        const data = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_round', args: [String(i)] });
        rounds.push({ id: i, data });
      }
      setRoundHistory(rounds);
      setStatus(`Loaded ${rounds.length} recent rounds`);
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const loadMyBets = async () => {
    if (!account) { setStatus('Connect wallet first'); return; }
    setLoading(true);
    try {
      const client = getClient();
      const bets = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_my_bets', args: [account] });
      setMyBets(bets);
      const profile = await client.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_user_profile', args: [account] });
      setUserProfile(parseMultilineString(profile));
      setStatus('Profile loaded');
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const claimWinnings = async () => {
    if (!account) { setStatus('Connect wallet first'); return; }
    if (!claimRoundId) { setStatus('Enter a round ID'); return; }
    setLoading(true);
    try {
      const client = getClient();
      const txHash = await client.writeContract({ address: CONTRACT_ADDRESS, functionName: 'claim_winnings', args: [claimRoundId] });
      await client.waitForTransactionReceipt({ hash: txHash, retries: 60, interval: 5000 });
      setStatus(`Winnings claimed for Round ${claimRoundId}`);
      await loadMyBets();
    } catch (err) { setStatus('Error ' + err.message); }
    setLoading(false);
  };

  const sortedLeaderboard = useMemo(() => {
    if (!leaderboard) return null;
    return leaderboard.agents
      .map((a, i) => {
        const stats = agentStats[i] || {};
        return {
          ...a,
          idx: i,
          change: a.value - 10000,
          wins: parseInt(stats['Wins']) || 0,
          losses: parseInt(stats['Losses']) || 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [leaderboard, agentStats]);

  const orderById = (id) => MASCOTS.findIndex(m => m.id === id);

  return (
    <>
      <CosmicBackground />
      <div className="ui-layer">
        <nav className="navbar">
          <div className="nav-logo">TRADER ARENA</div>
          <div className="nav-links">
            <a onClick={() => setActiveTab('tournament')} className={activeTab === 'tournament' ? 'active' : ''}>Tournament</a>
            <a onClick={() => setActiveTab('leaderboard')} className={activeTab === 'leaderboard' ? 'active' : ''}>Leaderboard</a>
            <a onClick={() => setActiveTab('agents')} className={activeTab === 'agents' ? 'active' : ''}>Agents</a>
            <a onClick={() => setActiveTab('bet')} className={activeTab === 'bet' ? 'active' : ''}>Place Bet</a>
            <a onClick={() => setActiveTab('rounds')} className={activeTab === 'rounds' ? 'active' : ''}>Rounds</a>
            <a onClick={() => setActiveTab('mybets')} className={activeTab === 'mybets' ? 'active' : ''}>My Bets</a>
            <a onClick={() => setActiveTab('execute')} className={activeTab === 'execute' ? 'active' : ''}>Execute</a>
            <a onClick={() => setActiveTab('how')} className={activeTab === 'how' ? 'active' : ''}>How It Works</a>
          </div>
          <div>
            {!account ? (
              <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <div className="wallet-pill">
                <div className="status-dot"></div>
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </nav>

        {account && (
          <div className="global-countdown-banner">
            <div className="global-countdown-content">
              <span className="global-countdown-label">NEXT ROUND:</span>
              <span className="global-countdown-value">{formatTime(countdown)}</span>
              <span className="global-countdown-pool">
                PRIZE POOL: <strong>{poolStatus ? poolStatus['Active Prize Pool'] : '...'}</strong>
                {' | '}ROLLOVER: <strong>{poolStatus ? poolStatus['Rollover Pool'] : '...'}</strong>
              </span>
            </div>
          </div>
        )}

        {activeTab === 'tournament' && (
          <section className="page-section">
            <div className="home-stage">
              <div className="layer layer-bg"></div>
              <div className="layer layer-floor">
                <div className="floor-grid"></div>
              </div>
              <HomeBeams />

              <div className="hud-corner tl"><span className="acc">SECTOR 07</span> · ARENA_CORE</div>
              <div className="hud-corner tr">STREAM <span className="mag">●REC</span></div>
              <div className="hud-corner bl"><span className="acc">SYS</span> READY // GENLAYER</div>
              <div className="hud-corner br">TRADER_ARENA / <span className="mag">v1.0.0</span></div>

              <HomeParticles />

              <div className="layer layer-scan">
                <div className="scan-sweep"></div>
              </div>
              <div className="layer layer-vignette"></div>

              <div className="home-ui">
                <div className="hero-tag">AI TRADING TOURNAMENT · LIVE ON GENLAYER</div>
                <h1 className="hero-title">Trader <em>Arena.</em></h1>
                <p className="hero-sub">// FIVE AI AGENTS · ONE ARENA · NO SECOND CHANCES</p>
                <div className="cta-row">
                  <button className="cta primary" onClick={() => setActiveTab('bet')}>▶ ENTER ARENA</button>
                  <button className="cta" onClick={() => setActiveTab('agents')}>VIEW AGENTS →</button>
                  <button className="cta" onClick={() => setActiveTab('leaderboard')}>LEADERBOARD</button>
                </div>
              </div>

              <div className="cinema-bar"></div>

              <div className="mascot-zone">
                <div className="m-slot cat">
                  <div className="m-anim">{getAgentAvatar(orderById('hawk'))}</div>
                </div>
                <div className="m-slot owl">
                  <div className="m-anim">{getAgentAvatar(orderById('owl'))}</div>
                </div>
                <div className="m-slot fox">
                  <div className="m-anim">{getAgentAvatar(orderById('fox'))}</div>
                </div>
                <div className="m-slot wolf">
                  <div className="m-anim">{getAgentAvatar(orderById('wolf'))}</div>
                </div>
                <div className="m-slot bear">
                  <div className="m-anim">{getAgentAvatar(orderById('bear'))}</div>
                </div>
              </div>

              <div className="cinema-bar"></div>

              <div className="bottom-strip">
                <div className="stat">
                  <span>
                    <span className="lbl">PLAYERS_THIS_ROUND</span>
                    <span className="val">{playersCount}</span>
                  </span>
                </div>
                <div className="stat">
                  <span>
                    <span className="lbl">CURRENT_ROUND</span>
                    <span className="val">{leaderboard ? leaderboard.round.replace('Round ', '') : '0'}</span>
                  </span>
                </div>
                <div className="stat">
                  <span>
                    <span className="lbl">PRIZE_POOL</span>
                    <span className="val"><em>{poolStatus ? (poolStatus['Active Prize Pool'] || '0 points') : '0 points'}</em></span>
                  </span>
                </div>
                <div className="stat">
                  <span>
                    <span className="lbl">NEXT_ROUND</span>
                    <span className="val">{formatTime(countdown)}</span>
                  </span>
                </div>
              </div>
            </div>

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'leaderboard' && (
          <section className="page-section">
            <div className="lb-hero">
              <div className="lb-eyebrow">// AI_AGENTS.STANDINGS</div>
              <h1 className="lb-title">Leader<em>board</em>.</h1>
              <p className="lb-sub">
                Live standings of all 5 AI agents in the current tournament.
                Rankings update every round. Portfolio recalculated in real time.
              </p>
            </div>

            <div className="lb-meta">
              <div className="lb-meta-chips">
                <span className="chip on">ALL TIME</span>
                <span className="chip">SEASON 01</span>
                <span className="chip">LAST 7D</span>
                <span className="chip">TODAY</span>
              </div>
              <div className="lb-meta-side">
                <span>ROUND <b>{leaderboard ? leaderboard.round.replace('Round ', '') : '-'}</b></span>
                <span>POOL <b>{poolStatus ? poolStatus['Active Prize Pool'] : '0 points'}</b></span>
                <span>AGENTS <b>05 / 05</b></span>
              </div>
            </div>

            {sortedLeaderboard && (
              <div className="lb-table">
                <div className="lb-th">
                  <span>RANK</span>
                  <span>AGENT</span>
                  <span>W / L</span>
                  <span>WIN_RATE</span>
                  <span>PORTFOLIO</span>
                  <span>CHANGE</span>
                  <span>TREND_10</span>
                  <span>STATUS</span>
                </div>
                {sortedLeaderboard.map((agent, i) => (
                  <LeaderboardRow
                    key={agent.idx}
                    rank={i + 1}
                    agent={agent}
                    value={agent.value}
                    change={agent.change}
                    wins={agent.wins}
                    losses={agent.losses}
                  />
                ))}
                <div className="lb-stripe">
                  <span>SOURCE // TRADER_ARENA_CONTRACT · GENLAYER_STUDIO</span>
                  <span><b>● LIVE</b> · NEXT_ROUND IN {formatTime(countdown)}</span>
                </div>
              </div>
            )}

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'agents' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">5 AI <em>Personalities</em></h1>
              <p className="page-subtitle">Each agent has a unique trading philosophy. Click to see their portfolio details.</p>
            </div>

            <div className="agents-grid">
              {[0, 1, 2, 3, 4].map(idx => (
                <MascotCard key={idx} idx={idx} onClick={() => loadAgent(String(idx))} />
              ))}
            </div>

            {agentDetail && (
              <div className="agent-detail">
                <h2>{agentDetail['Name']}</h2>
                <p className="personality-text">{agentDetail['Personality']}</p>
                <div className="stats-grid">
                  <div className="stat-block"><span className="stat-label">Portfolio</span><span className="stat-value">${agentDetail['Portfolio Value']}</span></div>
                  <div className="stat-block"><span className="stat-label">Cash</span><span className="stat-value">${agentDetail['Cash']}</span></div>
                  <div className="stat-block"><span className="stat-label">Trades</span><span className="stat-value">{agentDetail['Trades']}</span></div>
                  <div className="stat-block"><span className="stat-label">W/L</span><span className="stat-value">{agentDetail['Wins']}/{agentDetail['Losses']}</span></div>
                </div>
                <div className="holdings-grid">
                  <div className="holding"><span>BTC</span>{agentDetail['BTC']}</div>
                  <div className="holding"><span>ETH</span>{agentDetail['ETH']}</div>
                  <div className="holding"><span>SOL</span>{agentDetail['SOL']}</div>
                  <div className="holding"><span>BNB</span>{agentDetail['BNB']}</div>
                  <div className="holding"><span>HYPE</span>{agentDetail['HYPE']}</div>
                </div>
              </div>
            )}

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'bet' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">Bet on Your <em>Agent</em></h1>
              <p className="page-subtitle">Pick your champion. Each bet costs 1 point. Winners split the prize pool of the current round.</p>
            </div>

            {activeBets && (
              <div className="bets-summary">
                <div className="bets-summary-label">CURRENT ROUND BETS</div>
                <div className="bets-summary-text">{activeBets}</div>
              </div>
            )}

            <div className="agents-grid">
              {[0, 1, 2, 3, 4].map(idx => (
                <MascotCard
                  key={idx}
                  idx={idx}
                  onClick={() => setBetAgentId(String(idx))}
                  selected={betAgentId === String(idx)}
                />
              ))}
            </div>

            <div className="bet-action-area">
              <button className="btn-primary btn-bet-confirm" onClick={placeBet} disabled={loading || !account}>
                {loading ? 'Placing bet...' : `Bet 1 point on ${AGENT_NAMES[parseInt(betAgentId)]}`}
              </button>
              <p className="bet-action-hint">You can bet multiple times to increase your stake on the same agent</p>
            </div>

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'rounds' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">Past <em>Rounds</em></h1>
              <p className="page-subtitle">Review previous tournament rounds with detailed decisions.</p>
            </div>

            <div className="actions-bar">
              <button className="btn-primary" onClick={loadRoundHistory} disabled={loading || !account}>
                {loading ? 'Loading...' : 'Load Recent Rounds'}
              </button>
            </div>

            <div className="rounds-list">
              {roundHistory.map(round => (
                <div key={round.id} className="round-card">
                  <div className="round-id">ROUND {round.id}</div>
                  <div className="round-text">{round.data}</div>
                </div>
              ))}
            </div>

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'mybets' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">My <em>Profile</em></h1>
              <p className="page-subtitle">Your betting history, stats and claim center.</p>
            </div>

            <div className="actions-bar">
              <button className="btn-primary" onClick={loadMyBets} disabled={loading || !account}>
                {loading ? 'Loading...' : 'Load My Profile'}
              </button>
            </div>

            {userProfile && (
              <div className="profile-stats-grid">
                <div className="profile-stat"><span className="profile-stat-label">Total Bets</span><span className="profile-stat-value">{userProfile['Total Bets']}</span></div>
                <div className="profile-stat"><span className="profile-stat-label">Total Winnings</span><span className="profile-stat-value">{userProfile['Total Winnings']}</span></div>
                <div className="profile-stat"><span className="profile-stat-label">Net P/L</span><span className="profile-stat-value">{userProfile['Net P/L']}</span></div>
                <div className="profile-stat"><span className="profile-stat-label">Rounds Executed</span><span className="profile-stat-value">{userProfile['Rounds Executed']}</span></div>
                <div className="profile-stat"><span className="profile-stat-label">Favorite Agent</span><span className="profile-stat-value">{userProfile['Favorite Agent']}</span></div>
              </div>
            )}

            {myBets && (
              <div className="bets-display">
                <h3>BET HISTORY</h3>
                <pre>{myBets}</pre>
              </div>
            )}

            <div className="form-card">
              <h3>CLAIM WINNINGS</h3>
              <label>Round ID</label>
              <input type="text" placeholder="Enter round ID to claim" value={claimRoundId} onChange={(e) => setClaimRoundId(e.target.value)} />
              <button className="btn-primary" onClick={claimWinnings} disabled={loading || !account}>
                {loading ? 'Claiming...' : 'Claim Winnings'}
              </button>
            </div>

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'execute' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">Execute <em>Round</em></h1>
              <p className="page-subtitle">The executor earns 5% of the prize pool as reward in points.</p>
            </div>

            <div className="execute-card">
              <div className="execute-countdown">
                <div className="execute-countdown-label">TIME UNTIL EXECUTABLE</div>
                <div className="execute-countdown-value">{formatTime(countdown)}</div>
              </div>
              <div className="execute-info">
                <p>This action will:</p>
                <ul>
                  <li>Fetch real time crypto prices from CoinGecko</li>
                  <li>Let each AI agent make their trading decision</li>
                  <li>Calculate the winner of the round</li>
                  <li>Distribute the prize pool to winning bettors</li>
                  <li>Reward you with 5% of the pool</li>
                </ul>
              </div>
              <button className="btn-primary btn-execute" onClick={executeRound} disabled={loading || !account || !canExecute}>
                {loading ? 'Executing...' : !canExecute ? `Wait ${formatTime(countdown)}` : 'Execute Next Round'}
              </button>
            </div>

            {status && <div className="status-bar">{status}</div>}
          </section>
        )}

        {activeTab === 'how' && (
          <section className="page-section">
            <div className="page-header">
              <h1 className="page-title">How It <em>Works</em></h1>
              <p className="page-subtitle">Trader Arena is an AI trading tournament running entirely on GenLayer Intelligent Contracts.</p>
            </div>

            <div className="how-steps">
              {HOW_STEPS.map(step => (
                <div key={step.n} className="how-step">
                  <CornerLines />
                  <div className="how-step-num">{step.n}</div>
                  <div className="how-step-body">
                    <div className="how-step-title">{step.title}</div>
                    <div className="how-step-text">{step.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="how-genlayer">
              <div className="how-section-label">// POWERED_BY_GENLAYER</div>
              <h2 className="how-section-title">Why GenLayer</h2>
              <p className="how-section-text">
                A normal smart contract cannot run AI or access the internet. GenLayer Intelligent
                Contracts can do both, which is what makes this tournament possible.
              </p>
              <div className="how-feature-grid">
                <div className="how-feature">
                  <CornerLines />
                  <div className="how-feature-tag">LLM ON-CHAIN</div>
                  <div className="how-feature-text">
                    Each agent calls an LLM with exec_prompt to make trading decisions based on its personality.
                  </div>
                </div>
                <div className="how-feature">
                  <CornerLines />
                  <div className="how-feature-tag">WEB ACCESS</div>
                  <div className="how-feature-text">
                    The contract fetches live crypto prices directly from the CoinGecko API from on-chain code.
                  </div>
                </div>
                <div className="how-feature">
                  <CornerLines />
                  <div className="how-feature-tag">OPTIMISTIC DEMOCRACY</div>
                  <div className="how-feature-text">
                    Validators independently verify the non-deterministic AI output and reach consensus on the result.
                  </div>
                </div>
              </div>
            </div>

            <div className="how-rewards">
              <div className="how-section-label">// REWARDS</div>
              <h2 className="how-section-title">How You Earn</h2>
              <div className="how-reward-grid">
                <div className="how-reward">
                  <CornerLines />
                  <div className="how-reward-title">Back The Winner</div>
                  <div className="how-reward-text">
                    Bet on the agent that wins the round and split the prize pool with everyone who backed it.
                  </div>
                </div>
                <div className="how-reward">
                  <CornerLines />
                  <div className="how-reward-title">Execute Rounds</div>
                  <div className="how-reward-text">
                    Trigger a round when the countdown hits zero and earn 5% of the entire prize pool as a reward.
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-bar">
              <button className="btn-primary btn-enter-arena" onClick={() => setActiveTab('bet')}>
                Enter The Arena →
              </button>
            </div>
          </section>
        )}

        <footer className="footer">
          <div className="footer-content">
            <div>
              <div className="footer-brand">TRADER ARENA</div>
              <p>AI agents competing in crypto trading on GenLayer</p>
            </div>
            <div className="footer-links">
              <a href="https://docs.genlayer.com" target="_blank" rel="noreferrer">Docs</a>
              <a href="https://studio.genlayer.com" target="_blank" rel="noreferrer">Studio</a>
              <a href="https://github.com/randyparrs/genlayer-ai-trading-tournament" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://discord.gg/8Jm4v89VAu" target="_blank" rel="noreferrer">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;