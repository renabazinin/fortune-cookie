import React, { useEffect, useState } from 'react';
import cvPdf from './CV-RenanBazinin.pdf'; // Import the PDF file directly
import cvJpg from './CV-RenanBazinin_page-0001.jpg'; // Import the JPG version

function CV() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Add/remove class to body element when component mounts/unmounts
  useEffect(() => {
    // Get root element
    const rootElement = document.getElementById('root');
    
    // Add special classes for full-screen viewing
    document.body.classList.add('pdf-viewer-body');
    rootElement.classList.add('pdf-page');
    
    // Clean up function to remove classes when component unmounts
    return () => {
      document.body.classList.remove('pdf-viewer-body');
      rootElement.classList.remove('pdf-page');
    };
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'auto',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      {isMobile ? (
        // For mobile: Display JPG with download option
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px'
        }}>
          <img 
            src={cvJpg} 
            alt="Renan Bazinin CV"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
          
          <a 
            href={cvPdf} 
            download="CV-RenanBazinin.pdf"
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Download PDF Version
          </a>
        </div>
      ) : (
        // For desktop: Use PDF object with fallback
        <object
          data={cvPdf}
          type="application/pdf"
          style={{ 
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            border: 'none'
          }}
        >
          <p style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            It appears your browser doesn't support embedded PDFs.
            <br />
            <a 
              href={cvPdf} 
              download="CV-RenanBazinin.pdf"
              style={{
                display: 'inline-block',
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              Download the PDF
            </a>
          </p>
        </object>
      )}
    </div>
  );
}


export default CV;
