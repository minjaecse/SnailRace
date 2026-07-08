import Container from '../common/Container';
import styles from './ProblemSection.module.css';

const stats = [
  { value: '7.2M', label: '하루 720만 개', desc: '2025년 기준 매일 생성되는 AI 영상', highlight: false },
  { value: '550%', label: '550% 증가', desc: '2019년 대비 딥페이크 증가율 (WEF)', highlight: true },
  { value: '96%', label: '96% 비동의', desc: '딥페이크의 96%는 비동의 포르노그래피', highlight: false },
  { value: '50%', label: '정확도 50%', desc: '일반인의 딥페이크 육안 판별 확률', highlight: false },
];

export default function ProblemSection() {
  return (
    <section id="s2-problem" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.secTitle}>문제는 이미 시작됐습니다</h2>
        </div>
        <div className={styles.grid}>
          {stats.map((s) => (
            <div key={s.value} className={styles.card}>
              <div
                className={styles.statValue}
                style={s.highlight ? { color: 'var(--accent-blue)' } : undefined}
              >
                {s.value}
              </div>
              <p>
                <strong>{s.label}</strong>
                <br />
                {s.desc}
              </p>
            </div>
          ))}
          {/* T2V 시장 성장 차트 */}
          <div className={styles.chartWrap}>
            <p className={styles.chartTitle}>Text-to-Video 시장 규모 전망</p>
            <p className={styles.chartSub}>단위: 억 달러(USD) · Source: MarketsandMarkets</p>
            <svg viewBox="0 0 700 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.chartSvg}>
              <line x1="40" y1="10" x2="660" y2="10" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="40" x2="660" y2="40" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="70" x2="660" y2="70" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="100" x2="660" y2="100" stroke="#e5e5e5" strokeWidth="1" />
              {/* 2024: 3.1/11.8*90 = 23.6 */}
              <rect x="80" y="76.4" width="80" height="23.6" fill="#0003FF" opacity="0.2" rx="3" />
              <text x="120" y="72" textAnchor="middle" fontSize="11" fill="#0003FF" opacity="0.7">3.1억</text>
              <text x="120" y="114" textAnchor="middle" fontSize="11" fill="#aaa">2024</text>
              {/* 2026: 8.47/11.8*90 = 64.6 */}
              <rect x="310" y="35.4" width="80" height="64.6" fill="#0003FF" opacity="0.5" rx="3" />
              <text x="350" y="30" textAnchor="middle" fontSize="11" fill="#0003FF" opacity="0.85">8.5억</text>
              <text x="350" y="114" textAnchor="middle" fontSize="11" fill="#aaa">2026</text>
              {/* 2029: 11.8/11.8*90 = 90 */}
              <rect x="540" y="10" width="80" height="90" fill="#0003FF" opacity="0.85" rx="3" />
              <text x="580" y="30" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">11.8억</text>
              <text x="580" y="114" textAnchor="middle" fontSize="11" fill="#aaa">2029</text>
              {/* trend lines */}
              <line x1="160" y1="68" x2="310" y2="43" stroke="#0003FF" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
              <line x1="390" y1="43" x2="540" y2="18" stroke="#0003FF" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
              <text x="465" y="26" textAnchor="middle" fontSize="13" fill="#0003FF" fontWeight="700" opacity="0.85">+281%</text>
            </svg>
          </div>

          {/* 딥페이크 피해 현황 차트 */}
          <div className={styles.chartWrap}>
            <p className={styles.chartTitle}>딥페이크 피해 현황</p>
            <p className={styles.chartSub}>출처: 여성가족부 / 중앙디지털성범죄피해자지원센터, 2024</p>
            <svg viewBox="0 0 700 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.chartSvg}>
              {/* grid lines — left panel */}
              <line x1="40" y1="15" x2="325" y2="15" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="45" x2="325" y2="45" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="75" x2="325" y2="75" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="40" y1="105" x2="325" y2="105" stroke="#e5e5e5" strokeWidth="1" />
              {/* grid lines — right panel */}
              <line x1="375" y1="15" x2="660" y2="15" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="375" y1="45" x2="660" y2="45" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="375" y1="75" x2="660" y2="75" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="375" y1="105" x2="660" y2="105" stroke="#e5e5e5" strokeWidth="1" />
              {/* panel divider */}
              <line x1="350" y1="8" x2="350" y2="112" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 3" />
              {/* left panel label */}
              <text x="182" y="10" textAnchor="middle" fontSize="10" fill="#999">딥페이크 피해 건수</text>
              {/* right panel label */}
              <text x="517" y="10" textAnchor="middle" fontSize="10" fill="#999">10대 피해자 수</text>
              {/* 2023: 423/1384*90 = 27.5 */}
              <rect x="60" y="77.5" width="80" height="27.5" fill="#0003FF" opacity="0.2" rx="3" />
              <text x="100" y="73" textAnchor="middle" fontSize="11" fill="#aaa">423건</text>
              <text x="100" y="120" textAnchor="middle" fontSize="11" fill="#aaa">2023</text>
              {/* 2024: 90px */}
              <rect x="200" y="15" width="80" height="90" fill="#0003FF" opacity="0.85" rx="3" />
              <text x="240" y="35" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">1,384건</text>
              <text x="240" y="120" textAnchor="middle" fontSize="11" fill="#aaa">2024</text>
              {/* trend line left */}
              <line x1="100" y1="77.5" x2="240" y2="18" stroke="#0003FF" strokeWidth="1" strokeDasharray="4 3" opacity="0.25" />
              {/* +227% */}
              <text x="288" y="55" textAnchor="start" fontSize="13" fill="#0003FF" fontWeight="700" opacity="0.85">+227%</text>
              {/* 2018: 111/3052*90 = 3.3 → min 6px */}
              <rect x="390" y="99" width="80" height="6" fill="#0003FF" opacity="0.2" rx="3" />
              <text x="430" y="95" textAnchor="middle" fontSize="11" fill="#aaa">111명</text>
              <text x="430" y="120" textAnchor="middle" fontSize="11" fill="#aaa">2018</text>
              {/* 2024: 90px */}
              <rect x="530" y="15" width="80" height="90" fill="#0003FF" opacity="0.85" rx="3" />
              <text x="570" y="35" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">3,052명</text>
              <text x="570" y="120" textAnchor="middle" fontSize="11" fill="#aaa">2024</text>
              {/* trend line right */}
              <line x1="430" y1="99" x2="570" y2="18" stroke="#0003FF" strokeWidth="1" strokeDasharray="4 3" opacity="0.25" />
              {/* ×27 */}
              <text x="648" y="52" textAnchor="end" fontSize="13" fill="#0003FF" fontWeight="700" opacity="0.85">×27</text>
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
