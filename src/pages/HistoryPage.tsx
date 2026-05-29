import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import s from './HistoryPage.module.css';
import AuthBackground from '../components/common/AuthBackground';
import { useAuthStore } from '../stores/authStore';
import { useHistoryStore } from '../stores/historyStore';
import type { HistoryRecord } from '../lib/api';

type FilterType = 'All' | 'FAKE' | 'REAL' | 'Processing';

const filters: FilterType[] = ['All', 'FAKE', 'REAL', 'Processing'];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { isAuthenticated } = useAuthStore();
  const { records, isLoading, error, fetchHistory } = useHistoryStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchHistory().catch(() => undefined);
  }, [fetchHistory, isAuthenticated]);

  const historyData = useMemo(() => {
    return records.map(toHistoryView).sort((a, b) => sortRecords(a, b, sortBy));
  }, [records, sortBy]);

  const filtered = historyData.filter((item) => {
    if (activeFilter === 'Processing' && item.status === 'completed') return false;
    if (activeFilter !== 'All' && activeFilter !== 'Processing' && item.result !== activeFilter) return false;
    if (searchQuery && !`${item.title} ${item.date} ${item.type}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const completedRecords = historyData.filter((item) => item.status === 'completed');

  return (
    <div className={s.page}>
      <AuthBackground />
      <header className={s.header}>
        <div className={s.headerInner}>
          <Link to="/" className={s.logo}>
            <svg viewBox="0 0 24 24" fill="none" className={s.logoIcon}>
              <circle cx="9" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="12" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            Solomon AI
          </Link>
          <nav className={s.navLinks}>
            <Link to="/" className={s.navLink}>Scan</Link>
            <Link to="/history" className={`${s.navLink} ${s.navLinkActive}`}>My Records</Link>
            <Link to="/login" className={s.navLink}>Profile</Link>
          </nav>
        </div>
      </header>

      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>My Analysis Records</h1>
            <p className={s.pageSubtitle}>
              {isLoading ? 'Loading your video analysis records...' : 'Check your submitted videos and completed analysis results.'}
            </p>
            {error && <p className={s.errorText}>{error}</p>}
          </div>
          <Link to="/" className={s.scanButton}>New Scan</Link>
        </div>

        {!isAuthenticated ? (
          <EmptyState
            title="Login required"
            message="내 기록은 로그인 후 조회할 수 있습니다."
            action={<Link to="/login" className={s.emptyAction}>Login</Link>}
          />
        ) : (
          <>
            <div className={s.summaryGrid}>
              <div className={s.summaryCard}>
                <div className={s.summaryLabel}>Total Analyses</div>
                <div className={s.summaryValue}>{historyData.length}</div>
              </div>
              <div className={s.summaryCard}>
                <div className={s.summaryLabel}>Completed</div>
                <div className={s.summaryValue}>{completedRecords.length}</div>
              </div>
              <div className={s.summaryCard}>
                <div className={s.summaryLabel}>Avg. Detection Prob.</div>
                <div className={s.summaryValue}>{getAveragePercentage(completedRecords)}</div>
              </div>
            </div>

            <div className={s.controlsBar}>
              <div className={s.filterTabs}>
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`${s.filterTab} ${activeFilter === filter ? s.filterTabActive : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className={s.searchSort}>
                <div className={s.searchInput}>
                  <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search filename or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select className={s.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="prob_high">Highest Score</option>
                  <option value="prob_low">Lowest Score</option>
                </select>
              </div>
            </div>

            {filtered.length ? (
              <div className={s.historyList}>
                {filtered.map((item) => (
                  <Link to={`/scan/analysis?videoId=${encodeURIComponent(item.id)}`} key={item.id} className={s.historyItem}>
                    <div className={s.itemThumb} aria-hidden="true">
                      <div className={s.itemThumbPlaceholder}>{item.type.slice(0, 2)}</div>
                    </div>
                    <div className={s.itemDetails}>
                      <div className={s.itemTitle}>{item.title}</div>
                      <div className={s.itemMeta}>
                        <span>{item.date || 'No date'}</span>
                        <span>{item.type}</span>
                        <span>ID {item.id}</span>
                      </div>
                    </div>
                    <div className={s.itemResult}>
                      <span className={`${s.statusBadge} ${item.status === 'completed' ? s.statusCompleted : s.statusProcessing}`}>
                        {item.statusLabel}
                      </span>
                      <span className={`${s.badge} ${getBadgeClass(item.result)}`}>
                        {item.result === 'UNKNOWN' ? 'WAITING' : item.result}
                      </span>
                      <span className={s.percentage}>{item.percentage || '-'}</span>
                    </div>
                    <span className={s.actionText}>View result</span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title={records.length ? 'No matching records' : 'No records yet'}
                message={records.length ? '검색어나 필터 조건에 맞는 기록이 없습니다.' : '분석을 요청하면 이곳에서 내 기록을 확인할 수 있습니다.'}
                action={<Link to="/" className={s.emptyAction}>Start analysis</Link>}
              />
            )}
          </>
        )}
      </div>

      <div className={s.footer}>
        <span>Solomon AI by RunningSnail</span>
        <a href="#">About</a> &middot;{' '}
        <a href="#">Contact</a> &middot;{' '}
        <a href="#">Blog</a> &middot;{' '}
        <a href="#">FAQ</a>
      </div>
    </div>
  );
}

function EmptyState({ title, message, action }: { title: string; message: string; action: ReactNode }) {
  return (
    <div className={s.emptyState}>
      <div className={s.emptyIcon}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

function toHistoryView(record: HistoryRecord) {
  const status = String(record.status ?? '').toLowerCase();
  return {
    id: record.id,
    title: record.title,
    date: formatDate(record.date),
    dateValue: record.date ? new Date(record.date).getTime() : 0,
    type: record.type ?? 'VIDEO',
    status,
    statusLabel: status ? status.toUpperCase() : 'UNKNOWN',
    result: record.result,
    percentage: record.percentage,
    scoreValue: Number(record.percentage.replace('%', '')),
  };
}

function sortRecords(a: ReturnType<typeof toHistoryView>, b: ReturnType<typeof toHistoryView>, sortBy: string) {
  if (sortBy === 'oldest') return a.dateValue - b.dateValue;
  if (sortBy === 'prob_high') return (b.scoreValue || 0) - (a.scoreValue || 0);
  if (sortBy === 'prob_low') return (a.scoreValue || 0) - (b.scoreValue || 0);
  return b.dateValue - a.dateValue;
}

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getBadgeClass(result: HistoryRecord['result']) {
  if (result === 'FAKE') return s.badgeFake;
  if (result === 'REAL') return s.badgeReal;
  return s.badgePending;
}

function getAveragePercentage(records: ReturnType<typeof toHistoryView>[]) {
  const values = records
    .map((record) => record.scoreValue)
    .filter((value) => Number.isFinite(value));

  if (!values.length) return '-';
  return `${(values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)}%`;
}
