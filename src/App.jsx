import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Network, 
  BrainCircuit, 
  Sun, 
  Moon, 
  Sparkles 
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import ChatCoach from './components/ChatCoach';
import TutorWorkspace from './components/TutorWorkspace';
import KnowledgeGraph from './components/KnowledgeGraph';
import AgentConsole from './components/AgentConsole';

import { 
  INITIAL_MASTERY, 
  INITIAL_PLAN_ITEMS, 
  ONBOARDING_DIALOGUE, 
  SAT_TOPICS 
} from './utils/MockData';

export default function App() {
  // Theme state (default dark for premium feel)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Navigation tab state
  const [tab, setTab] = useState('coach'); // Start on coach for onboarding

  // API Key state
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });

  // Student profile state
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('student_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Rivera',
      targetScore: '',
      studyHours: '',
      focusArea: '',
      onboardingStep: 0,
      onboardingComplete: false
    };
  });

  // Mastery levels state
  const [mastery, setMastery] = useState(() => {
    const saved = localStorage.getItem('mastery_levels');
    return saved ? JSON.parse(saved) : INITIAL_MASTERY;
  });

  // Study plan state
  const [planItems, setPlanItems] = useState(() => {
    const saved = localStorage.getItem('plan_items');
    return saved ? JSON.parse(saved) : INITIAL_PLAN_ITEMS;
  });

  // Chat message history
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) return JSON.parse(saved);
    
    // Default initial onboarding message
    return [{
      sender: 'coach',
      text: ONBOARDING_DIALOGUE[0].text,
      timestamp: new Date().toLocaleTimeString(),
      suggestions: ONBOARDING_DIALOGUE[0].suggestions
    }];
  });

  // Telemetry logs for the agent console
  const [logs, setLogs] = useState([
    {
      type: 'thinking',
      text: '[System] Agent engine core initialised. Diagnostics routing engine operational.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      type: 'thinking',
      text: '[Coach Agent] Onboarding workflow initiated. Waiting for student details...',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Workspace active practice topic
  const [currentTopic, setCurrentTopic] = useState(SAT_TOPICS.LINEAR_EQUATIONS);

  // Sync theme with HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('mastery_levels', JSON.stringify(mastery));
  }, [mastery]);

  useEffect(() => {
    localStorage.setItem('plan_items', JSON.stringify(planItems));
  }, [planItems]);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  // Theme switcher helper
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Profile update handler
  const updateProfile = (updated) => {
    setStudentProfile(updated);
  };

  // Add a message to chat
  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // Add telemetry logs to console
  const addAgentLog = (type, text) => {
    setLogs(prev => [...prev, {
      type,
      text,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Clear agent console logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Toggle study checklist item
  const togglePlanItem = (id) => {
    setPlanItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    const item = planItems.find(i => i.id === id);
    if (item) {
      addAgentLog('action', `[Planner] Study checklist update: "${item.title}" marked as ${!item.completed ? 'Completed' : 'Incomplete'}`);
    }
  };

  // Update a topic mastery score
  const updateMasteryScore = (topic, newScore, newStatus) => {
    setMastery(prev => prev.map(m => 
      m.topic === topic ? { ...m, score: newScore, status: newStatus } : m
    ));

    // Dynamic checklist updates based on mastery improvement
    if (newScore > 75) {
      setPlanItems(prev => prev.map(item => {
        if (item.title.toLowerCase().includes(topic.toLowerCase().split(' ')[0])) {
          return { ...item, completed: true };
        }
        return item;
      }));
    }
  };

  // Jump from Knowledge Graph / Dashboard recommendation straight to tutor tab
  const launchTopicPractice = (topic) => {
    setCurrentTopic(topic);
    setTab('tutor');
    addAgentLog('thinking', `[Router] Context route change. Dispatched student to tutor workspace. Loading active topic: "${topic}"`);
  };

  // If onboarding is finished, direct the student to Dashboard or allow normal tabs
  useEffect(() => {
    if (studentProfile.onboardingComplete && tab === 'coach' && studentProfile.onboardingStep === 3) {
      setTab('dashboard');
      addAgentLog('thinking', `[Router] Onboarding completed. Transitioning layout view to primary Dashboard.`);
    }
  }, [studentProfile.onboardingComplete]);

  return (
    <div className="app-container">
      {/* Header section */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">A</div>
          <div className="logo-text">
            <h1>AceSAT</h1>
            <p>Adaptive AI-Tutor Companion</p>
          </div>
        </div>

        {/* Header Navigation tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setTab('dashboard')}
            disabled={!studentProfile.onboardingComplete}
            title={!studentProfile.onboardingComplete ? "Please complete coach onboarding first" : ""}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          
          <button 
            className={`nav-tab ${tab === 'coach' ? 'active' : ''}`}
            onClick={() => setTab('coach')}
          >
            <MessageSquare size={16} />
            Coach Chat
          </button>

          <button 
            className={`nav-tab ${tab === 'tutor' ? 'active' : ''}`}
            onClick={() => setTab('tutor')}
            disabled={!studentProfile.onboardingComplete}
            title={!studentProfile.onboardingComplete ? "Please complete coach onboarding first" : ""}
          >
            <BookOpen size={16} />
            Tutor Workspace
          </button>

          <button 
            className={`nav-tab ${tab === 'graph' ? 'active' : ''}`}
            onClick={() => setTab('graph')}
            disabled={!studentProfile.onboardingComplete}
            title={!studentProfile.onboardingComplete ? "Please complete coach onboarding first" : ""}
          >
            <Network size={16} />
            Knowledge Graph
          </button>
        </nav>

        <div className="header-status">
          <div className="agent-badge">
            <span className="status-dot"></span>
            <span>Agent: Active</span>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main panel layout */}
      <main className="main-content">
        <div className="workspace-panel">
          {tab === 'dashboard' && (
            <Dashboard 
              studentProfile={studentProfile} 
              mastery={mastery} 
              planItems={planItems} 
              togglePlanItem={togglePlanItem}
              setTab={setTab}
              launchTopicPractice={launchTopicPractice}
            />
          )}

          {tab === 'coach' && (
            <ChatCoach 
              studentProfile={studentProfile}
              updateProfile={updateProfile}
              messages={messages}
              addMessage={addMessage}
              apiKey={apiKey}
              setApiKey={setApiKey}
              addAgentLog={addAgentLog}
            />
          )}

          {tab === 'tutor' && (
            <TutorWorkspace 
              apiKey={apiKey}
              mastery={mastery}
              updateMastery={updateMasteryScore}
              addAgentLog={addAgentLog}
              currentTopic={currentTopic}
              setCurrentTopic={setCurrentTopic}
            />
          )}

          {tab === 'graph' && (
            <KnowledgeGraph 
              mastery={mastery}
              launchTopicPractice={launchTopicPractice}
            />
          )}
        </div>

        {/* Sticky side Agent Think logs */}
        <AgentConsole 
          logs={logs} 
          clearLogs={clearLogs}
        />
      </main>
    </div>
  );
}
