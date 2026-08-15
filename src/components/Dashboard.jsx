import React from 'react';
import { Target, Clock, Award, BookOpen, CheckSquare, ArrowRight, Activity } from 'lucide-react';
import { SAT_TOPICS } from '../utils/MockData';

export default function Dashboard({ studentProfile, mastery, planItems, togglePlanItem, setTab, launchTopicPractice }) {
  // Calculate projected score
  const mathTopics = mastery.filter(m => 
    m.topic === SAT_TOPICS.LINEAR_EQUATIONS || 
    m.topic === SAT_TOPICS.SYSTEMS_EQUATIONS || 
    m.topic === SAT_TOPICS.QUADRATICS || 
    m.topic === SAT_TOPICS.GEOMETRY
  );
  
  const verbalTopics = mastery.filter(m => 
    m.topic === SAT_TOPICS.WORDS_IN_CONTEXT || 
    m.topic === SAT_TOPICS.COMMAND_EVIDENCE || 
    m.topic === SAT_TOPICS.GRAMMAR_SYNTAX
  );

  const avgMathMastery = mathTopics.reduce((acc, curr) => acc + curr.score, 0) / mathTopics.length;
  const avgVerbalMastery = verbalTopics.reduce((acc, curr) => acc + curr.score, 0) / verbalTopics.length;

  const projectedMath = Math.round(200 + (avgMathMastery / 100) * 600);
  const projectedVerbal = Math.round(200 + (avgVerbalMastery / 100) * 600);
  const projectedTotal = projectedMath + projectedVerbal;

  // Find lowest mastery topic for recommended action
  const sortedMastery = [...mastery].sort((a, b) => a.score - b.score);
  const lowestTopic = sortedMastery[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Onboarding Welcome / Hero */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-accent-subtle) 100%)',
        borderColor: 'var(--accent)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '8px' }}>Welcome back, {studentProfile.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Your AceSAT Study Coach has analyzed your recent work. Your path is customized to target {lowestTopic?.topic}.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setTab('coach')}>
            Talk to Coach Ace
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-accent-subtle)', color: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
            <Target size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Target Score</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{studentProfile.targetScore}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '500' }}>Goal: 150+ point boost</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-accent-subtle)', color: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
            <Award size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Projected Score</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{projectedTotal} <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>/ 1600</span></h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Math: {projectedMath} | Verbal: {projectedVerbal}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-accent-subtle)', color: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
            <Clock size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Study Dedication</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{studentProfile.studyHours}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Target hours per week</p>
          </div>
        </div>
      </div>

      {/* Main split: Plan & Dynamic Recommendation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        {/* Weekly Study Plan */}
        <div className="card">
          <div className="card-title">
            <CheckSquare size={18} className="text-accent" />
            Weekly Study Plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {planItems.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: item.completed ? 'var(--bg-surface-hover)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => togglePlanItem(item.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ 
                    fontSize: '0.9rem',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontWeight: 500
                  }}>
                    {item.title}
                  </span>
                </div>
                <span className={`scaffolding-indicator ${
                  item.priority === 'High' ? 'indicator-hard' : item.priority === 'Medium' ? 'indicator-medium' : 'indicator-easy'
                }`} style={{ fontSize: '0.65rem' }}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Recommendations & Target Focus */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">
              <Activity size={18} className="text-accent" />
              Dynamic Recommendation
            </div>
            
            <div style={{ 
              backgroundColor: 'var(--warning-subtle)', 
              color: 'var(--warning)', 
              padding: '16px', 
              borderRadius: '12px',
              border: '1px solid hsla(38, 92%, 50%, 0.2)',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>Priority Target: {lowestTopic?.topic}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.9 }}>
                Your current mastery is only <strong>{lowestTopic?.score}%</strong>. The AI agent recommends launching a custom diagnostic practice set on this topic to isolate structural misunderstandings.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => launchTopicPractice(lowestTopic?.topic)}
          >
            Launch Practice: {lowestTopic?.topic}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
