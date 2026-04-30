import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'var(--bg-color)',
      zIndex: 9999
    }}>
      <img 
        src={`${import.meta.env.BASE_URL}logo.png`} 
        alt="Logo" 
        style={{ 
          width: '300px', 
          height: '300px', 
          objectFit: 'contain', 
          filter: 'var(--logo-filter) drop-shadow(0 0 20px rgba(29, 78, 216, 0.4))' 
        }} 
      />
    </div>
  );
}
