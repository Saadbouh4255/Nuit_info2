import React, { useState, useEffect } from 'react';
import './fabl.css';

const WorstInterface = () => {
  const [alerts, setAlerts] = useState([]);
  const [flash, setFlash] = useState(false);
  const [badLogin, setBadLogin] = useState(false);
  
  // حالة نموذج BadLogin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [keys, setKeys] = useState([]);

  // ERROR HANDLER
  const generalError = () => {
    const id = Date.now();
    setAlerts(prev => [...prev, id]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alertId => alertId !== id));
    }, 5000);

    setFlash(true);
    setTimeout(() => setFlash(false), 10000);
  };

  // عرض نموذج BadLogin
  const displayFormBadLogin = () => {
    setBadLogin(true);
    generalError();
    
    // التمرير إلى النموذج بعد ظهوره
    setTimeout(() => {
      const formElement = document.querySelector('.formulaire');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // --- LOGIQUE DU MOT DE PASSE ---
  const allChars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%?".split('');

  const shuffleKeys = () => {
    const shuffled = [...allChars].sort(() => Math.random() - 0.5);
    setKeys(shuffled);
  };

  useEffect(() => {
    shuffleKeys();
  }, []);

  const handleVirtualKey = (char) => {
    setPassword((prev) => prev + char);
    shuffleKeys();
  };

  // --- LOGIQUE DE L'EMAIL ---
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleKeyUp = (e) => {
    const isCaps = e.getModifierState("CapsLock");
    setCapsLockActive(isCaps);

    if (!isCaps) {
      setEmail(""); 
    }
  };

  // --- LOGIQUE DE SOUMISSION BadLogin ---
  const handleFakeLogin = () => {
    alert("❌ ERREUR SYSTÈME : Formulaire réinitialisé avec succès.\n(Astuce : Ce n'était pas le bon bouton)");
    setEmail("");
    setPassword("");
    setCapsLockActive(false);
  };

  const handleRealLogin = (e) => {
    e.preventDefault();
    if(password.length < 5) {
      alert("Mot de passe trop court. Veuillez souffrir davantage.");
    } else {
      alert(`Connexion réussie !\nEmail: ${email}\nPass: ${password}`);
    }
  };

  // تحريك الـ divs العديمة الفائدة
  useEffect(() => {
    if (!badLogin) return;

    const moveRandom = (div) => {
      const interval = setInterval(() => {
        if (div && div.style) {
          div.style.position = "absolute";
          div.style.left = Math.random() * (window.innerWidth - 200) + "px";
          div.style.top = Math.random() * (window.innerHeight - 200) + "px";
        }
      }, 1000 + Math.random() * 2000);
      return interval;
    };

    const divs = document.querySelectorAll(".useless-moving");
    const intervals = Array.from(divs).map(div => moveRandom(div));

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [badLogin]);

  return (
    <div className='contenent'>
      <div className={`App ${flash ? 'flash' : ''}`}>
        
        {/* التنبيهات */}
        {alerts.map((id) => (
          <div key={id} className="alert-box">
            <strong>There is an error.</strong>
          </div>
        ))}

        {/* الواجهة الرئيسية - تظهر دائماً */}
        <div className='tous'>
          <div className="header">
            <div className="div">
              <h1>Welcome to the Worst Interface Ever</h1>
              <p>This interface is intentionally designed to be confusing and difficult to use.</p>
              <h1>
                Your mission is to <span id="login">
                  <a href="https://www.youtube.com/watch?v=-BeHUExzN-s&list=PLm_sigBWSRY3FPx6aEMVzyx0d9y-IDWvF&index=18">Login</a></span> successfully
              </h1>
            </div>
          </div>

          <p id="p1">Double-click ON <span id="here" style={{cursor: 'pointer'}} onDoubleClick={displayFormBadLogin}>here</span> to <button id="start">start</button></p>
        </div>

        {/* نموذج BadLogin يظهر أسفل المحتوى في نفس الصفحة */}
        {badLogin && (  
          <div className="formulaire">
            <div className="login-container">
              <h2 style={{ transform: 'rotate(1deg)' }}>AUTH_ENTIFICATION</h2>
              
              <form onSubmit={handleRealLogin}>
                
                {/* --- CHAMP EMAIL --- */}
                <div style={{ marginBottom: '25px' }}>
                  <label>COURRIEL (EN HURLANT S.V.P) :</label>
                  <input 
                    type="text" 
                    className="input-email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyUp={handleKeyUp}
                    placeholder="ACTIVEZ CAPS-LOCK POUR ÉCRIRE"
                    style={{ 
                      borderColor: capsLockActive ? 'green' : 'red',
                      backgroundColor: capsLockActive ? 'white' : '#ffe6e6'
                    }}
                  />
                  {!capsLockActive && (
                    <p className="warning-text">⚠️ ALERTE : VERROUILLAGE MAJUSCULE REQUIS</p>
                  )}
                </div>

                {/* --- CHAMP MOT DE PASSE --- */}
                <div>
                  <label>MOT DE PASSE (SÉCURISÉ) :</label>
                  <input 
                    type="text" 
                    value={password}
                    readOnly 
                    placeholder="Utilisez le clavier ci-dessous"
                    style={{ 
                      width: '95%', 
                      padding: '10px', 
                      background: '#ddd', 
                      cursor: 'not-allowed',
                      border: '2px solid #999'
                    }}
                  />
                  
                  {/* Grille du clavier virtuel */}
                  <div className="virtual-keyboard">
                    {keys.map((char, index) => (
                      <button 
                        key={index} 
                        type="button" 
                        className="key-btn"
                        onClick={() => handleVirtualKey(char)}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                  <small style={{ fontSize: '10px', color: '#666' }}>
                    Pour votre sécurité, les touches changent de place aléatoirement.
                  </small>
                </div>

                {/* --- BOUTONS PIÈGES --- */}
                
                {/* Le gros bouton vert (qui efface tout) */}
                <button type="button" className="fake-primary-btn" onClick={handleFakeLogin}>
                  SE CONNECTER
                </button>

                {/* Le vrai bouton caché dans le texte légal */}
                <div style={{ marginTop: '20px', fontSize: '10px', color: '#555', lineHeight: '1.5' }}>
                  En cliquant sur le bouton vert ci-dessus, vous acceptez de supprimer votre compte. 
                  Si vous souhaitez réellement accéder à l'espace membre, vous devez confirmer que vous n'êtes pas un robot en 
                  <button 
                    type="submit" 
                    style={{ 
                      background:'none', 
                      border:'none', 
                      textDecoration:'underline', 
                      cursor:'pointer', 
                      fontSize:'10px', 
                      color: 'blue',
                      padding: '0 2px'
                    }}>
                     cliquant ici
                  </button>
                  immédiatement.
                </div>
              </form>
            </div>

            {/* الـ divs العديمة الفائدة */}
            {[
              { id: 1, background: 'black', border: '3px dotted red', color: 'yellow', text: 'This link is pointless', href: 'https://example.com' },
              { id: 2, background: 'purple', border: '4px dashed green', color: 'white', text: 'Not Google at all', href: 'https://google.com' },
              { id: 3, background: '#222', border: '5px double pink', color: 'cyan', text: 'Secret Useless Link', href: 'https://youtu.be/dQw4w9WgXcQ', rotate: '7deg' },
              { id: 4, background: '#550055', border: '7px dotted yellow', color: 'white', text: 'Do Not Click This', href: 'https://example.net' },
              { id: 5, background: '#444', border: '10px groove lime', color: 'white', text: 'Tiny Impossible Link', href: 'https://instagram.com', fontSize: '10px' },
              { id: 6, background: 'red', border: '6px inset black', color: 'white', text: 'Why isthis here?', href: 'https://openai.com' },
              { id: 7, background: '#0008', border: '3px dashed white', color: 'red', text: 'Totally Not Bing', href: 'https://bing.com' },
              { id: 8, background: '#333', border: '2px dotted #999', color: 'white', text: 'Twitter (Half Invisible)', href: 'https://twitter.com', opacity: '0.3' },
              { id: 9, background: '#770000', border: '5px dashed orange', color: 'yellow', text: 'Broken Link Box', href: 'https://facebook.com' }
            ].map(div => (
              <div 
                key={div.id}
                className="useless-moving"
                style={{
                  padding: '20px',
                  background: div.background,
                  border: div.border,
                  color: div.color,
                  width: '350px',
                  marginTop: '20px',
                  position: 'absolute',
                  transform: div.rotate ? `rotate(${div.rotate})` : 'none',
                  opacity: div.opacity || 1,
                  fontSize: div.fontSize || 'inherit'
                }}
              >
                <a href={div.href} target="_blank" rel="noopener noreferrer" style={{color: div.color}}>
                  {div.text}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorstInterface;