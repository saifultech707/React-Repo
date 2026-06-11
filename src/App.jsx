import Dashboard from "./dashboard";
import { Route, Routes } from "react-router-dom";

import Classes from "./Classes";
import Profile from "./profile";
import Show from "./AdmissionPage";
import Navbars from "./navbars";
import AboutUsPage from "./aboutUsPage";
import AuthForm from "./AuthForm";
import ContactUsPage from "./contactus";
import AdmissionPage from "./AdmissionPage";
import Teachers from "./Teachers";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-padding {
            padding-left: 15px !important;
            padding-right: 15px !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
            box-sizing: border-box !important;
            width: 100% !important;
          }
          .mobile-padding-inner {
            padding: 15px !important;
            box-sizing: border-box !important;
            width: 100% !important;
          }
          h1 { font-size: 24px !important; line-height: 1.3 !important; }
          h2 { font-size: 20px !important; line-height: 1.3 !important; }
          h3 { font-size: 18px !important; line-height: 1.3 !important; }
          h4 { font-size: 16px !important; }
          
          th, td {
            padding: 8px 10px !important;
            font-size: 13px !important;
          }
          
          input, select, textarea {
            font-size: 14px !important;
          }
          
          .auth-container {
            flex-direction: column !important;
            height: auto !important;
            width: 90% !important;
            min-height: auto !important;
          }
          .sign-in-container {
            padding: 30px 20px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .overlay-container {
            display: none !important;
          }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px 0",
          background: "#e0f2fe",
          width: "100%",
        }}
      >
        {/* <Navbars></Navbars> */}
      </div>
      <div style={{ flex: 1, overflow: "auto", margin: "0", padding: "0" }}>
        <Routes>
          {/* 🟢 ২. ওয়েবসাইট ওপেন করলেই এখন লগইন/সাইন-আপ পেজ (AuthForm) দেখাবে */}
          <Route path="/" element={<AuthForm />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/show" element={<Show />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/navbars" element={<Navbars />} />
          <Route path="/aboutUsPage" element={<AboutUsPage />} />
          <Route path="/contactUsPage" element={<ContactUsPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
