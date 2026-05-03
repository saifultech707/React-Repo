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
  const [cvLink, setCvLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("আপনার সিলেক্ট করা ছবি:", file);

    if (!file) {
      console.log("কোনো ছবি সিলেক্ট করা হয়নি!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
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
  // সিভি সিলেক্ট করার নতুন ফাংশন
  const handleCV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ফায়ারবেস ডাটাবেসের লিমিট আছে, তাই ১ এমবির (1MB) চেয়ে বড় ফাইল হলে ওয়ার্নিং দেবে
    if (file.size > 1048576) {
      alert("দয়া করে ১ মেগাবাইটের (1MB) চেয়ে ছোট সাইজের সিভি সিলেক্ট করুন!");
      e.target.value = ""; // ইনপুট খালি করে দেওয়া হলো
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCvLink(reader.result); // লিংকের বদলে ফাইলের ডেটাটাই এখানে সেভ হয়ে যাবে
    };
    reader.readAsDataURL(file);
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

      <input type="file" accept="image/*" onChange={handleImage} />

      <input
        type="text"
        placeholder="your  name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          width: "300px",
          fontSize: "16px",
        }}
      />

      <input
        type="text"
        placeholder="your mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          width: "300px",
          fontSize: "16px",
        }}
      />
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="file"
        placeholder="cv"
        value={cvLink}
        onChange={(e) => handleCV(e.target.value)}
        style={inputStyle}
      />
      <input
        type="file"
        placeholder="certifiacate"
        value={certificateLink}
        onChange={(e) => setCertificateLink(e.target.value)}
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
