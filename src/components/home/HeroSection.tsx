import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Container from '../common/Container';
import WireframeWave from './WireframeWave';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.text}>
            <h2 className={styles.title}>
              Is That Video Real<span className={styles.dot}>?</span>
            </h2>
            <p className={styles.korSub}>
              딥페이크 영상 여부를 지금 바로 확인하세요.
            </p>
            <p className={styles.desc}>
              영상 파일을 올리면 됩니다.<br />
              기술적인 지식 없이도 누구나, 무료로 바로 사용할 수 있습니다.
            </p>
            <div className={styles.actions}>
              <Button variant="dark" onClick={() => navigate('/')}>
                지금 바로 분석하기
              </Button>
              <Button variant="outline" onClick={() => {
                document.getElementById('s2-problem')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                서비스 소개 보기
              </Button>
            </div>
          </div>

          <div className={styles.graphic}>
            <WireframeWave />
          </div>
        </div>
      </Container>
    </section>
  );
}
