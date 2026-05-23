import Navbar from '../components/common/Navbar';
import Container from '../components/common/Container';
import styles from './ContactPage.module.css';

const members = [
  { name: '권민재', email: '#', github: '#' },
  { name: '김지혁', email: '#', github: '#' },
  { name: '백현종', email: '#', github: '#' },
  { name: '신채은', email: '#', github: '#' },
  { name: '조민수', email: '#', github: '#' },
];

function TeamIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="36" fill="var(--accent-blue)" />
      <circle cx="36" cy="26" r="9" fill="white" />
      <circle cx="20" cy="30" r="7" fill="white" opacity="0.8" />
      <circle cx="52" cy="30" r="7" fill="white" opacity="0.8" />
      <path d="M36 37c-10 0-17 5-17 11h34c0-6-7-11-17-11Z" fill="white" />
      <path d="M20 37c-8 0-13 4-13 9h13v-1c0-3 1-5.5 3-7.5-1-.3-2-.5-3-.5Z" fill="white" opacity="0.75" />
      <path d="M52 37c8 0 13 4 13 9H52v-1c0-3-1-5.5-3-7.5 1-.3 2-.5 3-.5Z" fill="white" opacity="0.75" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="27" stroke="var(--accent-blue)" strokeWidth="2" />
      <circle cx="28" cy="21" r="8" stroke="var(--accent-blue)" strokeWidth="2" />
      <path d="M10 46c0-9.94 8.06-18 18-18s18 8.06 18 18" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-light)' }}>
        <Navbar variant="scan" />
      </div>

      <Container>
        <div className={styles.content}>
          <div className={styles.teamSection}>
            <TeamIcon />
            <h1 className={styles.teamName}>
              달팽이질주 <span className={styles.teamNameEn}>SnailRace</span>
            </h1>
            <p className={styles.teamDesc}>딥러닝을 활용한 AI 생성 숏폼 영상 탐지 서비스 개발</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.memberGrid}>
            {members.map((m) => (
              <div key={m.name} className={styles.memberCard}>
                <UserIcon />
                <span className={styles.memberName}>{m.name}</span>
                <div className={styles.memberLinks}>
                  <a href={m.email} className={styles.iconBtn} aria-label="이메일">
                    <EmailIcon />
                  </a>
                  <a href={m.github} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="깃허브">
                    <GitHubIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
