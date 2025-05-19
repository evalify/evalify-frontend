"use client"

import { Eye } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export interface TimerProps {
  timeLimit: number
}

export default function Timer({ timeLimit }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing interval to prevent duplicates
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set initial time based on the latest timeLimit
    setTimeRemaining(timeLimit * 60)

    // Start the interval
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup on unmount or when effect re-runs
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timeLimit]) // Re-run effect if timeLimit changes

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isTimeLow = timeRemaining < 300

  return (
    <div className={`${isTimeLow ? 'bg-red-900/30 border-red-500/30' : 'bg-gray-800 border-gray-600'} border p-4 flex items-center justify-between rounded-lg m-4`}>
      <Eye className={`h-6 w-6 ${isTimeLow ? 'text-red-400' : 'text-gray-400'}`} />
      <div className="text-2xl font-mono">{formattedTime}</div>
    </div>
  )
}