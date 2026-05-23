import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "./store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "100%",
    maxWidth: "400px",
    fontSize: "16px",
    backgroundColor: isViewOnly ? "#f5f5f5" : "white",
    color: isViewOnly ? "#555" : "black",
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", gap: "20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "600px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#103741" }}>{isViewOnly ? "Teacher Profile" : "Profile Setup"}</h2>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: "#FE5D37", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Back
        </button>
      </div>

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        />
      ) : (
        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          👤
        </div>
      )}

      {!isViewOnly && (
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Upload Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleImage} style={inputStyle} />
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Name:</label>
        <input type="text" placeholder="Teacher Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} readOnly={isViewOnly} />
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Mobile:</label>
        <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} style={inputStyle} readOnly={isViewOnly} />
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Email:</label>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} readOnly={isViewOnly} />
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Certificate Link:</label>
        <input type="url" placeholder="Must include https://" value={certificateLink} onChange={(e) => setCertificateLink(e.target.value)} style={inputStyle} readOnly={isViewOnly} />
        {isViewOnly && certificateLink && (
          <a href={certificateLink} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "5px", color: "#3b82f6" }}>View Certificate</a>
        )}
      </div>

      {!isViewOnly && (
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{ fontSize: "14px", color: "#666", marginBottom: "5px", display: "block" }}>Upload CV (PDF or Image under 1MB):</label>
          <input type="file" accept=".pdf, image/*" onChange={handleCV} style={inputStyle} />
        </div>
      )}
      
      {isViewOnly && cvLink && (
        <div style={{ width: "100%", maxWidth: "400px", padding: "10px", background: "white", borderRadius: "8px", border: "1px solid #ddd" }}>
          <label style={{ fontSize: "14px", color: "#666", marginBottom: "10px", display: "block" }}>CV Document:</label>
          {cvLink.startsWith("data:application/pdf") ? (
            <a href={cvLink} download="CV.pdf" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "bold" }}>Download PDF CV</a>
          ) : (
            <img src={cvLink} alt="CV" style={{ width: "100%", borderRadius: "5px", border: "1px solid #eee" }} />
          )}
        </div>
      )}

      {!isViewOnly && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "12px 30px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: isSaving ? 0.6 : 1,
            marginTop: "20px",
            width: "100%",
            maxWidth: "400px"
          }}
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      )}
    </div>
  );
}