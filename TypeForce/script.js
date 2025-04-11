// Define quotes based on difficulty level
const quotes = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Type faster and watch your productivity soar.",
    "Practice makes perfect when learning to type.",
    "Typing is a basic skill for computer users.",
    "Focus on accuracy first, then speed will follow."
  ],
  medium: [
    "Cybersecurity is the art of protecting systems, networks, and programs from digital attacks.",
    "Programming is an art of problem solving through logic and creativity.",
    "The best way to predict the future is to create it through consistent effort.",
    "Knowledge is power but security is strength in the digital world.",
    "Typing fast is a skill every programmer and hacker masters over time."
  ],
  hard: [
    "The intricate complexities of cybersecurity require a multidisciplinary approach involving cryptography, network security, and advanced threat intelligence.",
    "Quantum computing promises to revolutionize our computational capabilities, potentially solving problems that would take conventional computers millions of years.",
    "Artificial intelligence and machine learning algorithms are continuously evolving, transforming how we interact with technology in our daily lives.",
    "The development of blockchain technology introduced unprecedented ways to secure transactions and maintain decentralized, immutable records across various industries.",
    "As software developers navigate the ever-changing technological landscape, they must balance efficiency, security, maintainability, and user experience in their code."
  ]
};

// Default difficulty level
let currentDifficulty = "medium";

// DOM elements
let quoteDisplay = document.getElementById('quoteDisplay');
let inputArea = document.getElementById('input');
let timeDisplay = document.getElementById('time');
let wpmDisplay = document.getElementById('wpm');
let restartBtn = document.getElementById('restart');
let accuracyDisplay = document.getElementById('accuracy');
const soundToggle = document.getElementById('soundToggle');
const keySound = document.getElementById('keySound');
const correctSound = document.getElementById('correctSound');
const matrixToggle = document.getElementById('matrixToggle');
const matrixCanvas = document.getElementById('matrixCanvas');
const ctx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
const easyLevelBtn = document.getElementById('easyLevel');
const mediumLevelBtn = document.getElementById('mediumLevel');
const hardLevelBtn = document.getElementById('hardLevel');

// Variables
let timer;
let time = 0;
let isTyping = false;
let currentQuote = "";

// Render quote with character spans for highlighting
function renderQuote() {
  quoteDisplay.innerHTML = "";
  // Add data attribute for CSS to use
  quoteDisplay.setAttribute('data-difficulty', currentDifficulty);
  
  currentQuote.split("").forEach(char => {
    const charSpan = document.createElement('span');
    charSpan.innerText = char;
    quoteDisplay.appendChild(charSpan);
  });
}

// Start countdown before typing
function startCountdown() {
  const countdownElement = document.getElementById('countdown');
  const countdownNumber = countdownElement.querySelector('.countdown-number');
  let count = 3;
  
  inputArea.value = '';
  inputArea.disabled = true;
  isTyping = false;
  time = 0;
  timeDisplay.innerText = time;
  
  countdownElement.style.display = 'flex';
  
  const countdownInterval = setInterval(() => {
    count--;
    countdownNumber.textContent = count;
    
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.display = 'none';
      inputArea.disabled = false;
      inputArea.focus();
    }
  }, 1000);
}

// Set a new quote and reset the game
function setNewQuote() {
  // Get quotes for the current difficulty
  const difficultyQuotes = quotes[currentDifficulty];
  if (!difficultyQuotes || difficultyQuotes.length === 0) {
    console.error(`No quotes found for difficulty: ${currentDifficulty}`);
    return;
  }
  
  // Select a random quote from the appropriate difficulty
  currentQuote = difficultyQuotes[Math.floor(Math.random() * difficultyQuotes.length)];
  
  // Render the quote and reset the game
  renderQuote();
  time = 0;
  timeDisplay.innerText = "0";
  wpmDisplay.innerText = "0";
  if (accuracyDisplay) accuracyDisplay.innerText = "0";
  clearInterval(timer);
  isTyping = false;
  inputArea.value = '';
  
  // Start countdown
  startCountdown();
}

// Update leaderboard with new score
function updateLeaderboard(wpm, accuracy) {
  let leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard')) || [];
  
  leaderboard.push({
    wpm,
    accuracy,
    difficulty: currentDifficulty,
    date: new Date().toLocaleDateString()
  });
  
  // Sort by WPM (highest first)
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  
  // Keep only top 10 scores
  leaderboard = leaderboard.slice(0, 10);
  
  localStorage.setItem('typingLeaderboard', JSON.stringify(leaderboard));
  displayLeaderboard();
}

// Display leaderboard from local storage
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard')) || [];
  const leaderboardBody = document.getElementById('leaderboardBody');
  
  if (leaderboardBody) {
    leaderboardBody.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
      const difficultyLabel = entry.difficulty ? 
        entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1) : 
        'Medium';
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.wpm}</td>
        <td>${entry.accuracy}%</td>
        <td>${difficultyLabel}</td>
        <td>${entry.date}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  }
}

