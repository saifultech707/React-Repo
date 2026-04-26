import { useState } from 'react';

export default function ProjectsPage() {
  const [books, setBooks] = useState(['Clean Code', 'The Pragmatic Programmer']);
  const [bookInput, setBookInput] = useState('');

  const addBook = () => {
    if (bookInput.trim() !== '') {
      setBooks([...books, bookInput]);
      setBookInput('');
    }
  };

  const deleteBook = (index) => {
    const updatedList = books.filter((_, i) => i !== index);
    setBooks(updatedList);
  };

  // আপনি এই return অংশটি দিতে ভুলে গিয়েছিলেন!
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ marginTop: '50px', fontSize: '16px', color: '#555' }}>Hi jui!</p>
      <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#333' }}>Book Library</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', marginTop: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Enter book name..." 
          value={bookInput}
          onChange={(e) => setBookInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }} 
        />
        <button onClick={addBook} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#555' }}>Your Book Collection:</h3>
        {books.length === 0 ? (
          <p style={{ color: '#888' }}>No books added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {books.map((book, index) => (
              <li key={index} style={{ background: 'white', marginBottom: '10px', padding: '12px 15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                <span>{book}</span>
                <button onClick={() => deleteBook(index)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}