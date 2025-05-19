import { Calculator } from "lucide-react"
import ThemeToggle from "./theme-toggle"
interface TestHeaderProps {
  title: string
}

export default function TestHeader({ title }: TestHeaderProps) {
  return (
    <header className="border-b border-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold italic">Gowtham SD</div>
        <div className="text-3xl font-bold tracking-wider">{title}</div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 px-4">
            <Calculator className="h-5 w-5" />
            <span>Calculator</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
