import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './ui/kibo-ui/theme-switcher';

export default function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-row items-center justify-end px-2 py-1">
      <ThemeSwitcher
        defaultValue="system"
        onChange={setTheme}
        value={theme as 'light' | 'dark' | 'system'}
      />
    </div>
  );
}
