import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Check, AlertCircle, ArrowRight, Award, BrainCircuit } from 'lucide-react';
import { MOCK_QUESTIONS, SAT_TOPICS } from '../utils/MockData';
import { generateQuestionFromAI } from '../utils/GeminiService';

export default function TutorWorkspace({ 
  apiKey, 
  mastery, 
  updateMastery, 
  addAgentLog,
  currentTopic,
  setCurrentTopic
}) {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(0); // 0 = no hints, 1, 2, 3 = hints shown
  const [isLoading, setIsLoading] = useState(false);
  const [customError, setCustomError] = useState('');
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  // Load a new question
  const loadQuestion = async (topic, forceDifficulty = null) => {
    setIsLoading(true);
    setCustomError('');
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentHintLevel(0);

    // Determine target difficulty based on student mastery level
    const topicMastery = mastery.find(m => m.topic === topic)?.score || 50;
    let targetDifficulty = 'Medium';
    if (topicMastery < 40) targetDifficulty = 'Easy';
    else if (topicMastery > 75) targetDifficulty = 'Hard';

    // If a difficulty is forced, use it
    const finalDifficulty = forceDifficulty || targetDifficulty;

    addAgentLog('thinking', `[Tutor Agent] Initiating question generation. Topic: "${topic}", Target Difficulty: "${finalDifficulty}" (Determined by mastery score: ${topicMastery}%)`);

    if (apiKey) {
      addAgentLog('thinking', `[Gemini API] Requesting dynamic SAT question on topic: "${topic}"...`);
      try {
        const aiQuestion = await generateQuestionFromAI(apiKey, topic, finalDifficulty);
        setQuestion(aiQuestion);
        addAgentLog('action', `[Tutor Agent] Live AI question generated successfully. ID: ${aiQuestion.id}`);
      } catch (error) {
        addAgentLog('diagnostic', `[Gemini API] Error: ${error.message}. Falling back to pre-seeded dataset.`);
        loadFallbackQuestion(topic, finalDifficulty);
      }
    } else {
      loadFallbackQuestion(topic, finalDifficulty);
    }
    setIsLoading(false);
  };

  const loadFallbackQuestion = (topic, difficulty) => {
    // Find a question in our dataset matching topic and difficulty
    let matches = MOCK_QUESTIONS.filter(q => q.topic === topic && q.difficulty === difficulty);
    
    // If no exact match, relax difficulty constraint
    if (matches.length === 0) {
      matches = MOCK_QUESTIONS.filter(q => q.topic === topic);
    }
    
    // If still no match, load any question
    if (matches.length === 0) {
      matches = MOCK_QUESTIONS;
    }

    const selectedQ = matches[Math.floor(Math.random() * matches.length)];
    
    // Create a copy to prevent mutation
    setQuestion({ ...selectedQ });
    addAgentLog('action', `[Tutor Agent] Question selected from local curriculum library. ID: ${selectedQ.id}`);
  };

  // Run on mount or when currentTopic changes
  useEffect(() => {
    if (currentTopic) {
      loadQuestion(currentTopic);
    } else {
      // Default to Linear Equations if none selected
      setCurrentTopic(SAT_TOPICS.LINEAR_EQUATIONS);
    }
  }, [currentTopic]);

  // Handle option select
  const handleSelectOption = (index) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  // Submit and verify
  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption === question.correctAnswer;
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Update Student Mastery Score
    const topicMastery = mastery.find(m => m.topic === question.topic);
    const currentScore = topicMastery?.score || 50;
    
    let scoreChange = 0;
    let nextDifficulty = question.difficulty;

    if (isCorrect) {
      // Answering correctly boosts score. Less increase if hints were used.
      const hintPenalty = currentHintLevel * 2;
      scoreChange = Math.max(2, 10 - hintPenalty);
      
      // Upgrade difficulty
      if (question.difficulty === 'Easy') nextDifficulty = 'Medium';
      else if (question.difficulty === 'Medium') nextDifficulty = 'Hard';

      addAgentLog('action', `[Diagnostic Engine] Question answered CORRECTLY! Topic: ${question.topic}. Score change: +${scoreChange}%. Level progression: ${question.difficulty} -> ${nextDifficulty}.`);
    } else {
      // Answering incorrectly reduces score
      scoreChange = -5;
      
      // Downgrade difficulty
      if (question.difficulty === 'Hard') nextDifficulty = 'Medium';
      else if (question.difficulty === 'Medium') nextDifficulty = 'Easy';

      addAgentLog('diagnostic', `[Diagnostic Engine] Question answered INCORRECTLY. Identifying gaps in ${question.topic}. Score change: ${scoreChange}%. Level adjustment: ${question.difficulty} -> ${nextDifficulty}. Triggering scaffolding support.`);
    }

    const newScore = Math.max(10, Math.min(100, currentScore + scoreChange));
    
    // Determine new status
    let newStatus = "Focus Area";
    if (newScore > 75) newStatus = "Mastered";
    else if (newScore >= 50) newStatus = "Developing";

    updateMastery(question.topic, newScore, newStatus);
  };

  // Request next level hint
  const triggerHint = () => {
    if (currentHintLevel >= 3) return;
    const nextLevel = currentHintLevel + 1;
    setCurrentHintLevel(nextLevel);
    addAgentLog('thinking', `[Scaffolding Engine] Student requested Hint Level ${nextLevel} for Question ${question.id}. Injecting guidance.`);
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'var(--success)';
    if (diff === 'Medium') return 'var(--warning)';
    return 'var(--danger)';
  };

  // Calculate next step forecast for Agent Console display
  const getAgentForecast = () => {
    if (!question) return '';
    const currentScore = mastery.find(m => m.topic === question.topic)?.score || 50;
    return {
      ifCorrect: {
        score: Math.min(100, currentScore + Math.max(2, 10 - currentHintLevel * 2)),
        diff: question.difficulty === 'Easy' ? 'Medium' : 'Hard'
      },
      ifIncorrect: {
        score: Math.max(10, currentScore - 5),
        diff: question.difficulty === 'Hard' ? 'Medium' : 'Easy'
      }
    };
  };

  const forecast = getAgentForecast();

  return (
    <div className="tutor-layout">
      {/* Active Question workspace */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Topic:</span>
            <select 
              value={currentTopic} 
              onChange={(e) => setCurrentTopic(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: '600', fontFamily: 'var(--font-sans)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
            >
              {Object.values(SAT_TOPICS).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Session: <strong style={{ color: 'var(--text-primary)' }}>{sessionStats.correct} / {sessionStats.total}</strong>
            </div>
            {question && (
              <span className={`scaffolding-indicator ${
                question.difficulty === 'Easy' ? 'indicator-easy' : question.difficulty === 'Medium' ? 'indicator-medium' : 'indicator-hard'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Question Panel Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', margin: 'auto', alignItems: 'center', gap: '12px' }}>
              <div className="status-dot" style={{ width: '16px', height: '16px' }}></div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>AceSAT is formulating adaptive question...</p>
            </div>
          ) : question ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Question Text */}
              <div className="question-text">{question.question}</div>

              {/* Multiple Choice Options */}
              <div style={{ marginBottom: '24px' }}>
                {question.options.map((opt, idx) => {
                  let btnClass = "option-btn";
                  if (selectedOption === idx) btnClass += " selected";
                  
                  if (isSubmitted) {
                    if (idx === question.correctAnswer) btnClass += " correct";
                    else if (selectedOption === idx) btnClass += " incorrect";
                  }

                  const letters = ["A", "B", "C", "D"];

                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                    >
                      <span className="option-letter">{letters[idx]}</span>
                      <span>{opt.substring(3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scaffolding Hints Section */}
              {currentHintLevel > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', backgroundColor: 'var(--bg-accent-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Scaffolding Hints
                  </h5>
                  {[...Array(currentHintLevel)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', borderLeft: '2px solid var(--accent)', paddingLeft: '10px', margin: '4px 0' }}>
                      <strong>Level {i + 1}:</strong>
                      <span>{question.scaffold[i]}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Feedback / Detailed Explanation */}
              {isSubmitted && (
                <div style={{ 
                  backgroundColor: selectedOption === question.correctAnswer ? 'var(--success-subtle)' : 'var(--danger-subtle)',
                  color: selectedOption === question.correctAnswer ? 'var(--success)' : 'var(--danger)',
                  padding: '20px', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px', fontSize: '1rem' }}>
                    {selectedOption === question.correctAnswer ? (
                      <><Check size={18} /> Correct Answer! Good thinking.</>
                    ) : (
                      <><AlertCircle size={18} /> Incorrect. Review the scaffolding steps below.</>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons footer */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={triggerHint}
                  disabled={isSubmitted || currentHintLevel >= 3}
                >
                  <HelpCircle size={16} />
                  {currentHintLevel === 0 ? "Ask for Scaffolding" : currentHintLevel < 3 ? "Show Next Hint Step" : "Hints Maxed"}
                </button>

                {!isSubmitted ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                  >
                    Verify Answer
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => loadQuestion(question.topic)}
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Failed to load question.</p>
          )}
        </div>
      </div>

      {/* Tutor Agent Decisions Panel (Sidebar info) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-title">
            <BrainCircuit size={18} className="text-accent" />
            Tutor Agent State
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
            Unlike standard assessments, the tutoring agent continuously makes diagnostic routing decisions based on your responses.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Topic:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{question?.topic}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Difficulty:</span>
              <strong style={{ color: getDifficultyColor(question?.difficulty) }}>{question?.difficulty}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Scaffold Level:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{currentHintLevel} / 3</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Topic Mastery:</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {mastery.find(m => m.topic === question?.topic)?.score || 50}%
              </strong>
            </div>
          </div>
        </div>

        {forecast && !isSubmitted && (
          <div className="card" style={{ 
            backgroundColor: 'var(--bg-accent-subtle)',
            borderStyle: 'dashed'
          }}>
            <div className="card-title" style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
              Agent Prediction Forecast
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
              The agent has mapped out the following educational transitions depending on your outcome:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.775rem' }}>
              <div style={{ borderLeft: '2.5px solid var(--success)', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>If Correct:</span>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Mastery increases to <strong>{forecast.ifCorrect.score}%</strong>. Difficulty escalates to <strong>{forecast.ifCorrect.diff}</strong>.
                </p>
              </div>

              <div style={{ borderLeft: '2.5px solid var(--danger)', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--danger)', fontWeight: '600' }}>If Incorrect:</span>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Mastery drops to <strong>{forecast.ifIncorrect.score}%</strong>. Difficulty descends to <strong>{forecast.ifIncorrect.diff}</strong> to reinforce fundamentals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
