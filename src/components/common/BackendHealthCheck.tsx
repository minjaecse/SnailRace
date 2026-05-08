import { useEffect, useState } from 'react';
import { checkAuthHealth } from '../../lib/api';
import styles from './BackendHealthCheck.module.css';

type HealthState = 'checking' | 'connected' | 'failed';

export default function BackendHealthCheck() {
  const [healthState, setHealthState] = useState<HealthState>('checking');

  useEffect(() => {
    let isMounted = true;

    checkAuthHealth()
      .then((result) => {
        if (!isMounted) return;
        setHealthState(result.status >= 200 ? 'connected' : 'failed');
      })
      .catch(() => {
        if (!isMounted) return;
        setHealthState('failed');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={`${styles.badge} ${styles[healthState]}`} aria-live="polite">
      <span className={styles.dot} />
      {healthState === 'checking' && 'Auth health checking'}
      {healthState === 'connected' && 'Auth health connected'}
      {healthState === 'failed' && 'Auth health failed'}
    </div>
  );
}
