import ThemeToggle from "../ui/theme-toggle";

export default function TestHeader() {
  return (
    <header className="border-b  py-3 px-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold italic text-foreground">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Evalify
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
