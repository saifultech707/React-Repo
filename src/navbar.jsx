import { useState } from "react";
import { useNavigate } from "react-router-dom";

const items = [
  { id: 1, icon: "⊞", label: "Dashboard", path: "/" },
  { id: 2, icon: "📁", label: "Files", path: "/profile" },
  { id: 3, icon: "💬", label: "Messages", path: "/transition" },
  { id: 4, icon: "⚙️", label: "Settings", path: "/show" },
  { id: 5, icon: "↪", label: "Logout", path: "/navbars" },
];

export default function Navbar() {
  const [active, setActive] = useState(3);
  const navigate = useNavigate();

  return (
    <div>
      <div className="menu">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              navigate(item.path);
            }}
            className={"link " + (active === item.id ? "active" : "")}
          >
            <span>{item.icon}</span>

            <span className="link-title">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
