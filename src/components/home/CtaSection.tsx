import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.cta}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          지금 바로 확인해보세요<span className={styles.dot}>.</span>
        </h2>
        <div className={styles.tags}>
          <span className={styles.tag}>Deepfake 탐지</span>
          <span className={styles.tag}>T2V 탐지</span>
          <span className={styles.tag}>XAI 시각화</span>
          <span className={styles.tag}>무료 분석</span>
        </div>
        <p className={styles.desc}>
          회원가입하면 분석 기록 저장 · 히스토리 조회까지.
        </p>
        <Button variant="dark" size="large" onClick={() => navigate('/')}>
          영상 분석하러 가기
        </Button>
      </div>
    </section>
  );
}
