import { useState, useEffect } from 'react';
import axios from 'axios';

const useServerWakeUp = () => {
  const [waking, setWaking] = useState(false);
  const [ready,  setReady]  = useState(false);

  useEffect(() => {
    const ping = async () => {
      try {
        setWaking(true);
        await axios.get('/api/health', { timeout: 60000 });
        setReady(true);
      } catch {
        setReady(false);
      } finally {
        setWaking(false);
      }
    };
    ping();
  }, []);

  return { waking, ready };
};

export default useServerWakeUp;
