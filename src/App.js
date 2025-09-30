import React, { useState, useEffect, useRef } from 'react';
import { Rocket, X } from 'lucide-react';

export default function SpacePortfolio() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [score, setScore] = useState(0);
  const [discoveredPlanets, setDiscoveredPlanets] = useState(new Set());
  const [rotation, setRotation] = useState(0);
  
  // Use refs for smooth movement
  const keysPressed = useRef({});
  const animationId = useRef(null);
  const playerPosRef = useRef({ x: 50, y: 50 });
  const rotationRef = useRef(0);
  const lastFrameTime = useRef(0);
  
  // Portfolio sections as "planets"
  const planets = [
    {
      id: 'intro',
      x: 20,
      y: 30,
      size: 60,
      color: '#4A90E2',
      name: 'EARTH',
      title: 'Start Here',
      content: `Hey. I'm [YOUR NAME].

At 13.8 billion years old, the universe has seen some shit. Here's what I've done in my 17 years.

I build things, break things, and stare at the night sky wondering what the hell is out there. This portfolio? It's my way of showing you I'm not just another physics kid with good grades.

Navigate with WASD or arrows. Click planets to discover my work. Or just fly around - I built this in 3 days, what did you expect?`
    },
    {
      id: 'projects',
      x: 70,
      y: 25,
      size: 50,
      color: '#E74C3C',
      name: 'MARS',
      title: 'The Work',
      content: `PROJECT 1: [Your coolest project]
Built/researched/discovered [thing]. Why it matters: [impact].

PROJECT 2: [Second coolest thing]
The one where I learned [lesson] the hard way.

PROJECT 3: [Something weird/personal]
Not everything needs to change the world. Sometimes you just need to know if [random question].

Replace this with YOUR actual projects. Make them stories, not bullet points. Admissions officers are human - bore them and they'll forget you in 10 minutes.`
    },
    {
      id: 'research',
      x: 45,
      y: 60,
      size: 55,
      color: '#9B59B6',
      name: 'KEPLER-442b',
      title: 'Research & Obsessions',
      content: `CURRENT OBSESSION: [What you're actually into right now]

PAST WORK:
- [Research experience if you have it]
- [Independent projects that aren't school assignments]
- [That thing you do at 2am because you can't stop thinking about it]

The thing about physics is it's not about memorizing formulas. It's about looking at the universe and asking "but WHY though?" 

If you don't have formal research, put what you're CURIOUS about. Genuine curiosity > fake credentials.`
    },
    {
      id: 'about',
      x: 85,
      y: 70,
      size: 45,
      color: '#F39C12',
      name: 'TITAN',
      title: 'The Human Bit',
      content: `WHO I AM WHEN I'M NOT DOING PHYSICS:
[Actually interesting things about you]

RANDOM FACTS:
- [Something weird that makes you memorable]
- [A failure that taught you something]
- [Why you actually care about this major]

Look, I could tell you I'm "passionate about learning" and "collaborative team player" but you've read that 10,000 times. 

Instead: [something real about why you give a shit about astronomy/physics that isn't just "it's cool"]`
    },
    {
      id: 'contact',
      x: 30,
      y: 85,
      size: 40,
      color: '#1ABC9C',
      name: 'DEEP SPACE',
      title: 'Let\'s Talk',
      content: `EMAIL: your.email@whatever.com
GITHUB: github.com/yourusername
[Other links if relevant]

Want to talk about exoplanets? Dark matter? Why physics is simultaneously the best and most frustrating thing ever? Hit me up.

Currently working on: [current project/learning]
Available for: [internships/research/collaboration/whatever]

P.S. - If you made it this far, thanks for playing my janky space game. I promise I'm better at physics than I am at game design.`
    }
  ];

  // Stars for background
  const [stars] = useState(() => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1
    }));
  });

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = (currentTime) => {
      // Calculate delta time for frame-rate independent movement
      const deltaTime = currentTime - lastFrameTime.current;
      lastFrameTime.current = currentTime;
      
      // Normalize delta time (60fps = 16.67ms per frame)
      const normalizedDelta = deltaTime / 16.67;
      
      let dx = 0;
      let dy = 0;
      const baseSpeed = 1.2; // Increased base speed for responsiveness
      const speed = baseSpeed * normalizedDelta;

      // Check all keys and accumulate direction
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        dy -= 1;
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        dy += 1;
      }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        dx -= 1;
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        dx += 1;
      }

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        dx = dx / magnitude;
        dy = dy / magnitude;
      }

      // Apply movement to ref
      if (dx !== 0 || dy !== 0) {
        playerPosRef.current.x += dx * speed;
        playerPosRef.current.y += dy * speed;

        // Calculate rotation based on movement direction
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        rotationRef.current = angle;
      }

      // Keep player within bounds
      playerPosRef.current.x = Math.max(0, Math.min(100, playerPosRef.current.x));
      playerPosRef.current.y = Math.max(0, Math.min(100, playerPosRef.current.y));

      // Update React state less frequently for better performance
      setPlayerPos({ ...playerPosRef.current });
      setRotation(rotationRef.current);
      
      animationId.current = requestAnimationFrame(gameLoop);
    };
    
    // Initialize the first frame time
    lastFrameTime.current = performance.now();
    animationId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [gameStarted]);

  const handlePlanetClick = (planet) => {
    const distance = Math.sqrt(
      Math.pow(playerPos.x - planet.x, 2) + Math.pow(playerPos.y - planet.y, 2)
    );
    
    if (distance < 15) {
      setSelectedPlanet(planet);
      if (!discoveredPlanets.has(planet.id)) {
        setDiscoveredPlanets(new Set([...discoveredPlanets, planet.id]));
        setScore(score + 100);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.6
            }}
          />
        ))}
        <div className="z-10 text-center space-y-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            COSMIC PORTFOLIO
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Navigate space. Discover my work. Try not to crash into anything.
          </p>
          <p className="text-sm text-gray-400">
            Controls: WASD or Arrow Keys to move • Click planets when close to explore
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
          >
            LAUNCH MISSION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.4
          }}
        />
      ))}

      {/* HUD */}
      <div className="absolute top-4 left-4 text-white space-y-2 z-20">
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded">
          <p className="text-sm">PLANETS DISCOVERED: {discoveredPlanets.size}/{planets.length}</p>
          <p className="text-sm">POINTS: {score}</p>
        </div>
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded text-xs max-w-xs">
          <p>Move with WASD or arrows</p>
          <p>Get close to planets and click them</p>
        </div>
      </div>

      {/* Planets */}
      {planets.map((planet) => {
        const isDiscovered = discoveredPlanets.has(planet.id);
        return (
          <div
            key={planet.id}
            onClick={() => handlePlanetClick(planet)}
            className="absolute cursor-pointer transform transition-transform hover:scale-110"
            style={{
              left: `${planet.x}%`,
              top: `${planet.y}%`,
              width: `${planet.size}px`,
              height: `${planet.size}px`,
            }}
          >
            <div
              className="w-full h-full rounded-full shadow-lg flex items-center justify-center"
              style={{
                backgroundColor: planet.color,
                boxShadow: `0 0 20px ${planet.color}`,
                opacity: isDiscovered ? 1 : 0.7
              }}
            >
              <span className="text-white text-xs font-bold text-center px-2">
                {planet.name}
              </span>
            </div>
            {isDiscovered && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-400 text-xs whitespace-nowrap">
                ✓ DISCOVERED
              </div>
            )}
          </div>
        );
      })}

      {/* Player (Spaceship) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
        }}
      >
        <Rocket className="text-white w-8 h-8" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50 animate-pulse" />
      </div>

      {/* Planet Info Modal */}
      {selectedPlanet && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border-2"
               style={{ borderColor: selectedPlanet.color }}>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full"
                style={{
                  backgroundColor: selectedPlanet.color,
                  boxShadow: `0 0 30px ${selectedPlanet.color}`
                }}
              />
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedPlanet.name}</h2>
                <p className="text-gray-400">{selectedPlanet.title}</p>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {selectedPlanet.content}
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
