import { Link } from 'react-router-dom';
import Logo from './Logo';
import Container from './Container';
import styles from './Navbar.module.css';

interface NavbarProps {
  variant?: 'scan' | 'home';
}

export default function Navbar({ variant = 'scan' }: NavbarProps) {
  return (
    <Container>
      <header className={styles.header}>
        <Logo />
        {variant === 'home' ? (
          <>
            <nav className={styles.navCenter}>
              <a href="#s2-problem">About</a>
              <Link to="/contact">Contact</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </nav>
            <nav className={styles.navActions}>
              <Link to="/">Scan</Link>
              <Link to="/login">Login</Link>
            </nav>
          </>
        ) : (
          <nav className={styles.navLinks}>
            <Link to="/home">Home</Link>
            <Link to="/login">Login</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        )}
      </header>
    </Container>
  );
}
