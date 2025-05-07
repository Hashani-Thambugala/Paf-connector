import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for SPA navigation

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>Skill Sharing</h1>
        </div>
        <nav style={styles.nav}>
          <Link to="/posts" style={styles.navLink}>
            Posts
          </Link>
          <Link to="/courses" style={styles.navLink}>
            Courses
          </Link>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1a1a2e', // Darker, modern background
    color: '#ffffff',
    padding: '20px 25px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    position: 'sticky', // Sticky header for better UX
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Responsive wrapping
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '1px',
    fontFamily: "'Poppins', sans-serif", // Modern font
  },
  nav: {
    display: 'flex',
    gap: '20px', // Spacing between links
    alignItems: 'center',
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s, color 0.3s', // Smooth hover effect
    fontFamily: "'Roboto', sans-serif",
  },
  navLinkHover: {
    backgroundColor: '#007bff', // Hover background
    color: '#ffffff',
  },
  // Media query equivalent using inline styles for responsiveness
  '@media (maxWidth: 768px)': {
    container: {
      flexDirection: 'column',
      gap: '10px',
    },
    nav: {
      flexDirection: 'column',
      gap: '10px',
      width: '100%',
      textAlign: 'center',
    },
    navLink: {
      width: '100%',
      padding: '10px',
    },
  },
};

// Apply hover effects using a simple event handler approach
const HeaderWithHover = () => {
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.navLinkHover.backgroundColor;
    e.target.style.color = styles.navLinkHover.color;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#ffffff';
  };

  return (
    <Header
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default HeaderWithHover;