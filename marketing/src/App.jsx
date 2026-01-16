import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { findAnswer } from './Knowledge';
import { getGeminiResponse } from './GeminiService';
import { SoundEngine } from './SoundEngine';
import { BackgroundFlow } from './components/BackgroundFlow';
import { ArtifactRenderer } from './components/ArtifactRenderer';

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(findAnswer('about'));
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showArtifact, setShowArtifact] = useState(false);
  const [logs, setLogs] = useState([]);
  const [physicsMode, setPhysicsMode] = useState('active');
  const [containerRect, setContainerRect] = useState(null);
  const [lastUserQuery, setLastUserQuery] = useState('');
  const [aiStatus, setAiStatus] = useState('ONLINE');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const logMessages = ["Stream velocity: OPTIMAL", "Analyzing build paths...", "Cache synchronized: Manotick, ON", "System status: WE BUILD USEFUL THINGS", "Millrace core temperature: STABLE"];
    const interval = setInterval(() => {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLogs(prev => [msg, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [displayedText, showArtifact]);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowArtifact(false);

    let i = 0;
    const textToShow = data.text;
    const timer = setInterval(() => {
      setDisplayedText(textToShow.substring(0, i + 1));
      if (Math.random() > 0.5) SoundEngine.playEmanation(); // Melodic data flow
      i++;
      if (i >= textToShow.length) {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => {
          setShowArtifact(true);
          if (data.artifact) SoundEngine.playArtifactSlide();
        }, 500);
      }
    }, 12);

    return () => clearInterval(timer);
  }, [data]);

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
      SoundEngine.playEnter();
      const userQuery = query;
      setLastUserQuery(userQuery); // Set Echo
      setQuery('');
      setIsTyping(true);
      setDisplayedText('');
      setShowArtifact(false);
      SoundEngine.playDataStream(); // Processing sound

      try {
        // 1. Get Intelligence
        let geminiResult = null;
        try {
          geminiResult = await getGeminiResponse(userQuery);
        } catch (e) {
          console.warn("API Call Failed", e);
        }

        // 2. Determine Visuals & Text
        let responseText = "";
        let artifactToDisplay = null;

        // Check for hard failure or explicit error from service
        if (!geminiResult || geminiResult.artifactType === 'error') {
          console.log("Using Local Fallback");
          setAiStatus('OFFLINE');
          const localNode = findAnswer(userQuery);
          responseText = localNode.text;
          artifactToDisplay = localNode.artifact;
          if (localNode.physics) setPhysicsMode(localNode.physics);
        } else {
          // Success Path
          setAiStatus('ONLINE');
          responseText = geminiResult.text;
          artifactToDisplay = findAnswer(userQuery).artifact; // Default fallback

          if (geminiResult.artifactType) {
            const map = {
              'blueprint': 'services',
              'map': 'location',
              'stats': 'tech',
              'quote': 'philosophy',
              'founder': 'founder',
              'contact': 'contact'
            };
            const key = map[geminiResult.artifactType];
            if (key) {
              const node = findAnswer(key);
              if (node && node.artifact) {
                artifactToDisplay = node.artifact;
                if (node.physics) setPhysicsMode(node.physics);
              }
            }
          } else {
            // If AI didn't trigger a node, check if our local search did
            const localNode = findAnswer(userQuery);
            if (localNode && localNode.physics) setPhysicsMode(localNode.physics);
          }
        }

        // 3. Update State
        setData({
          text: responseText,
          artifact: artifactToDisplay
        });

      } catch (err) {
        console.error("Critical Oracle Error:", err);
        // Absolute last resort
        const safeNode = findAnswer('help');
        setData({
          text: "CONNECTION UNSTABLE. " + safeNode.text,
          artifact: safeNode.artifact
        });
      }
    }
  };

  const handleGlobalFocus = () => {
    SoundEngine.init(); // Warm up audio context silently
    inputRef.current?.focus();
  };

  return (
    <div className="app-container" onClick={handleGlobalFocus}>
      <BackgroundFlow containerRect={containerRect} physicsMode={physicsMode} />

      <div className="branding-overlay">
        THE MILLRACE CO. // SYSTEM v1.0
        <div className="system-logs">
          {logs.map((log, i) => (
            <div key={i} className="log-line">{log}</div>
          ))}
        </div>
      </div>

      <div className="oracle-wrapper" ref={containerRef}>
        <div className="terminal-header">
          System Access // Intelligence Oracle
          <span style={{ marginLeft: '1rem', opacity: 0.4, fontSize: '0.8em', letterSpacing: '0.1em' }}>
            {aiStatus === 'ONLINE' ? '● LIVE' : '○ CACHE'}
          </span>
        </div>

        <div className="terminal-input-row">
          <span>&gt;</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              SoundEngine.playKeystroke();
            }}
            onKeyDown={handleSubmit}
            placeholder=""
            autoFocus
          />
          {!query && <div className="cursor" />}
        </div>

        <div className="response-area">
          {lastUserQuery && (
            <div className="command-echo">
              <span className="echo-arrow">&gt;</span> {lastUserQuery}
            </div>
          )}
          <div className="response-text">
            {displayedText}
            {!isTyping && displayedText && <span className="cursor-stable" />}
          </div>

          <div className={`artifact-container ${showArtifact ? 'visible' : ''}`}>
            <ArtifactRenderer artifact={data.artifact} />
          </div>
        </div>
      </div>

      <div className="location-overlay">
        <span style={{ opacity: 0.5 }}>NODE:</span> MANOTICK, ONTARIO<br />
        <span style={{ opacity: 0.5 }}>COORDS:</span> 45.2268° N, 75.6831° W<br />
      </div>
    </div>
  );
}

export default App;
