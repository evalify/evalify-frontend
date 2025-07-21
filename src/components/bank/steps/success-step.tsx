"use client";

import React from "react";
import { motion } from "framer-motion";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons
import { CheckCircle, Sparkles, ArrowRight, PartyPopper } from "lucide-react";

interface SuccessStepProps {
  onClose: () => void;
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      delay: 0.2,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6,
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  tap: { scale: 0.95 },
};

const confettiVariants = {
  hidden: { opacity: 0, y: -100, rotate: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 100,
    rotate: 360 * (i % 2 === 0 ? 1 : -1),
    transition: {
      delay: i * 0.1,
      duration: 2,
      ease: "easeOut" as const,
    },
  }),
};

export function SuccessStep({ onClose }: SuccessStepProps) {
  return (
    <div className="space-y-8 py-8">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: [
                "#3b82f6", // blue
                "#8b5cf6", // purple
                "#10b981", // green
                "#f59e0b", // yellow
                "#ef4444", // red
                "#06b6d4", // cyan
              ][i % 6],
            }}
          />
        ))}
      </div>

      {/* Success Content */}
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        {/* Success Icon */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            Questions Added Successfully!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your selected questions have been successfully added to the quiz.
            Students can now access these questions during the assessment.
          </p>
        </div>

        {/* Added Count Badge */}

        {/* Success Card */}
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Card className="max-w-md mx-auto border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <PartyPopper className="h-5 w-5" />
                  <span className="font-medium">Process Complete</span>
                </div>

                <div className="text-sm text-green-600 dark:text-green-400 space-y-2">
                  <p>✓ Bank selected and filtered</p>
                  <p>✓ Questions reviewed and chosen</p>
                  <p>✓ Questions added to quiz section</p>
                  <p>✓ Quiz updated successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Button */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          className="pt-4"
        >
          <Button
            onClick={onClose}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
          >
            <span className="flex items-center gap-2">
              Continue to Quiz Builder
              <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground"
        >
          You can add more questions anytime from the quiz builder interface
        </motion.div>
      </motion.div>
    </div>
  );
}
