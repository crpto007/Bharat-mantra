"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { ArrowRight, CheckCircle } from "lucide-react";

import { categorizedFeatures } from "@/lib/menu-items";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const features =
    categorizedFeatures?.flatMap((c) => c?.features || []) || [];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* GLOW */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

      <div className="container mx-auto grid min-h-screen grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-2 md:py-32">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Image
              src="/icons/logo.png"
              alt="PragyanAI Logo"
              width={80}
              height={80}
              priority
              style={{ height: "auto" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl"
          >
            PragyanAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-lg text-lg text-gray-400 sm:text-xl"
          >
            Transform your scattered notes, complex laws, and raw data into
            clear, actionable intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="text-2xl font-semibold text-white">
            Unlock Your Potential
          </h2>

          <p className="mt-2 text-gray-400">
            From analysis to content creation, PragyanAI has you covered.
          </p>

          <ul className="mt-6 space-y-4">

            {features.slice(0, 5).map((feature, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-400" />

                <span className="text-white/90">
                  {feature?.label || "Feature"}
                </span>
              </motion.li>
            ))}

            <motion.li
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-400" />

              <span className="text-white/90">
                And many more...
              </span>
            </motion.li>

          </ul>
        </motion.div>
      </div>
    </div>
  );
}
