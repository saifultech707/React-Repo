export default function UpdatesPage() {
  return (
    <div style={{ 
      flex: 1, 
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #d1fae5 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <p style={{ marginTop: '50px', fontSize: '16px', color: '#555' }}>Hi jui!</p>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', maxWidth: '600px', lineHeight: '1.2', marginTop: '10px' }}>
        Latest Updates
      </h1>
      <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
        Stay informed about all the latest changes and updates.
      </p>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '700px', 
        marginTop: '40px',
        minHeight: '300px'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e0e0e0', 
          marginBottom: '20px',
          display: 'flex',
          gap: '15px'
        }}>
          <span style={{ fontSize: '24px' }}>🌿</span>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>New Features Released</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>We've added powerful new analytics to track your progress.</p>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>2 days ago</p>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e0e0e0', 
          marginBottom: '20px',
          display: 'flex',
          gap: '15px'
        }}>
          <span style={{ fontSize: '24px' }}>✨</span>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Performance Improvements</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Dashboard now loads 50% faster than before.</p>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>1 week ago</p>
          </div>
        </div>

        <div style={{ 
          padding: '20px',
          display: 'flex',
          gap: '15px'
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>New UI Design</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>We've completely redesigned the user interface for better usability.</p>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>2 weeks ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
