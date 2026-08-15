import React, { useState } from 'react';
import { Network, ArrowRight, Award, Compass, HelpCircle } from 'lucide-react';
import { SAT_TOPICS } from '../utils/MockData';

export default function KnowledgeGraph({ mastery, launchTopicPractice }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Hardcode coordinates for a clean, deterministic canvas graph
  const nodes = [
    // Math Stream (Top)
    {
      id: 'node_lin',
      topic: SAT_TOPICS.LINEAR_EQUATIONS,
      x: 100,
      y: 120,
      category: 'Math',
      description: 'First-degree equations, slope, graphing lines, and modeling rates.',
      prereqs: []
    },
    {
      id: 'node_sys',
      topic: SAT_TOPICS.SYSTEMS_EQUATIONS,
      x: 280,
      y: 80,
      category: 'Math',
      description: 'Solving systems with elimination or substitution, finding intersection points, and setting up multi-variable equations.',
      prereqs: [SAT_TOPICS.LINEAR_EQUATIONS]
    },
    {
      id: 'node_quad',
      topic: SAT_TOPICS.QUADRATICS,
      x: 280,
      y: 180,
      category: 'Math',
      description: 'Quadratic equations, parabolas, factoring, vertex form, and exponential growth modeling.',
      prereqs: [SAT_TOPICS.LINEAR_EQUATIONS]
    },
    {
      id: 'node_geom',
      topic: SAT_TOPICS.GEOMETRY,
      x: 480,
      y: 130,
      category: 'Math',
      description: 'Circle equations, arc lengths, sector areas, coordinate geometry, and trigonometry basics.',
      prereqs: [SAT_TOPICS.QUADRATICS]
    },

    // Reading & Writing Stream (Bottom)
    {
      id: 'node_grammar',
      topic: SAT_TOPICS.GRAMMAR_SYNTAX,
      x: 100,
      y: 320,
      category: 'Verbal',
      description: 'Punctuation rules, subject-verb agreement, modifier placement, and sentence boundaries.',
      prereqs: []
    },
    {
      id: 'node_words',
      topic: SAT_TOPICS.WORDS_IN_CONTEXT,
      x: 280,
      y: 320,
      category: 'Verbal',
      description: 'Vocabulary analysis, words with multiple meanings, selecting words to complete sentences contextually.',
      prereqs: [SAT_TOPICS.GRAMMAR_SYNTAX]
    },
    {
      id: 'node_evidence',
      topic: SAT_TOPICS.COMMAND_EVIDENCE,
      x: 480,
      y: 320,
      category: 'Verbal',
      description: 'Locating textual evidence, parsing graphs alongside reading passages, and evaluating hypotheses.',
      prereqs: [SAT_TOPICS.WORDS_IN_CONTEXT]
    }
  ];

  // Helper to get matching mastery data
  const getNodeMastery = (topic) => {
    return mastery.find(m => m.topic === topic) || { score: 0, status: 'Focus Area' };
  };

  const getStatusColor = (score) => {
    if (score > 75) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getStatusColorSubtle = (score) => {
    if (score > 75) return 'var(--success-subtle)';
    if (score >= 50) return 'var(--warning-subtle)';
    return 'var(--danger-subtle)';
  };

  // Pre-define connections to draw lines in SVG
  const connections = [
    { from: 'node_lin', to: 'node_sys' },
    { from: 'node_lin', to: 'node_quad' },
    { from: 'node_quad', to: 'node_geom' },
    { from: 'node_grammar', to: 'node_words' },
    { from: 'node_words', to: 'node_evidence' }
  ];

  const handleNodeClick = (node) => {
    const nodeMastery = getNodeMastery(node.topic);
    setSelectedNode({ ...node, ...nodeMastery });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '20px', height: '100%', overflow: 'hidden' }}>
      {/* SVG Canvas Map */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
        <div className="card-title">
          <Network size={18} className="text-accent" />
          Interactive Knowledge Graph
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Select any concept node to analyze dependencies, review mastery status, and launch specialized practice sets.
        </p>

        {/* Graph Canvas */}
        <div style={{ flex: 1, position: 'relative', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-app)', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <svg width="600" height="420" style={{ overflow: 'visible' }}>
            {/* Draw Connecting Lines */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="var(--border-color)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Draw Concept Nodes */}
            {nodes.map(node => {
              const nodeMastery = getNodeMastery(node.topic);
              const isSelected = selectedNode?.topic === node.topic;
              const color = getStatusColor(nodeMastery.score);
              const colorSubtle = getStatusColorSubtle(nodeMastery.score);

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Selected Highlight Ring */}
                  {isSelected && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    r="22"
                    fill={colorSubtle}
                    stroke={color}
                    strokeWidth="3"
                    style={{ transition: 'all 0.2s' }}
                  />

                  {/* Mastery Percentage Label inside node */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="var(--text-primary)"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    {nodeMastery.score}%
                  </text>

                  {/* Title Label below/above node */}
                  <text
                    textAnchor="middle"
                    y={node.category === 'Math' ? "-30" : "36"}
                    fill="var(--text-primary)"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    {node.topic.split(' ')[0]} {node.topic.split(' ')[1] || ''}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend Overlay */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '12px', backgroundColor: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.7rem', fontWeight: '500' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
              <span>Mastered (&gt;75%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
              <span>Developing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span>
              <span>Focus Area (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Detail Panel (Sidebar) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {selectedNode ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="scaffolding-indicator indicator-easy" style={{ fontSize: '0.65rem' }}>
                  {selectedNode.category}
                </span>
                <span 
                  className="scaffolding-indicator" 
                  style={{ 
                    fontSize: '0.65rem', 
                    backgroundColor: getStatusColorSubtle(selectedNode.score),
                    color: getStatusColor(selectedNode.score) 
                  }}
                >
                  {selectedNode.status}
                </span>
              </div>
              
              <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', fontWeight: '700' }}>{selectedNode.topic}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={16} className="text-accent" />
                <span style={{ fontSize: '0.85rem' }}>Mastery level: <strong>{selectedNode.score}%</strong></span>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                {selectedNode.description}
              </p>

              {selectedNode.prereqs.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px' }}>
                    Prerequisites
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedNode.prereqs.map((pr, idx) => (
                      <span key={idx} style={{ fontSize: '0.725rem', backgroundColor: 'var(--bg-app)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        {pr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => launchTopicPractice(selectedNode.topic)}
            >
              Practice This Concept
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', padding: '40px 20px', borderStyle: 'dashed' }}>
            <Compass size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '6px' }}>No Concept Selected</h4>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Click on any topic circle node in the interactive knowledge graph map to view curriculum details and diagnostic status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