// Initialize Matrix animation
function initMatrix() {
  if (!matrixCanvas) return;
  
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const fontSize = 14;
  const columns = matrixCanvas.width / fontSize;
  
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  const matrix = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    ctx.fillStyle = '#00ff99';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(Math.floor(Math.random() * 128));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      drops[i]++;
    }
  };

  return setInterval(matrix, 33);
}

// Event listeners
inputArea.addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    timer = setInterval(() => {
      time++;
      timeDisplay.innerText = time;
    }, 1000);
  }

inputArea.addEventListener("paste", function (e) {
      e.preventDefault();
      alert("No hacking allowed! ⛔ Paste is disabled.");
      indicateCheatingAttempt();
  });
  
  if (wpm > 100) {
      alert("🤨 That’s suspiciously fast! Are you cheating?");
    }      
    

  const arrayQuote = currentQuote.split('');
  const arrayValue = inputArea.value.split('');

  let correct = 0;
  let total = arrayQuote.length;

  quoteDisplay.querySelectorAll('span').forEach((span, index) => {
    const char = arrayValue[index];
    if (char == null) {
      span.classList.remove('correct', 'incorrect');
    } else if (char === arrayQuote[index]) {
      span.classList.add('correct');
      span.classList.remove('incorrect');
      correct++;
    } else {
      span.classList.add('incorrect');
      span.classList.remove('correct');
    }
  });

  // Accuracy
  let accuracy = ((correct / Math.max(1, arrayValue.length)) * 100).toFixed(0);
  accuracyDisplay.innerText = isNaN(accuracy) ? 0 : accuracy;

  if (inputArea.value === currentQuote) {
    clearInterval(timer);
    let words = currentQuote.split(" ").length;
    let minutes = time / 60;
    let wpm = Math.round(words / minutes);
    wpmDisplay.innerText = wpm;
    
    if (soundToggle && soundToggle.checked && correctSound) {
      correctSound.play().catch(err => console.log('Audio play error:', err));
    }
    
    updateLeaderboard(wpm, accuracyDisplay.innerText);
  }
});

// Key sound effect
if (inputArea && soundToggle) {
  inputArea.addEventListener('keydown', (e) => {
    if (soundToggle.checked && !e.repeat && keySound) {
      keySound.currentTime = 0;
      keySound.play().catch(err => console.log('Audio play error:', err));
    }
  });
}

// Matrix background toggle
if (matrixToggle) {
  matrixToggle.addEventListener('change', () => {
    if (matrixToggle.checked) {
      document.body.classList.add('matrix-mode');
      matrixCanvas.style.display = 'block';
      initMatrix();
    } else {
      document.body.classList.remove('matrix-mode');
      matrixCanvas.style.display = 'none';
    }
  });
}

// Window resize handler
window.addEventListener('resize', () => {
  if (matrixToggle && matrixToggle.checked && matrixCanvas) {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  }
});

restartBtn.addEventListener('click', setNewQuote);

// Initialize
window.onload = () => {
  loadPreferences();
  setNewQuote();
  displayLeaderboard();
};

// Add these variables at the top with other DOM elements
const darkModeToggle = document.getElementById('darkModeToggle');

// Add function to save user preferences
function savePreferences() {
  const preferences = {
    soundEnabled: soundToggle ? soundToggle.checked : false,
    matrixEnabled: matrixToggle ? matrixToggle.checked : false,
    darkModeEnabled: darkModeToggle ? darkModeToggle.checked : false,
    difficulty: currentDifficulty
  };
  localStorage.setItem('typingTestPreferences', JSON.stringify(preferences));
}

// Add function to load user preferences
function loadPreferences() {
  const savedPreferences = JSON.parse(localStorage.getItem('typingTestPreferences'));
  if (savedPreferences) {
    if (soundToggle && savedPreferences.soundEnabled !== undefined) {
      soundToggle.checked = savedPreferences.soundEnabled;
    }
    
    if (matrixToggle && savedPreferences.matrixEnabled !== undefined) {
      matrixToggle.checked = savedPreferences.matrixEnabled;
      if (savedPreferences.matrixEnabled) {
        document.body.classList.add('matrix-mode');
        matrixCanvas.style.display = 'block';
        initMatrix();
      }
    }
    
    if (darkModeToggle && savedPreferences.darkModeEnabled !== undefined) {
      darkModeToggle.checked = savedPreferences.darkModeEnabled;
      if (savedPreferences.darkModeEnabled) {
        document.body.classList.add('dark-mode');
      }
    }
    
    // Load difficulty preference
    if (savedPreferences.difficulty) {
      currentDifficulty = savedPreferences.difficulty;
      setDifficultyLevel(currentDifficulty);
    }
  }
}

// Update Matrix toggle event listener
if (matrixToggle) {
  matrixToggle.addEventListener('change', () => {
    if (matrixToggle.checked) {
      document.body.classList.add('matrix-mode');
      matrixCanvas.style.display = 'block';
      initMatrix();
    } else {
      document.body.classList.remove('matrix-mode');
      matrixCanvas.style.display = 'none';
    }
    savePreferences();
  });
}

// Add Dark Mode toggle event listener
if (darkModeToggle) {
  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    savePreferences();
  });
}

// Update Sound toggle event listener
if (soundToggle) {
  soundToggle.addEventListener('change', () => {
    savePreferences();
  });
}

