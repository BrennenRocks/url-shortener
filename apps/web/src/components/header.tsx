import { ModeToggle } from './mode-toggle';

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-end px-2 py-1">
      <ModeToggle />
    </div>
  );
}
