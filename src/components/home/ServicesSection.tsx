import type { ReactNode } from 'react';
import Container from '../common/Container';
import styles from './ServicesSection.module.css';

const services: { title: string; desc: ReactNode; icon: ReactNode }[] = [
  {
    title: 'Deepfake 탐지',
    desc: <>얼굴 합성, 립싱크, 영상 재연.<br />프레임 단위 비일관성 분석으로<br />조작 흔적을 검출합니다.</>,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
        <path d="M12 12 2.1 14.9" />
      </svg>
    ),
  },
  {
    title: 'AI 생성 영상(T2V) 탐지',
    desc: <>Sora, Runway, Kling 등<br />Text-to-Video 생성 영상을 탐지합니다.<br />Deepfake와 별도 엔진으로 구분 분석합니다.</>,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
  },
  {
    title: 'XAI 근거 시각화',
    desc: <>'가짜입니다'로 끝내지 않습니다.<br />의심 프레임과 영역을 히트맵으로<br />시각화해 판단 근거를 제공합니다.</>,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: '분석 기록 조회',
    desc: <>로그인하면 모든 분석 요청 기록을<br />확인할 수 있습니다.<br />결과 리포트 재열람과 기록 관리가 가능합니다.</>,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section id="s3-services" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.secTitle}>우리가 해결합니다</h2>
        </div>
        <div className={styles.grid}>
          {services.map((s) => (
            <div key={s.title} className={styles.card}>
              <div className={styles.icon}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
