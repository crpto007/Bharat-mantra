"use client";

import { categorizedFeatures } from "@/lib/menu-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  const router = useRouter();

  const handleFeatureClick = (href: string) => {
    if (href === "#") return;
    router.push(href);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
      },
    },
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Dashboard"
        description="Your AI-powered toolkit. Choose a feature to get started."
      />
      <div className="container mx-auto max-w-7xl px-6 pb-24 pt-0">
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categorizedFeatures.map((category) => (
            <motion.div key={category.title} variants={cardVariants}>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-white/90">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.features.map((feature) => (
                  <motion.div
                    key={feature.label}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className={
                      feature.href === "#"
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    onClick={() => handleFeatureClick(feature.href)}
                  >
                    <Card
                      className={
                        "h-full bg-card backdrop-blur-xl border shadow-lg hover:border-primary/50 transition-colors duration-300 group"
                      }
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <feature.icon className="h-6 w-6 text-primary" />
                          {feature.badge && (
                            <Badge
                              variant={
                                feature.badge === "New"
                                  ? "default"
                                  : feature.badge === "Pro"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-base font-semibold text-white">
                          {feature.label}
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
