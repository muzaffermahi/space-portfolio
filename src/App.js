import React, { useState, useEffect, useRef } from 'react';
import { Rocket, X, Music, Pause, Play, SkipForward, ChevronRight } from 'lucide-react';

export default function SpacePortfolio() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 15, y: 50 });
  const [cameraX, setCameraX] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [discoveredPlanets, setDiscoveredPlanets] = useState(new Set());
  const [rotation, setRotation] = useState(0);
  
  // Audio player states
  const songs = useRef([
    { name: 'Rogue Planets – Soundtrack (2018)', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663084322984/ePPiXJipifYdUONT.mp3' },
    { name: 'AJR - Finale (Can\'t Wait To See What You Do Next)', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663084322984/gASqwQdAZGWtFejM.mp3' },
    { name: 'Sarcastic Sounds - Dead Dreams (My favourite!)', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663084322984/MxPnJGegFEQxriTJ.mp3' },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const textSoundTimeout = useRef(null);
  const audioContextRef = useRef(null);

  // Use refs for smooth movement
  const keysPressed = useRef({});
  const animationId = useRef(null);
  const playerPosRef = useRef({ x: 15, y: 50 });
  const cameraXRef = useRef(0);
  const rotationRef = useRef(0);
  const lastFrameTime = useRef(0);
  
  // Expanded game world
  const WORLD_WIDTH = 500;
  const SCREEN_WIDTH = 100;
  
  // Portfolio sections with split content for Sans-style progression
  const planets = [
    {
      id: 'intro',
      x: 20,
      y: 30,
      size: 60,
      color: '#4A90E2',
      name: 'EARTH',
      title: 'Start Here',
      content: [
        "Yolo! I'm Mahi!",
        "This is the beginning of my journey.",
        "I build things, break things, and stare at the night sky wondering what the hell is out there.",
        "Navigate with WASD or arrows. Click planets to discover my work. Or just fly around - I built this in 3 days, what did you expect?"
      ]
    },
    {
      id: 'projects',
      x: 150,
      y: 25,
      size: 50,
      color: '#E74C3C',
      name: 'BEGINNING',
      title: 'The Work',
      content: [
        "Rogue Planets! I researched what could happen to Earth if one of them got close to Earth with Shrihan Agarwal from the University of Chicago!",
        "I created 2 sets of simulations in python to do our research. My big takeaway? Learn NVIDIA CUDA (a library to perform simulations in a GPU) before doing such simulations.",
        "Even with multi-processing, CPU's are simply hundreds of times slower than GPU's. Even though CUDA is complicated, the range of simulations you can do is insane.",
        "If you can't do GPU's and multi-processing, use Cython or Numba, the GOATS of cpu simulations.",
        "Anyways, in the project we found that a rogue planet can be quite dangerous if it approaches from certain angles with certain speeds (Yeah, too vague, check my paper out for more details).",
        "I'm planning on coding a more detailed simulation, so if you're interested, please keep playing!",
        "Sarac Rocketry - The school club where I learned I couldn't code for 48+ hours with 2 hours of sleep and a nuclear amount of caffeine.",
        "But we did send 15 kilogram engineering marvels up 1500 meters and land them safely, sooo...",
        "I believe knowledge should be free, regardless of language. That's why I used to spend a lot of time translating Wikipedia pages from English to Turkish.",
        "Because guess what, the most beautiful Solar System object (psst Iapetus) didn't have a wikipedia page in Turkish, let alone any information about it in the forums.",
        "So, if you want to contribute to free-knowledge and you happen to know 2 languages, just translate wiki pages.",
        "'Imagine a world in which every single person on the planet is given free access to the sum of all human knowledge' - Jimmy Wales."
      ]
    },
    {
      id: 'research',
      x: 280,
      y: 60,
      size: 55,
      color: '#9B59B6',
      name: 'indextr',
      title: 'More free knowledge',
      content: [
        "indextr.com",
        "I started this project because the Turkish academia searching websites are mostly old, slow, and has a bad ui.",
        "But even worse, they are seperated, so you often need to visit multiple websites to find a simple thing.",
        "That's why I built indextr, a website that merges TRDizin (an academic index for journals), Dergipark (A merged platform for journals), and YokTez (Turkish theses database).",
        "The project is not done yet, but still open to public. I'm currently improving the search algorithm with AI.",
        "That's it about indextr. Check it out!"
      ]
    },
    {
      id: 'about',
      x: 380,
      y: 40,
      size: 45,
      color: '#F39C12',
      name: 'Humans?',
      title: 'The Human Bit',
      content: [
        "RANDOM FACTS:",
        "I'm super into drones. Until recently I had an OG DJI Mavic air, but now I'm looking to upgrade into the FPV universe.",
        "I love using Python for every project. It's just extremely simple, amazing community and library support, and the ability to write code free of unsolvable bugs.",
        "Here's my personal language list: Python > Javascript > PHP > C > C++ > Java",
        "Last coding tip: If you're a 17 year old like me, VIBE CODE!",
        "I'm serious. You still need to know your basics in the language you code in, but AI made this stuff so simple it's a disadvantage to not vibe-code in certain projects.",
        "Go with any LLM you want, but personally Claude is my favourite."
      ]
    },
    {
      id: 'contact',
      x: 450,
      y: 70,
      size: 60,
      name: 'ME',
      title: 'Let\'s Talk',
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663084322984/KRjwkhInksmcbnzV.png',
      content: [
        "EMAIL: muzaffermahican@gmail.com",
        "LINKEDIN: linkedin.com/in/muzaffer-mahi-can-130368236/",
        "Want to talk about rogue planets? Dark matter? Why physics is simultaneously the best and most frustrating thing ever?",
        "Hit me up.",
        "I'm available for research, internship, or any project you might want to collaborate on.",
        "P.S. - If you made it this far, thanks for playing my janky space game.",
        "If you wonder how I made this game, check my github: github.com/muzaffermahi"
      ]
    }
  ];

  // Generate stars
  const [stars] = useState(() => {
    return Array.from({ length: 500 }, () => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1
    }));
  });

  // Audio player effects with reduced volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = songs.current[currentSongIndex].url;
    audio.loop = true;
    audio.volume = 0.1; // Tune down the music volume

    if (isPlaying) {
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [currentSongIndex, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const playNextSong = () => {
    setCurrentSongIndex(prevIndex => (prevIndex + 1) % songs.current.length);
    setIsPlaying(true);
  };

  // Play Sans-style talking sound for a duration
  const playTextSound = (duration = 3000) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    let beepCount = 0;
    const maxBeeps = Math.floor(duration / 60); // Calculate how many beeps for the duration
    
    const playBeep = () => {
      if (beepCount >= maxBeeps) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Random frequency for Sans-style variety
      oscillator.frequency.value = 120 + Math.random() * 80;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime); // Quieter beeps
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.03);
      
      beepCount++;
      textSoundTimeout.current = setTimeout(playBeep, 60);
    };
    
    playBeep();
  };

  // Stop text sound
  const stopTextSound = () => {
    if (textSoundTimeout.current) {
      clearTimeout(textSoundTimeout.current);
      textSoundTimeout.current = null;
    }
  };

  // Game movement effect
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
      const deltaTime = currentTime - lastFrameTime.current;
      lastFrameTime.current = currentTime;
      
      const normalizedDelta = deltaTime / 16.67;
      
      let dx = 0;
      let dy = 0;
      const baseSpeed = 1.2;
      const speed = baseSpeed * normalizedDelta;

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

      if (dx !== 0 && dy !== 0) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        dx = dx / magnitude;
        dy = dy / magnitude;
      }

      if (dx !== 0 || dy !== 0) {
        playerPosRef.current.x += dx * speed;
        playerPosRef.current.y += dy * speed;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        rotationRef.current = angle;
      }

      playerPosRef.current.x = Math.max(0, Math.min(WORLD_WIDTH, playerPosRef.current.x));
      playerPosRef.current.y = Math.max(0, Math.min(100, playerPosRef.current.y));

      const targetCameraX = playerPosRef.current.x - 30;
      cameraXRef.current = Math.max(0, Math.min(WORLD_WIDTH - SCREEN_WIDTH, targetCameraX));

      setPlayerPos({ ...playerPosRef.current });
      setCameraX(cameraXRef.current);
      setRotation(rotationRef.current);
      
      animationId.current = requestAnimationFrame(gameLoop);
    };
    
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
    
    if (distance < 300) {
      setSelectedPlanet(planet);
      setCurrentTextIndex(0);
      
      // Play initial text sound
      const textLength = planet.content[0].length;
      const duration = Math.min(textLength * 50, 3000); // Scale with text length, max 3 seconds
      playTextSound(duration);
      
      if (!discoveredPlanets.has(planet.id)) {
        setDiscoveredPlanets(new Set([...discoveredPlanets, planet.id]));
        setScore(score + 100);
      }
    }
  };

  const handleNextText = () => {
    if (selectedPlanet && currentTextIndex < selectedPlanet.content.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
      
      // Play sound for the new text
      const textLength = selectedPlanet.content[currentTextIndex + 1].length;
      const duration = Math.min(textLength * 50, 3000);
      playTextSound(duration);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlanet(null);
    setCurrentTextIndex(0);
    stopTextSound();
  };

  const worldToScreen = (worldX) => {
    return ((worldX - cameraX) / SCREEN_WIDTH) * 100;
  };

  const isVisible = (worldX, size = 0) => {
    const screenX = worldToScreen(worldX);
    return screenX > -size && screenX < 100 + size;
  };

  if (!gameStarted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {stars.filter(star => star.x < 100).map((star, i) => (
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
            Navigate the vast expanse of space. Discover my work hidden among distant worlds.
          </p>
          <p className="text-sm text-gray-400">
            Controls: WASD or Arrow Keys to move • Explore right to find planets • Click planets to interact
          </p>
          <button
            onClick={() => {
              setGameStarted(true);
              setIsPlaying(true); // Auto-play music on start
            }}
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
      {stars.filter(star => isVisible(star.x, 5)).map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            left: `${worldToScreen(star.x)}%`,
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
          <p className="text-xs text-gray-400">Position: {Math.round(playerPos.x)}, {Math.round(playerPos.y)}</p>
        </div>
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded text-xs max-w-xs">
          <p>Move with WASD or arrows</p>
          <p>Explore right to discover planets</p>
          <p>Click planets to interact</p>
        </div>
      </div>

      {/* Music Player */}
      <div className="absolute bottom-4 left-4 text-white z-20">
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded flex items-center space-x-2">
          <Music className="w-5 h-5" />
          <span className="text-sm">{songs.current[currentSongIndex].name}</span>
          <button onClick={togglePlayPause} className="p-1 rounded-full hover:bg-gray-700">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={playNextSong} className="p-1 rounded-full hover:bg-gray-700">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-4 right-4 text-white z-20">
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded">
          <p className="text-xs text-gray-400 mb-1">EXPLORATION PROGRESS</p>
          <div className="w-32 h-2 bg-gray-700 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${(playerPos.x / WORLD_WIDTH) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planets */}
      {planets.filter(planet => isVisible(planet.x, planet.size)).map((planet) => {
        const isDiscovered = discoveredPlanets.has(planet.id);
        const screenX = worldToScreen(planet.x);
        
        return (
          <div
            key={planet.id}
            onClick={() => handlePlanetClick(planet)}
            className="absolute cursor-pointer transform transition-transform hover:scale-110"
            style={{
              left: `${screenX}%`,
              top: `${planet.y}%`,
              width: `${planet.size}px`,
              height: `${planet.size}px`,
            }}
          >
            {planet.image ? (
              <img 
                src={planet.image} 
                alt={planet.name} 
                className="w-full h-full object-contain"
                style={{ opacity: isDiscovered ? 1 : 0.7 }}
              />
            ) : (
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
            )}
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
          left: `${worldToScreen(playerPos.x)}%`,
          top: `${playerPos.y}%`,
        }}
      >
        <Rocket className="text-white w-8 h-8" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50 animate-pulse" />
      </div>

      {/* Planet Info Modal - Sans-style text progression */}
      {selectedPlanet && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border-2"
               style={{ borderColor: selectedPlanet.color || '#1ABC9C' }}>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              {selectedPlanet.image ? (
                <img 
                  src={selectedPlanet.image} 
                  alt={selectedPlanet.name} 
                  className="w-16 h-16 object-contain rounded-full"
                  style={{ boxShadow: `0 0 30px ${selectedPlanet.color || '#1ABC9C'}` }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 30px ${selectedPlanet.color}`
                  }}
                />
              )}
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedPlanet.name}</h2>
                <p className="text-gray-400">{selectedPlanet.title}</p>
              </div>
            </div>
            
            {/* Display current text sections */}
            <div className="text-gray-300 leading-relaxed space-y-4">
              {selectedPlanet.content.slice(0, currentTextIndex + 1).map((text, index) => (
                <p key={index} className={`${index === currentTextIndex ? 'animate-pulse' : ''}`}>
                  {text}
                </p>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between items-center">
              {currentTextIndex < selectedPlanet.content.length - 1 ? (
                <button
                  onClick={handleNextText}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCloseModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  Continue Exploring
                </button>
              )}
              
              <span className="text-xs text-gray-500">
                {currentTextIndex + 1} / {selectedPlanet.content.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
