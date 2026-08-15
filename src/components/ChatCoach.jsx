import React, { useState, useRef, useEffect } from 'react';
import { Send, Key, Sparkles, CheckCircle, Info } from 'lucide-react';
import { ONBOARDING_DIALOGUE, INITIAL_PLAN_ITEMS } from '../utils/MockData';
import { getAICoachResponse } from '../utils/GeminiService';

export default function ChatCoach({ 
  studentProfile, 
  updateProfile, 
  messages, 
  addMessage, 
  apiKey, 
  setApiKey, 
  addAgentLog 
}) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle suggestion pills click
  const handleSuggestionClick = async (suggestionText) => {
    await handleSend(suggestionText);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Clear input
    setInputValue('');

    // Add student message
    const studentMsg = { sender: 'student', text, timestamp: new Date().toLocaleTimeString() };
    addMessage(studentMsg);
    
    addAgentLog('thinking', `[Coach Agent] Received student message: "${text}"`);

    // Check if we are in onboarding mode
    if (!studentProfile.onboardingComplete) {
      setIsLoading(true);
      setTimeout(() => {
        const nextStep = studentProfile.onboardingStep + 1;
        const updatedProfile = { ...studentProfile };

        // Save variables depending on the step
        if (studentProfile.onboardingStep === 0) {
          updatedProfile.targetScore = text;
        } else if (studentProfile.onboardingStep === 1) {
          updatedProfile.studyHours = text;
        } else if (studentProfile.onboardingStep === 2) {
          updatedProfile.focusArea = text;
          updatedProfile.onboardingComplete = true;
          addAgentLog('action', `[Coach Agent] Onboarding completed! Profile variables: Target Score=${updatedProfile.targetScore}, Study Hours=${updatedProfile.studyHours}, Focus=${updatedProfile.focusArea}`);
        }

        updatedProfile.onboardingStep = nextStep;
        updateProfile(updatedProfile);

        // Add Coach response
        if (nextStep < ONBOARDING_DIALOGUE.length) {
          const nextPrompt = ONBOARDING_DIALOGUE[nextStep];
          addMessage({
            sender: 'coach',
            text: nextPrompt.text,
            timestamp: new Date().toLocaleTimeString(),
            suggestions: nextPrompt.suggestions
          });
        }
        setIsLoading(false);
      }, 800);
      return;
    }

    // Standard conversational mode
    setIsLoading(true);
    
    // Check if API key is present
    if (apiKey) {
      addAgentLog('thinking', `[Gemini API] Requesting response for message history: ${messages.length + 1} messages`);
      try {
        const aiResponse = await getAICoachResponse(apiKey, [...messages, studentMsg], studentProfile);
        addMessage({
          sender: 'coach',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString()
        });
        addAgentLog('action', '[Coach Agent] Response received successfully from Gemini API.');
      } catch (error) {
        addAgentLog('diagnostic', `[Gemini API] Error: ${error.message}. Falling back to simulation.`);
        triggerFallbackResponse(text);
      }
    } else {
      triggerFallbackResponse(text);
    }
  };

  const triggerFallbackResponse = (studentText) => {
    addAgentLog('thinking', '[Coach Agent] Running response generation heuristic in simulated mode...');
    setTimeout(() => {
      let coachReply = "";
      const lowerText = studentText.toLowerCase();

      if (lowerText.includes('tip') || lowerText.includes('strategy') || lowerText.includes('help')) {
        coachReply = "Here is a quick SAT tip: For Reading, always check if the option is directly supported by the text. If any word in an option is unsupported or too extreme, it's incorrect. For Math, completing the square is essential for circle equations. Would you like to practice a math circle geometry problem now in the tutor tab?";
      } else if (lowerText.includes('plan') || lowerText.includes('schedule') || lowerText.includes('routine')) {
        coachReply = `Your customized study plan targets ${studentProfile.studyHours} of focused effort per week. I suggest spacing your practice out in 30-minute blocks to build retention. Let's make sure you finish the priority items in your Dashboard today!`;
      } else if (lowerText.includes('math') || lowerText.includes('algebra')) {
        coachReply = "Algebra is the foundation of the SAT Math section (making up over 33% of the questions). I recommend practicing Systems of Equations. Make sure you practice both substitution and elimination methods. Head over to the Tutor workspace to start a lesson!";
      } else {
        coachReply = `Excellent. Remember that consistency beats intensity. You have set a target score of ${studentProfile.targetScore}. Let's work towards that by doing some practice problems in the SAT Prep Workspace!`;
      }

      addMessage({
        sender: 'coach',
        text: coachReply,
        timestamp: new Date().toLocaleTimeString()
      });
      addAgentLog('action', '[Coach Agent] Dynamic simulated response dispatched.');
      setIsLoading(false);
    }, 1000);
  };

  // Get suggestions for the current onboarding step
  const currentSuggestions = !studentProfile.onboardingComplete
    ? ONBOARDING_DIALOGUE[studentProfile.onboardingStep]?.suggestions || []
    : ["Give me an SAT Tip", "Review my Study Plan", "Help with Math"];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', height: '100%' }}>
      {/* Chat Area */}
      <div className="chat-container">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="message-avatar agent" style={{ fontWeight: '700' }}>A</div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Coach Ace</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                <span className="status-dot"></span> Online & Adapting
              </p>
            </div>
          </div>
          {apiKey && (
            <div className="scaffolding-indicator indicator-easy" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={10} /> Live AI Mode
            </div>
          )}
        </div>

        {/* Message scroll container */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'coach' ? 'A' : 'S'}
              </div>
              <div className="message-bubble">
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px', textAlign: msg.sender === 'student' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message agent">
              <div className="message-avatar">A</div>
              <div className="message-bubble" style={{ backgroundColor: 'var(--bg-accent-subtle)', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="status-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="status-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="status-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Replies */}
        <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          {currentSuggestions.map((sug, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => handleSuggestionClick(sug)}
              disabled={isLoading}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* TextInput Area */}
        <form 
          className="chat-input-area" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Type your reply to Coach Ace..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px' }} disabled={isLoading}>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Settings / API Key / Coaching Guide Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-title">
            <Key size={18} className="text-accent" />
            AI Configuration
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            AceSAT comes with a high-quality simulated agent by default. To unlock open-ended conversation and custom SAT questions, add a Gemini API Key below.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Gemini API Key
            </label>
            <input
              type="password"
              className="chat-input"
              style={{ width: '100%', padding: '10px 12px' }}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: 'var(--bg-accent-subtle)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Your API key is saved locally in your browser memory and is only sent directly to Google Gemini's endpoints.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            Personalized Progress
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target Score:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{studentProfile.targetScore || 'Not set'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Weekly Target:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{studentProfile.studyHours || 'Not set'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Primary Focus:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{studentProfile.focusArea || 'Not set'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Onboarding:</span>
              <strong style={{ color: studentProfile.onboardingComplete ? 'var(--success)' : 'var(--warning)' }}>
                {studentProfile.onboardingComplete ? 'Completed' : 'In Progress'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
