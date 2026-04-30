import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useContext(AppContext);

  return (
    <header className="header no-print">
      <div></div>
      <button 
        className="icon-btn" 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
}
