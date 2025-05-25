import React, { useEffect } from 'react';
import cvPdf from './CV-RenanBazinin.pdf'; // Import the PDF file directly

function CV() {
  // Add/remove class to body element when component mounts/unmounts
  useEffect(() => {
    // Get root element
    const rootElement = document.getElementById('root');
    
    // Add special classes for full-screen PDF viewing
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
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0
    }}>
      <object
        data={cvPdf}
        type="application/pdf"
        style={{ 
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <p>
          It appears your browser doesn't support embedded PDFs.
          <a href={cvPdf} download>Click here to download the PDF</a>.
        </p>
      </object>
    </div>
  );
}


export default CV;
