import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, ShieldAlert } from 'lucide-react';

export default function AgentConsole({ logs, clearLogs }) {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogTypeClass = (type) => {
    if (type === 'diagnostic') return 'diagnostic';
    if (type === 'action') return 'action';
    return 'thinking';
  };

  return (
    <div className="console-panel" style={{ height: '100%' }}>
      {/* Console Header */}
      <div className="console-header">
        <div className="console-title">
          <Terminal size={16} />
          AGENT DECISION CONSOLE
        </div>
        <button 
          onClick={clearLogs}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-tertiary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem' 
          }}
          title="Clear Logs"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Console Logging Area */}
      <div className="console-logs">
        {logs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px', fontFamily: 'var(--font-sans)' }}>
            <ShieldAlert size={24} style={{ marginBottom: '8px', opacity: 0.6 }} />
            <span style={{ fontSize: '0.75rem' }}>No telemetry logs. Start interacting with Coach Ace or practice questions to watch the agent think.</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`console-log-entry ${getLogTypeClass(log.type)}`}>
              <span className="console-log-timestamp">[{log.timestamp}]</span>
              <span>{log.text}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Small Agent Status Dashboard */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Agent Core State:</span>
          <span style={{ color: 'var(--success)', fontWeight: '600' }}>MONITORING</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Telemetry Stream:</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>ACTIVE (WS_LOCAL)</span>
        </div>
      </div>
    </div>
  );
}
