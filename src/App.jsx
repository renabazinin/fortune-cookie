import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import leftCookieImage from './assets/Left.png';
import rightCookieImage from './assets/Right.png';
import fortuneData from './data.json';



function App() {
  const navigate = useNavigate();
  const [fortunes] = useState(fortuneData.fortunes); // Replace hardcoded fortunes with the imported data
  const [fortuneText, setFortuneText] = useState('');
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [slider, setSlider] = useState(0.45); // 0 → closed, 1 → open
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [fortuneWidth, setFortuneWidth] = useState(0); // State instead of ref for immediate rendering
  const [draggingHalf, setDraggingHalf] = useState(null); // 'left' or 'right'

  const leftRef = useRef();
  const rightRef = useRef();
  const containerRef = useRef();

  
  useEffect(() => {
    // Fetch navigation configuration from GitHub raw
    fetch('https://raw.githubusercontent.com/renanbazinin/justRepoForRawThings/refs/heads/main/nav.json')
      .then(response => response.json())
      .then(navConfig => {
        const destinationUrl = navConfig.dest;
        if (destinationUrl) {
          console.log('Redirecting to:', destinationUrl);
          window.location.href = destinationUrl;
        } else {
          //navigate('/CV');
          console.warn('No destination URL found in navConfig, we defaulting..');
        }
      })
      .catch(error => {
        console.error('Failed to fetch navigation config:', error);
        //navigate('/CV');
        console.warn('Using default navigation due to fetch error');
      });
  }, [navigate]);

  // pick a random fortune on mount
  useEffect(() => {
    nextFortune();
  }, []);

  const nextFortune = () => {
    if (fortunes.length === 0) return; // Guard clause if fortunes aren't available

    setFortuneText(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  };

  // measure cookie half size
  useEffect(() => {
    const measure = () => {
      if (!leftRef.current) return;
      const { width, height } = leftRef.current.getBoundingClientRect();
      setDims({ width, height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Calculate max fortune strip width whenever dims change
  useEffect(() => {
    if (dims.width === 0) return;

    const baseShift = dims.width * 0.135;
    const openMovement = dims.width * 0.73;

    const maxGapWidth = Math.floor(2 * (baseShift + openMovement) - 0.28 * dims.width);

    setFortuneWidth(maxGapWidth);

    setTimeout(() => {
      setFortuneWidth(maxGapWidth);
    }, 100);
  }, [dims]);

  // when slider changes, update transforms
  useEffect(() => {
    if (dims.width === 0) return;

    const baseShift = dims.width * 0.135;
    const openMovement = dims.width * 0.73;

    const currentTotalShift = baseShift + slider * openMovement;

    if (leftRef.current) {
      leftRef.current.style.transform =
        `translate(-50%,-50%) translateX(${-currentTotalShift}px)`;
    }
    if (rightRef.current) {
      rightRef.current.style.transform =
        `translate(-50%,-50%) translateX(${currentTotalShift}px)`;
    }

    if (slider >= 1 && !isOpen) {
      setIsOpen(true);
    }
  }, [slider, dims, isOpen]);

  const handleSlider = e => {
    const val = parseFloat(e.target.value);
    setSlider(val);
  };

  const handleReset = () => {
    setIsOpen(false);
    setSlider(0.45);
    nextFortune();
  };

  const handleDragStart = (e, half) => {
    setIsDragging(true);
    setDraggingHalf(half);

    const pageX = e.touches ? e.touches[0].pageX : e.pageX;
    setDragStartX(pageX);

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragMove = (e) => {
    if (!isDragging || dims.width === 0) return;

    const pageX = e.touches ? e.touches[0].pageX : e.pageX;
    const deltaX = pageX - dragStartX;

    const effectiveDelta = draggingHalf === 'left' ? -deltaX : deltaX;

    const sensitivity = 0.005;
    const newSliderValue = Math.max(0.45, Math.min(1, slider + (effectiveDelta * sensitivity)));

    if (newSliderValue !== slider) {
      setSlider(newSliderValue);
      setDragStartX(pageX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (slider > 0.5) {
      setSlider(1);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, slider, dims.width, dragStartX]);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <h1 style={{ marginBottom: '15px' }}>Fortune Cookie</h1>

      <div 
        className="fortune-cookie-container" 
        ref={containerRef}
        style={{ 
          position: 'relative',
          height: '300px',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img
          ref={leftRef}
          src={leftCookieImage}
          alt="Left cookie half"
          className="cookie-half"
          style={{
            position: 'absolute',
            maxWidth: '180px',
            width: '40%',
            height: 'auto',
            zIndex: 2,
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onMouseDown={(e) => handleDragStart(e, 'left')}
          onTouchStart={(e) => handleDragStart(e, 'left')}
        />
        <img
          ref={rightRef}
          src={rightCookieImage}
          alt="Right cookie half"
          className="cookie-half"
          style={{
            position: 'absolute',
            maxWidth: '180px',
            width: '40%',
            height: 'auto',
            zIndex: 2,
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onMouseDown={(e) => handleDragStart(e, 'right')}
          onTouchStart={(e) => handleDragStart(e, 'right')}
        />

        {dims.width > 0 && (
          <div
            className="fortune-strip"
            style={{
              width: `${fortuneWidth}px`,
              maxWidth: `${fortuneWidth}px`,
              height: 'auto',
              minHeight: '40px',
              padding: '8px',
              zIndex: 1,
              position: 'absolute',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '3px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              lineHeight: '1.3' 
            }}>{fortuneText}</p>
          </div>
        )}
      </div>

      <div className="slider-container" style={{ 
        margin: '5px auto',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '80%',
        maxWidth: '400px'
      }}>
        <label 
          htmlFor="open-slider" 
          style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            minWidth: '60px'
          }}
        >
          Open:
        </label>
        <input
          id="open-slider"
          type="range"
          min="0.45"
          max="1"
          step="0.01"
          value={slider}
          onChange={handleSlider}
          style={{
            width: '100%',
            height: '20px'
          }}
        />
      </div>
      
      {isOpen && (
        <button 
          className="reset-button" 
          onClick={handleReset}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Try Another?
        </button>
      )}
    </div>
  );
}

export default App;
