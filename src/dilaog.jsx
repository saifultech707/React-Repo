import { useState, useRef } from "react";
import './Dialog.css';

export default function SlideDialog({ isOpen, closeDialog }) {
  const fileInputRef = useRef(null);
  
  // স্টেটগুলো
  const [selectedFileName, setSelectedFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // ফাইলের প্রিভিউ লিংকের জন্য
  const [fileType, setFileType] = useState(null); // ফাইলটি ইমেজ নাকি ভিডিও তা বোঝার জন্য

  const handleClose = () => {
    // মেমরি লিক এড়ানোর জন্য তৈরি করা টেম্পোরারি URL রিমুভ করা
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFileName("");
    setPreviewUrl(null);
    setFileType(null);
    closeDialog();
  };

  if (!isOpen) return null;

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setFileType(file.type); // ফাইলের টাইপ সেভ করা (যেমন: image/png বা video/mp4)
      
      // ফাইলের একটি লোকাল টেম্পোরারি URL তৈরি করা
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>Upload File ⬆️</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        
        {/* ================= প্রিভিউ সেকশন ================= */}
        <div style={{ 
          width: '100%', 
          minHeight: previewUrl ? 'auto' : '150px',
          background: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: previewUrl ? '10px' : '20px',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          
          {/* যদি ফাইল সিলেক্ট করা হয় */}
          {previewUrl ? (
            <>
              {/* ফাইল যদি ইমেজ হয় */}
              {fileType && fileType.startsWith('image/') && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }} 
                />
              )}
              
              {/* ফাইল যদি ভিডিও হয় */}
              {fileType && fileType.startsWith('video/') && (
                <video 
                  src={previewUrl} 
                  controls 
                  style={{ width: '100%', maxHeight: '250px', borderRadius: '8px', outline: 'none' }} 
                />
              )}

              {/* ফাইল যদি ইমেজ বা ভিডিও না হয়ে অন্য কিছু হয় (যেমন PDF) */}
              {fileType && !fileType.startsWith('image/') && !fileType.startsWith('video/') && (
                <div style={{ textAlign: 'center', color: '#333' }}>
                  <span style={{ fontSize: '40px' }}>📄</span>
                  <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{selectedFileName}</p>
                </div>
              )}
            </>
          ) : (
            /* যদি কোনো ফাইল সিলেক্ট করা না থাকে */
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <span style={{ fontSize: '30px' }}>📁</span>
              <p style={{ marginTop: '10px' }}>No file selected yet.</p>
            </div>
          )}

        </div>
        {/* ================= প্রিভিউ সেকশন শেষ ================= */}

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
          accept="image/*, video/*" // শুধু ছবি এবং ভিডিও সাপোর্ট করবে
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={handleClose}
          >
            Cancel
          </button>
          
          <button 
            style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={handleButtonClick}
          >
            {previewUrl ? "Change File" : "Select File"}
          </button>
        </div>

      </div>
    </div>
  );
}