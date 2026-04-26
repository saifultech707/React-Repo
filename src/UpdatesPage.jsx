import { useState } from 'react';

export default function UpdatesPage() {
  const [updatesList, setUpdatesList] = useState([
    {
      id: 1,
      icon: '🌿',
      title: 'New Features Released',
      description: 'We\'ve added powerful new analytics to track your progress.',
      time: '2 days ago',
      count: 0 
    },
    {
      id: 2,
      icon: '✨',
      title: 'Performance Improvements',
      description: 'Dashboard now loads 50% faster than before.',
      time: '1 week ago',
      count: 0
    },
    {
      id: 3,
      icon: '🎉',
      title: 'New UI Design',
      description: 'We\'ve completely redesigned the user interface for better usability.',
      time: '2 weeks ago',
      count: 0
    }
  ]);

  const incrementCount = (id) => {
    const updatedList = updatesList.map((item) => {
      if (item.id === id) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
    setUpdatesList(updatedList);
  };

  // এখানে return এর ভেতরে UI এর ডিজাইন থাকবে
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ marginTop: '50px', fontSize: '16px', color: '#555' }}>Hi jui!</p>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', maxWidth: '600px', lineHeight: '1.2', marginTop: '10px' }}>
        Latest Updates
      </h1>
      <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
        Stay informed about all the latest changes and updates.
      </p>

      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '700px', marginTop: '40px', minHeight: '300px' }}>
        {updatesList.map((update, index) => (
          <div key={update.id} style={{ padding: '20px', borderBottom: index === updatesList.length - 1 ? 'none' : '1px solid #e0e0e0', marginBottom: index === updatesList.length - 1 ? '0' : '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
              <span style={{ fontSize: '24px' }}>{update.icon}</span>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{update.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{update.description}</p>
                <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>{update.time}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={() => incrementCount(update.id)} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                👍 {update.count}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}