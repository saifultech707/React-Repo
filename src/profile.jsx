import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "./store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./profile.css"; // The new colorful CSS

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get("view") === "true";

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetUid, setTargetUid] = useState(uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser && !uid) {
        navigate("/");
        return;
      }
      
      const userId = uid || (currentUser ? currentUser.uid : null);
      if (!userId) {
        setLoading(false);
        return;
      }
      setTargetUid(userId);

      try {
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setMobile(data.mobile || "");
          setPreview(data.picture || null);
          setEmail(data.email || "");
          setCertificateLink(data.certificateLink || "");
          setCvLink(data.cvLink || "");
        } else if (currentUser && !uid) {
          // prefill email if it's the current user's empty profile
          setEmail(currentUser.email || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [uid, navigate]);

  const handleImage = (e) => {
    if (isViewOnly) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCV = (e) => {
    if (isViewOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      alert("দয়া করে ১ মেগাবাইটের (1MB) চেয়ে ছোট সাইজের সিভি (PDF/Image) সিলেক্ট করুন!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCvLink(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (isViewOnly || !targetUid) return;
    try {
      setIsSaving(true);
      await setDoc(doc(db, "profiles", targetUid), {
        name,
        mobile,
        picture: preview,
        email,
        certificateLink,
        cvLink,
      }, { merge: true });

      if (!uid) { // Only dispatch if it's the own profile
        dispatch(
          setProfile({
            name,
            mobile,
            picture: preview,
            email,
            certificateLink,
            cvLink,
          })
        );
      }
      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("প্রোফাইল সেভ করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-container" style={{ color: 'white', fontSize: '20px' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        
        {/* Cover Header */}
        <div className="profile-header">
          <h2 className="header-title">{isViewOnly ? "Teacher Profile" : "Edit Profile"}</h2>
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
        </div>

        {/* Floating Avatar */}
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            {preview ? (
              <img src={preview} alt="Preview" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
            
            {!isViewOnly && (
              <>
                <div className="avatar-upload-btn">Upload Photo</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImage} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="profile-content">
          
          <div className="input-group">
            <label><span className="icon">📝</span> Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="profile-input" 
              readOnly={isViewOnly} 
            />
          </div>

          <div className="input-group">
            <label><span className="icon">📱</span> Mobile Number</label>
            <input 
              type="text" 
              placeholder="e.g. +880 1XXX-XXXXXX" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
              className="profile-input" 
              readOnly={isViewOnly} 
            />
          </div>

          <div className="input-group">
            <label><span className="icon">✉️</span> Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="profile-input" 
              readOnly={isViewOnly} 
            />
          </div>

          <div className="input-group">
            <label><span className="icon">🔗</span> Certificate Link (Optional)</label>
            <input 
              type="url" 
              placeholder="Must include https://" 
              value={certificateLink} 
              onChange={(e) => setCertificateLink(e.target.value)} 
              className="profile-input" 
              readOnly={isViewOnly} 
            />
            {isViewOnly && certificateLink && (
              <a href={certificateLink} target="_blank" rel="noopener noreferrer" className="cert-link">
                <span style={{ fontSize: '18px' }}>📄</span> View Certificate Online
              </a>
            )}
          </div>

          {/* CV Upload / Preview Area */}
          {!isViewOnly ? (
            <div className="input-group" style={{ marginTop: '10px' }}>
              <label><span className="icon">📎</span> Upload CV Document</label>
              <div className="file-upload-wrapper">
                <span style={{ color: '#888', fontSize: '14px', fontWeight: '500' }}>
                  {cvLink ? "CV Selected (Click to change)" : "Click here to upload PDF or Image (Max 1MB)"}
                </span>
                <input 
                  type="file" 
                  accept=".pdf, image/*" 
                  onChange={handleCV} 
                  className="file-upload-input"
                />
              </div>
            </div>
          ) : (
            cvLink && (
              <div className="input-group" style={{ marginTop: '10px' }}>
                <label><span className="icon">📎</span> Attached CV</label>
                <div className="cv-preview-box">
                  {cvLink.startsWith("data:application/pdf") ? (
                    <a href={cvLink} download="CV.pdf" className="cert-link" style={{ background: '#FFF5F3', color: '#FE5D37' }}>
                      <span style={{ fontSize: '18px' }}>📥</span> Download PDF CV
                    </a>
                  ) : (
                    <img src={cvLink} alt="CV" className="cv-image" />
                  )}
                </div>
              </div>
            )
          )}

          {/* Action Button */}
          {!isViewOnly && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="save-btn"
            >
              {isSaving ? "Saving..." : "Save Profile Details"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}