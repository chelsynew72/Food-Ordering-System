import useServerWakeUp from '../hooks/useServerWakeUp';

const WakeUpBanner = () => {
  const { waking } = useServerWakeUp();

  if (!waking) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1A1A2E',
      color: 'white',
      padding: '12px 24px',
      borderRadius: 50,
      fontSize: 13,
      fontWeight: 600,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <span style={{
        width: 10, height: 10,
        borderRadius: '50%',
        background: '#009DE0',
        display: 'inline-block',
        animation: 'pulse 1s infinite',
      }} />
       Server is waking up, please wait...
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default WakeUpBanner;