// Prevent right-click on quote display to make copying harder
quoteDisplay.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Prevent copy from quote display
quoteDisplay.addEventListener('copy', function(e) {
  e.preventDefault();
  alert("Nice try! 😎 Copying is disabled.");
  return false;
});

// Prevent cut operation on input area
inputArea.addEventListener('cut', function(e) {
  e.preventDefault();
  return false;
});

// Block keyboard shortcuts for copying/pasting
document.addEventListener('keydown', function(e) {
  // Check for Ctrl+C, Ctrl+V, Ctrl+X
  if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || 'x')) {
    if (document.activeElement === quoteDisplay || document.activeElement === inputArea) {
      e.preventDefault();
      alert("Keyboard shortcuts disabled! Type it yourself 💻");
      return false;
    }
  }
});

// Add this at the end of your script
// Basic protection against console modifications
(function protectApp() {
  // Create private copies of key functions
  const originalSetNewQuote = setNewQuote;
  const originalRenderQuote = renderQuote;
  
  // Monitor for any tampering attempts
  Object.defineProperty(window, 'setNewQuote', {
    get: function() {
      console.warn("⚠️ Attempting to access protected function");
      return originalSetNewQuote;
    },
    set: function() {
      console.error("🛑 Modification of app functions is not allowed");
      return originalSetNewQuote;
    }
  });
  
  // Add a console warning when DevTools is opened
  const devToolsWarning = function() {
    console.clear();
    console.log("%cStop! 🛑", "color: red; font-size: 30px; font-weight: bold;");
    console.log("%cThis is a secure typing test. Attempting to cheat will be logged.", 
      "font-size: 16px;");
  };
  
  // Call the warning on DevTools open
  setTimeout(devToolsWarning, 500);
})();

// Add this function to your script
function indicateCheatingAttempt() {
  inputArea.classList.add('cheating-detected');
  setTimeout(() => {
    inputArea.classList.remove('cheating-detected');
  }, 1000);
}

// Update your paste event listener
inputArea.addEventListener("paste", function(e) {
  e.preventDefault();
  alert("No hacking allowed! ⛔ Paste is disabled.");
  indicateCheatingAttempt();
});

// Also update other anti-cheat event listeners to use this function

// Add level selection event handlers
function setDifficultyLevel(level) {
  // Remove active class from all buttons
  easyLevelBtn.classList.remove('active');
  mediumLevelBtn.classList.remove('active');
  hardLevelBtn.classList.remove('active');
  
  // Add active class to selected button
  document.getElementById(`${level}Level`).classList.add('active');
  
  // Set current difficulty
  currentDifficulty = level;
  
  // Save preference
  const preferences = JSON.parse(localStorage.getItem('typingTestPreferences')) || {};
  preferences.difficulty = level;
  localStorage.setItem('typingTestPreferences', JSON.stringify(preferences));
  
  // Get a new quote with this difficulty
  setNewQuote();
}

// Add event listeners for difficulty buttons
easyLevelBtn.addEventListener('click', () => setDifficultyLevel('easy'));
mediumLevelBtn.addEventListener('click', () => setDifficultyLevel('medium'));
hardLevelBtn.addEventListener('click', () => setDifficultyLevel('hard'));

// Ensure this code runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements for difficulty buttons
  const easyLevelBtn = document.getElementById('easyLevel');
  const mediumLevelBtn = document.getElementById('mediumLevel');
  const hardLevelBtn = document.getElementById('hardLevel');
  
  // Verify buttons exist
  if (!easyLevelBtn || !mediumLevelBtn || !hardLevelBtn) {
    console.error("Difficulty buttons not found in the DOM");
    return;
  }
  
  // Function to set difficulty level
  function setDifficultyLevel(level) {
    console.log(`Setting difficulty to: ${level}`);
    
    // Remove active class from all buttons
    easyLevelBtn.classList.remove('active');
    mediumLevelBtn.classList.remove('active');
    hardLevelBtn.classList.remove('active');
    
    // Add active class to selected button
    document.getElementById(`${level}Level`).classList.add('active');
    
    // Set current difficulty
    currentDifficulty = level;
    
    // Save preference
    const preferences = JSON.parse(localStorage.getItem('typingTestPreferences')) || {};
    preferences.difficulty = level;
    localStorage.setItem('typingTestPreferences', JSON.stringify(preferences));
    
    // Get a new quote with this difficulty
    setNewQuote();
  }
  
  // Add click event listeners
  easyLevelBtn.addEventListener('click', function() {
    setDifficultyLevel('easy');
  });
  
  mediumLevelBtn.addEventListener('click', function() {
    setDifficultyLevel('medium');
  });
  
  hardLevelBtn.addEventListener('click', function() {
    setDifficultyLevel('hard');
  });
  
  // Initialize based on saved preference
  const savedPreferences = JSON.parse(localStorage.getItem('typingTestPreferences')) || {};
  if (savedPreferences.difficulty) {
    setDifficultyLevel(savedPreferences.difficulty);
  } else {
    // Default to medium if no preference
    setDifficultyLevel('medium');
  }
});