"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface ProgressTrackerProps {
  currentLine: number
  totalLines: number
  progress: number
}

export function ProgressTracker({ currentLine, totalLines, progress }: ProgressTrackerProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Progress</h3>
            <span className="text-gray-400 text-sm">
              {currentLine + 1} / {totalLines} lines
            </span>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span className="font-medium text-pink-400">{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Mini timeline */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2">
            {Array.from({ length: Math.min(totalLines, 20) }, (_, i) => {
              const lineIndex = Math.floor((i / 20) * totalLines)
              const isCompleted = lineIndex < currentLine
              const isCurrent = lineIndex === currentLine

              return (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    isCompleted ? "bg-green-500" : isCurrent ? "bg-pink-500" : "bg-gray-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  {isCurrent && (
                    <motion.div
                      className="w-full h-full rounded-full bg-pink-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
