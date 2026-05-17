import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import ProjectsPage from "./ProjectsPage";
import Profile from "./profile";
import Show from "./show";
import Navbars from "./navbars";
import AboutUsPage from "./aboutUsPage";
import AuthForm from "./AuthForm";
import ContactUsPage from "./contactus";

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
        <Navbars></Navbars>
      </div>
      <div style={{ flex: 1, overflow: "auto", margin: "0", padding: "0" }}>
        <Routes>
          {/* 🟢 ২. ওয়েবসাইট ওপেন করলেই এখন লগইন/সাইন-আপ পেজ (AuthForm) দেখাবে */}
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/show" element={<Show />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/navbars" element={<Navbars />} />

          <Route path="/aboutUsPage" element={<AboutUsPage />} />
          <Route path="/contactUsPage" element={<ContactUsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
