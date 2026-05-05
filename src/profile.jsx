import { useState } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "./store";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [cvLink, setCvLink] = useState(""); // সিভির ডেটা এখানে সেভ হবে
  const [isSaving, setIsSaving] = useState(false);

  // ছবি সিলেক্ট করার ফাংশন
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // সিভি সিলেক্ট করার ফাংশন (সরাসরি ডাটাবেসের জন্য)
  const handleCV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // যেহেতু ডাটাবেসে সেভ হবে, তাই ফাইল ১ এমবির (1MB) ছোট হতে হবে
    if (file.size > 1048576) {
      alert(
        "দয়া করে ১ মেগাবাইটের (1MB) চেয়ে ছোট সাইজের সিভি (PDF/Image) সিলেক্ট করুন!",
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCvLink(reader.result); // ফাইলের ডেটা সরাসরি স্টেটে সেভ
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ফায়ারবেস ডাটাবেসে সেভ করা হচ্ছে
      await setDoc(doc(db, "profiles", "user1"), {
        name,
        mobile,
        picture: preview,
        email,
        certificateLink,
        cvLink,
      });

      dispatch(
        setProfile({
          name,
          mobile,
          picture: preview,
          email,
          certificateLink,
          cvLink,
        }),
      );
      navigate("/show");
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
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        gap: "20px",
      }}
    >
      <h2>Profile Setup</h2>

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          👤
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "5px",
            display: "block",
          }}
        >
          Upload Profile Picture:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={inputStyle}
        />
      </div>

      <input
        type="text"
        placeholder="your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="your mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <label
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "5px",
            display: "block",
          }}
        >
          Upload CV (PDF or Image under 1MB):
        </label>
        <input
          type="file"
          accept=".pdf, image/*"
          onChange={handleCV}
          style={inputStyle}
        />
      </div>

      <input
        type="url"
        placeholder="Certificate Link (must include https://)"
        value={certificateLink}
        onChange={(e) => setCertificateLink(e.target.value)}
        style={inputStyle}
      />

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
        }}
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
