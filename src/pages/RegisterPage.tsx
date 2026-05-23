import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/common/AuthBackground';
import { useAuthStore } from '../stores/authStore';
import s from '../styles/auth.module.css';
import ls from './LoginPage.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { register, status, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ nickname: name, email, password });
      navigate('/login');
    } catch {
      // Error message is managed by the auth store.
    }
  };

  return (
    <div className={ls.page}>
      <AuthBackground />

      <div className={ls.card}>
        <div className={ls.header}>
          <Link to="/" className={ls.logo}>
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <circle cx="9" cy="12" r="7" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="15" cy="12" r="7" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>
            <span>Solomon AI</span>
          </Link>

          <h1>회원가입</h1>
          <p className={ls.subtitle}>Solomon AI로 영상 분석을 시작하세요</p>
        </div>

        <form className={ls.form} onSubmit={handleSubmit}>
          <div className={s.formGroup}>
            <label htmlFor="name" className={s.formLabel}>이름</label>
            <input
              type="text" id="name" className={s.formInput}
              placeholder="이름을 입력하세요" required
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="email" className={s.formLabel}>이메일</label>
            <input
              type="email" id="email" className={s.formInput}
              placeholder="name@example.com" required
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="password" className={s.formLabel}>비밀번호</label>
            <input
              type="password" id="password" className={s.formInput}
              placeholder="비밀번호를 입력하세요" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className={s.checkboxGroup}>
            <input
              type="checkbox" required
              checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className={s.checkboxLabel}>
              Solomon AI의 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.
            </span>
          </label>

          <button type="submit" className={ls.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? '처리 중...' : '회원가입'}
          </button>
          {error && <p className={ls.subtitle}>{error}</p>}
        </form>

        <div className={s.authFooter}>
          이미 계정을 가지고 계신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
