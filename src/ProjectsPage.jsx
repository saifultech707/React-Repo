import { useState } from "react";

export default function ProjectsPage() {
  const [books, setBooks] = useState([
    "coach kanchon ",
    "The Pragmatic Programmer",
  ]);
  const [bookInput, setBookInput] = useState("");
  const [saveInput, setSaveInput] = useState("");
  // const addBook = () => {
  //   if (bookInput.trim() !== '') {
  //     setBooks([...books, bookInput]);
  //     setBookInput('');
  //   }
  // };
  const addBook = () => {
    if (bookInput.trim() !== "") {
      (setBooks([...books, bookInput]), setBookInput(""));
    }
  };
  const handleSave = () => {
    if (saveInput.trim() !== "") {
      setBooks([...books, saveInput]);
      setSaveInput("");
    }
  };
  const deleteBook = (index) => {
    const updatedList = books.filter((_, i) => i !== index);
    setBooks(updatedList);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p style={{ marginTop: "50px", fontSize: "16px", color: "#555" }}>
        Hi jui!
      </p>
      <h1 style={{ fontSize: "42px", fontWeight: "bold", color: "#333" }}>
        Book Library
      </h1>

      <div
        style={{
          background: "cyanacent",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "500px",
          marginTop: "30px",
          display: "flex",
          gap: "10px",
        }}
      >
        {/* <input 
          type="text" 
          placeholder="Enter book name..." 
          value={bookInput}
          onChange={(e) => setBookInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #746f6f', outline: 'none' }} 
        />
         */}
        <input
          type="text"
          placeholder="enter book bane"
          value={bookInput}
          onChange={(e) => setBookInput(e.target.value)}
          style={{
            flex: 2,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #2f284b",
            outline: "none",
          }}
        />
        {/* <button onClick={addBook} style={{ background: '#133b7c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add
        </button>
         */}
        <button
          onClick={addBook}
          style={{
            background: "#976262",
            color: "skyblue",
            border: "5px #01aad4",
            padding: "12px 20px",
            borderRadius: "12px",
            corsor: "pointer",
            fontWeight: "bold",
          }}
        >
          {" "}
          Add
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "500px", marginTop: "30px" }}>
        <h3 style={{ marginBottom: "15px", color: "#278883" }}>
          Your book collection
        </h3>
        {books.length === 0 ? (
          <p>কোনো ফল নেই</p>
        ) : (
          <ul>
            {books.map((book, index) => (
              <li
                key={index}
                style={{
                  background: "white",
                  marginBottom: "10px",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
                }}
              >
                <span>{book}</span>
                <button
                  onClick={() => deleteBook(index)}
                  style={{
                    background: "yellow",
                    border: "none",
                    color: "#7588476b",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ width: "40%", maxWidth: "600px", marginTop: "5px" }}>
        button{" "}
        <input
          type="text"
          placeholder="add"
          value={saveInput}
          onChange={(e) => setSaveInput(e.target.value)}
        />
        <button
          onClick={handleSave}
          style={{
            // marginLeft: "10px",
            width: "10%",
            padding: "6px 23px",
            color: "white",
            border: "none",
            // textAlign: "center",
            background: "#976262",
            borderRadius: "3px",
          }}
        >
          save
        </button>
      </div>
      <div style={{ width: "500px", height: "300px" }}>
        <svg viewBox="0 0 600 340" width={"100%"} height={"100%"}>
          <rect width={"600"} height={"340"} fill="#006a4e"  />
          <circle cx={"280"} cy={"170"} r={'100'} fill="#f42a41" />
        </svg>
      </div>
    </div>
  );
}
