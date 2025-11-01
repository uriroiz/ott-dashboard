import React from 'react';

function FileUpload({ onFileLoad }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        onFileLoad(event.target.result);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="file-upload">
      <label htmlFor="fileInput">העלה קובץ אקסל:</label>
      <input 
        type="file" 
        id="fileInput" 
        accept=".xlsx,.xls" 
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUpload;

