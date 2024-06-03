import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/darkly/bootstrap.min.css'; // Dark theme

const Root: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);  

  return (
    <BrowserRouter>
      <div className={theme}>
        <App theme={theme} />
      </div>
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
