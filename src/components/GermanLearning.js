import React, { useState, useEffect } from 'react';
import './GermanLearning.css';

const GermanLearning = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(5);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [xp, setXp] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [exerciseType, setExerciseType] = useState('write'); // write, select, listen

  const wordDatabase = {
    beginner: [
      { 
        german: 'Hallo', 
        turkish: 'Merhaba',
        type: 'greeting',
        audio: 'hallo.mp3',
        options: ['Merhaba', 'Güle güle', 'Nasılsın', 'Teşekkürler'],
        image: 'greeting.png'
      },
      { 
        german: 'Guten Morgen',
        turkish: 'Günaydın',
        type: 'greeting',
        audio: 'guten_morgen.mp3',
        options: ['İyi akşamlar', 'Günaydın', 'İyi geceler', 'Merhaba']
      },
      { 
        german: 'Guten Tag',
        turkish: 'İyi günler',
        type: 'greeting',
        audio: 'guten_tag.mp3',
        options: ['İyi günler', 'İyi geceler', 'Günaydın', 'İyi akşamlar']
      },
      { 
        german: 'Ja',
        turkish: 'Evet',
        type: 'basic',
        audio: 'ja.mp3',
        options: ['Evet', 'Hayır', 'Belki', 'Tamam']
      },
      { 
        german: 'Nein',
        turkish: 'Hayır',
        type: 'basic',
        audio: 'nein.mp3',
        options: ['Hayır', 'Evet', 'Belki', 'Tamam']
      },
      { 
        german: 'Eins',
        turkish: 'Bir',
        type: 'number',
        audio: 'eins.mp3',
        options: ['Bir', 'İki', 'Üç', 'Dört']
      },
      { 
        german: 'Zwei',
        turkish: 'İki',
        type: 'number',
        audio: 'zwei.mp3',
        options: ['İki', 'Üç', 'Dört', 'Beş']
      }
    ],
    
    intermediate: [
      { 
        german: 'Wie geht es dir?',
        turkish: 'Nasılsın?',
        type: 'conversation',
        audio: 'wie_geht_es_dir.mp3',
        options: ['Nasılsın?', 'Nerelisin?', 'Kaç yaşındasın?', 'Adın ne?']
      },
      { 
        german: 'Mir geht es gut',
        turkish: 'İyiyim',
        type: 'conversation',
        audio: 'mir_geht_es_gut.mp3',
        options: ['İyiyim', 'Kötüyüm', 'Bilmiyorum', 'Belki']
      },
      { 
        german: 'Ich habe Hunger',
        turkish: 'Açım',
        type: 'food',
        audio: 'ich_habe_hunger.mp3',
        options: ['Açım', 'Tokum', 'Susamışım', 'Yorgunum']
      },
      { 
        german: 'Das Wasser',
        turkish: 'Su',
        type: 'food',
        audio: 'wasser.mp3',
        options: ['Su', 'Çay', 'Kahve', 'Süt']
      }
    ],
    
    advanced: [
      { 
        german: 'Können Sie das bitte wiederholen?',
        turkish: 'Bunu tekrar edebilir misiniz?',
        type: 'business',
        audio: 'wiederholen.mp3',
        options: ['Bunu tekrar edebilir misiniz?', 'Anlayamadım', 'Daha yavaş konuşur musunuz?', 'Tekrar eder misiniz?']
      },
      { 
        german: 'Ich verstehe nicht',
        turkish: 'Anlamıyorum',
        type: 'business',
        audio: 'verstehe_nicht.mp3',
        options: ['Anlamıyorum', 'Anlıyorum', 'Bilmiyorum', 'Belki']
      }
    ]
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem('germanProgress');
    if (savedProgress) {
      const { savedScore, savedStreak, savedLevel } = JSON.parse(savedProgress);
      setScore(savedScore);
      setStreak(savedStreak);
      setLevel(savedLevel);
    }
    checkDailyStreak();
  }, []);

  const checkDailyStreak = () => {
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLoginDate === today) {
      return;
    }
    
    if (lastLoginDate && new Date(lastLoginDate).toDateString() === new Date(Date.now() - 86400000).toDateString()) {
      setStreak(prev => prev + 1);
    } else if (lastLoginDate) {
      setStreak(0);
    }
    
    localStorage.setItem('lastLoginDate', today);
  };

  const saveProgress = () => {
    localStorage.setItem('germanProgress', JSON.stringify({
      savedScore: score,
      savedStreak: streak,
      savedLevel: level
    }));
  };

  const getRandomWord = () => {
    const currentLevel = level <= 5 ? 'beginner' : level <= 10 ? 'intermediate' : 'advanced';
    const words = wordDatabase[currentLevel];
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setUserAnswer('');
    setFeedback('');
  };

  const getRandomExerciseType = () => {
    const types = ['write', 'select', 'listen'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setExerciseType(randomType);
    if (randomType === 'select') {
      setShowOptions(true);
    }
  };

  const playAudio = (word) => {
    const audio = new Audio(`/audio/${word.audio}`);
    audio.play();
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setUserAnswer(option);
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.toLowerCase() === currentWord.turkish.toLowerCase();
    
    if (isCorrect) {
      setFeedback('Doğru! 🎉');
      setScore(score + 10);
      setDailyGoal(dailyGoal + 1);
      setXp(xp + 20);
      
      if (score > 0 && score % 100 === 0) {
        setLevel(prev => prev + 1);
        showLevelUpMessage();
      }
    } else {
      setFeedback(`Yanlış. Doğru cevap: ${currentWord.turkish}`);
      setHearts(prev => prev - 1);
      
      if (hearts <= 1) {
        showGameOver();
      }
    }
    
    saveProgress();
    setShowOptions(false);
    setSelectedOption(null);
  };

  const showLevelUpMessage = () => {
    alert(`Tebrikler! Seviye ${level + 1}'e yükseldiniz! 🎉`);
  };

  const showGameOver = () => {
    alert(`
      Oyun Bitti! 
      Toplam XP: ${xp}
      Seviye: ${level}
      Gün Serisi: ${streak}
      
      Yeniden başlamak için OK'a tıklayın.
    `);
    resetGame();
  };

  const resetGame = () => {
    setHearts(5);
    setCurrentWord(null);
    setUserAnswer('');
    setFeedback('');
  };

  return (
    <div className="german-learning-container">
      <div className="header">
        <div className="streak">🔥 {streak} gün</div>
        <div className="hearts">❤️ {hearts}</div>
        <div className="level">Seviye {level}</div>
        <div className="xp">XP: {xp}</div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(dailyGoal / 20) * 100}%` }}
        ></div>
        <div className="daily-goal">
          Günlük Hedef: {dailyGoal}/20
        </div>
      </div>

      {!currentWord ? (
        <div className="start-screen">
          <h1>Almanca Öğrenmeye Başla</h1>
          <button 
            onClick={() => {
              getRandomWord();
              getRandomExerciseType();
            }} 
            className="start-button"
          >
            Başla
          </button>
        </div>
      ) : (
        <div className="question-container">
          <h2>
            {exerciseType === 'write' && 'Bu kelimenin Türkçe karşılığı nedir?'}
            {exerciseType === 'select' && 'Doğru çeviriyi seçin'}
            {exerciseType === 'listen' && 'Dinlediğiniz kelimeyi yazın'}
          </h2>
          
          {exerciseType === 'listen' ? (
            <button 
              onClick={() => playAudio(currentWord)}
              className="listen-button"
            >
              🔊 Dinle
            </button>
          ) : (
            <div className="german-word">{currentWord.german}</div>
          )}
          
          <div className="word-type">{currentWord.type}</div>
          
          {currentWord.image && (
            <img 
              src={`/images/${currentWord.image}`} 
              alt={currentWord.german}
              className="word-image"
            />
          )}

          {exerciseType === 'select' ? (
            <div className="options-container">
              {currentWord.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Türkçe karşılığını yazın"
            />
          )}

          <div className="button-group">
            <button onClick={checkAnswer} className="check-button">
              Kontrol Et
            </button>
            <button 
              onClick={() => {
                getRandomWord();
                getRandomExerciseType();
              }} 
              className="next-button"
            >
              Sonraki
            </button>
          </div>
          
          {feedback && (
            <div className={`feedback ${feedback.includes('Doğru') ? 'correct' : 'wrong'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GermanLearning; 