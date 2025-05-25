import React from 'react';
import cvPdf from './CV-RenanBazinin.pdf'; // Import the PDF file directly

function CV() {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <object
        data={cvPdf}
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ maxWidth: '1000px', height: 'calc(100vh - 40px)' }}
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
