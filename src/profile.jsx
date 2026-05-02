import { useState } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "./store";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    dispatch(setProfile({ name, mobile, picture: preview }));
    navigate("/show");
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
        placeholder="তোমার নাম"
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
        placeholder="মোবাইল নম্বর"
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

      <button
        onClick={handleSave}
        style={{
          padding: "12px 30px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Save করো
      </button>
    </div>
  );
}
