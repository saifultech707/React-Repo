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
