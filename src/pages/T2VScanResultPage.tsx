import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVideoStore } from '../stores/videoStore';
import s from './ScanAnalysisPage.module.css';

/* ── helpers ── */
function scoreToPercent(score?: number | null) {
  if (typeof score !== 'number') return undefined;
  return score > 1 ? score : score * 100;
}

function getT2VProb(result: { t2v_score?: number | null; raw?: unknown } | null): number | undefined {
  const innerRaw = (result?.raw as any)?.raw ?? (result?.raw as any);
  if (innerRaw?.t2v_prob != null) return innerRaw.t2v_prob as number;
  const score = result?.t2v_score;
  if (score == null) return undefined;
  return score > 1 ? score / 100 : score;
}

/* ─── Component ─── */
export default function T2VScanResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const historyVideoId = searchParams.get('videoId');

  const {
    result,
    targetLabel,
    currentVideoId,
    fetchResult,
    resetAnalysis: resetVideoAnalysis,
  } = useVideoStore();

  const [loaded, setLoaded] = useState(false);

  /* 히스토리에서 접근 시 result fetch */
  useEffect(() => {
    if (historyVideoId && !result) {
      fetchResult(historyVideoId).then(() => setLoaded(true)).catch(() => navigate('/'));
    } else if (result) {
      setLoaded(true);
    } else if (!currentVideoId && !historyVideoId) {
      navigate('/');
    }
  }, []);

  if (!loaded || !result) {
    return (
      <div className={s.page} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading…</span>
      </div>
    );
  }

  // result.raw = 전체 Spring Boot 응답, result.raw.raw = T2vAnalysisResponse JSON
  const innerRaw = (result.raw as any)?.raw ?? (result.raw as any);
  const verdict = (result.final_verdict ?? 'UNKNOWN').toUpperCase();
  const isFake = verdict === 'FAKE';
  const t2vProb = getT2VProb(result);
  const scoreDisplay =
    t2vProb != null ? (t2vProb * 100).toFixed(1) : scoreToPercent(result.t2v_score)?.toFixed(1) ?? 'N/A';
  const modelUsed: string = innerRaw?.model_used ?? 'VideoMAE';
  const targetName = targetLabel ?? 'video_evidence.mov';

  /* evidence */
  const frameImportance: number[] = innerRaw?.evidence?.frame_importance ?? [];
  const segments: any[] = innerRaw?.evidence?.segments ?? [];
  const explanations: string[] = innerRaw?.evidence?.explanations ?? [];

  /* XAI heatmap */
  const heatmapUrl: string =
    result.xai_heatmap_url ||
    innerRaw?.xai_visualization?.heatmaps?.[0]?.overlay_url ||
    innerRaw?.xai_visualization?.heatmaps?.[0]?.heatmap_url ||
    '';

  /* forensic text */
  const forensicText: string = result.xai_text ?? '';

  function handleNewAnalysis() {
    resetVideoAnalysis();
    navigate('/', { replace: true });
  }

  const maxImportance = Math.max(...frameImportance, 0.001);

  return (
    <div className={s.page}>
      {/* ── Header ── */}
      <header className={s.header}>
        <div className={s.logoWrap}>
          <svg className={s.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Solomon AI
        </div>
        <div className={s.headerMeta}>
          <div className={s.metaItem}>
            <span className={s.metaLabel}>Target</span>
            <span className={s.metaValue}>{targetName}</span>
          </div>
          <div className={s.metaItem}>
            <span className={s.metaLabel}>System</span>
            <span className={s.metaValue}>COMPLETED</span>
          </div>
          <div className={s.metaItem}>
            <span className={s.metaLabel}>Engine</span>
            <span className={s.metaValue}>T2V · {modelUsed}</span>
          </div>
        </div>
      </header>

      {/* ── Results ── */}
      <div className={s.viewResults}>

        {/* Results header */}
        <div className={s.resultsHeader}>
          <div>
            <h1 className={s.resultsTitle}>T2V Analysis Report</h1>
            <p className={s.resultsSubtitle}>
              {targetName} • T2V ({modelUsed}) • {heatmapUrl ? 'Attention heatmap available' : 'Analyzed report'}
            </p>
          </div>
          <button className={s.newAnalysisBtn} onClick={handleNewAnalysis}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Run New Analysis
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className={s.dashGrid}>
          <div className={s.statsRow}>
            {/* 01 Verdict */}
            <div className={`${s.statCard} ${isFake ? s.statCardBlue : ''}`}>
              <div className={s.statTop}>
                <span className={`${s.statLabel} ${isFake ? s.statLabelWhite : ''}`}>Verdict</span>
                <span className={`${s.statIndex} ${isFake ? s.statIndexWhite : s.statIndexMuted}`}>01</span>
              </div>
              <div>
                <div className={`${s.statBigValue} ${isFake ? '' : ''}`} style={{ fontSize: '1.25rem', marginBottom: 4 }}>
                  {isFake ? 'CRITICAL' : 'SECURE'}
                </div>
                <div className={s.statBigValue}>{verdict}</div>
                <div className={`${s.statDesc} ${isFake ? '' : s.statDescMuted}`}>
                  {isFake ? 'AI-generated video detected' : 'No AI generation detected'}
                </div>
              </div>
            </div>

            {/* 02 T2V Score */}
            <div className={s.statCard}>
              <div className={s.statTop}>
                <span className={s.statLabel}>T2V Probability</span>
                <span className={`${s.statIndex} ${s.statIndexMuted}`}>02</span>
              </div>
              <div>
                <div className={`${s.statBigValue} ${s.statBigValue4xl}`}>{scoreDisplay}</div>
                <div className={s.statDescMuted}>Generation probability (%)</div>
              </div>
            </div>

            {/* 03 Segments */}
            <div className={s.statCard}>
              <div className={s.statTop}>
                <span className={s.statLabel}>Suspicious Segments</span>
                <span className={`${s.statIndex} ${s.statIndexMuted}`}>03</span>
              </div>
              <div>
                <div className={`${s.statBigValue} ${s.statBigValue4xl}`}>{segments.length}</div>
                <div className={s.statDescMuted}>Detected anomaly regions</div>
              </div>
            </div>

            {/* 04 Confidence */}
            <div className={s.statCard}>
              <div className={s.statTop}>
                <span className={s.statLabel}>System Load / Conf</span>
                <span className={`${s.statIndex} ${s.statIndexMuted}`}>04</span>
              </div>
              <div>
                <div className={`${s.statBigValue} ${s.statBigValue4xl}`}>
                  {t2vProb != null ? (t2vProb >= 0.85 ? 'High' : t2vProb >= 0.5 ? 'Medium' : 'Low') : 'N/A'}
                </div>
                <div className={s.statDescMuted}>Model confidence level</div>
              </div>
            </div>
          </div>

          {/* ── Frame Importance Chart ── */}
          {frameImportance.length > 0 && (
            <div className={s.topoCell}>
              <div className={s.topoHeader}>
                <div>
                  <div className={s.topoSectionLabel}>Temporal Analysis</div>
                  <div className={s.topoTitle}>Frame-by-Frame Importance</div>
                  <div className={s.topoTitleMuted}>Y: IMPORTANCE SCORE &nbsp; X: FRAME INDEX</div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {modelUsed} · ATTENTION ROLLOUT
                </div>
              </div>
              <div className={s.topoAxisLabels}>
                <span className={s.topoAxisY}>1.0</span>
                <span className={s.topoAxisY} style={{ marginTop: 'auto' }}>0.0</span>
              </div>
              <div className={s.topoContainer}>
                {frameImportance.map((imp, i) => {
                  const h = Math.max(4, Math.min(95, (imp / maxImportance) * 100));
                  const isHigh = imp >= 0.5;
                  return (
                    <div
                      key={i}
                      className={`${s.topoBar} ${isHigh ? '' : s.topoBarBlue}`}
                      style={{
                        height: `${h}%`,
                        background: isHigh ? 'var(--accent-blue)' : undefined,
                        opacity: 0.7 + imp * 0.3,
                      }}
                      title={`Frame ${i}: ${imp.toFixed(3)}`}
                    />
                  );
                })}
              </div>
              <div className={s.topoAxisX}>
                <span>0</span>
                <span>{Math.floor(frameImportance.length / 2)}</span>
                <span>{frameImportance.length}</span>
              </div>
            </div>
          )}

          {/* ── XAI Heatmap / Forensic ── */}
          <div
            style={{
              gridColumn: frameImportance.length > 0 ? 'span 4' : 'span 12',
              background: 'var(--bg-white)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              minHeight: '360px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Advanced Forensic XAI
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>Attention Heatmap</div>
            </div>
            {heatmapUrl ? (
              <img
                src={heatmapUrl.startsWith('/xai') ? `http://ceprj.gachon.ac.kr:60006${heatmapUrl}` : heatmapUrl}
                alt="T2V attention heatmap"
                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '200px' }}
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-subtle)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                No heatmap available
              </div>
            )}
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {forensicText || 'Attention map based on encoder-side spatial attention weights.'}
            </div>
          </div>

          {/* ── Segments ── */}
          {segments.length > 0 && (
            <div
              style={{
                gridColumn: 'span 12',
                background: 'var(--bg-white)',
                padding: '32px',
              }}
            >
              <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>
                Suspicious Segments
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    {['Type', 'Start (s)', 'End (s)', 'Confidence'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.625rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {segments.map((seg, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{seg.type ?? '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{seg.start_timestamp_sec?.toFixed(2) ?? seg.start_frame ?? '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{seg.end_timestamp_sec?.toFixed(2) ?? seg.end_frame ?? '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: (seg.confidence ?? 0) >= 0.7 ? 'var(--accent-blue)' : 'var(--surface-subtle)',
                          color: (seg.confidence ?? 0) >= 0.7 ? '#fff' : 'var(--text-main)',
                          padding: '2px 8px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700
                        }}>
                          {seg.confidence != null ? `${(seg.confidence * 100).toFixed(0)}%` : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Explanations ── */}
          {explanations.length > 0 && (
            <div style={{ gridColumn: 'span 12', background: 'var(--bg-white)', padding: '32px' }}>
              <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>
                Model Explanations
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {explanations.map((exp, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.8rem', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 700, flexShrink: 0 }}>›</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
