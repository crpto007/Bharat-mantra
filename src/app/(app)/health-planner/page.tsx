
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { healthPlanner } from '@/ai/flows/health-planner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, Copy, Mic, Download } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { downloadAsTxt } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

type Goal = 'Lose Weight' | 'Build Muscle' | 'Maintain Fitness';
type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type DietaryPreference = 'Anything' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Paleo';

export default function HealthPlannerPage() {
  const [goal, setGoal] = useLocalStorage<Goal>('health-planner-goal', 'Lose Weight');
  const [fitnessLevel, setFitnessLevel] = useLocalStorage<FitnessLevel>('health-planner-level', 'Beginner');
  const [dietaryPreference, setDietaryPreference] = useLocalStorage<DietaryPreference>('health-planner-diet', 'Anything');
  const [allergies, setAllergies] = useLocalStorage('health-planner-allergies', '');
  const [daysPerWeek, setDaysPerWeek] = useLocalStorage('health-planner-days', [3]);
  const [result, setResult] = useLocalStorage('health-planner-result', '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('health-planner-lang', 'en');
  
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || typeof SpeechRecognition !== 'function') {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Your browser does not support voice recognition.',
      });
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAllergies(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description: 'Could not understand audio. Please try again.',
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, toast, setAllergies]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({ title: 'Copied!', description: 'Plan copied to clipboard.' });
  };

  const handleDownload = () => {
    if (!result) return;
    downloadAsTxt(result, 'health-plan');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    try {
      const response = await healthPlanner({
        goal,
        fitnessLevel,
        dietaryPreference,
        allergies,
        daysPerWeek: daysPerWeek[0],
        language,
      });
      setResult(response.plan);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate your plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Health & Fitness Planner"
        description="Get a personalized weekly workout and diet plan from our AI coach."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Select your primary fitness goal, current fitness level, and dietary preference.<br />
                  2. Use the slider to choose how many days per week you can commit to working out.<br />
                  3. List any food allergies or restrictions you have.<br />
                  4. Click &quot;Generate My Plan&quot;.<br />
                  5. The AI will create a comprehensive, week-long workout and meal plan tailored to your needs.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div className="lg:col-span-1" initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>Tell us about yourself and your goals.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Primary Goal</Label>
                    <Select value={goal} onValueChange={(v: Goal) => setGoal(v)}>
                      <SelectTrigger id="goal" className="bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                        <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                        <SelectItem value="Maintain Fitness">Maintain Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitness-level">Fitness Level</Label>
                    <Select value={fitnessLevel} onValueChange={(v: FitnessLevel) => setFitnessLevel(v)}>
                      <SelectTrigger id="fitness-level" className="bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                   <div className="space-y-2">
                    <Label>Workout Days Per Week: {daysPerWeek[0]}</Label>
                    <Slider
                      value={daysPerWeek}
                      onValueChange={setDaysPerWeek}
                      min={1}
                      max={7}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diet">Dietary Preference</Label>
                    <Select value={dietaryPreference} onValueChange={(v: DietaryPreference) => setDietaryPreference(v)}>
                      <SelectTrigger id="diet" className="bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anything">Anything</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Keto">Keto</SelectItem>
                        <SelectItem value="Paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies or Restrictions</Label>
                    <div className="relative">
                      <Input
                        id="allergies"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g., Peanuts, Dairy, Gluten"
                        className="pr-12 bg-transparent"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={handleMicClick}
                        className="absolute top-0 right-0 h-full w-10"
                      >
                        <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                      </Button>
                    </div>
                  </div>
                  
                   <div className="space-y-3">
                    <Label>Language</Label>
                    <RadioGroup
                      value={language}
                      onValueChange={(value: 'en' | 'hi') => setLanguage(value)}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en" id="lang-en" />
                        <Label htmlFor="lang-en">English</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hi" id="lang-hi" />
                        <Label htmlFor="lang-hi">Hindi</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Dumbbell className="mr-2 h-4 w-4" />}
                    Generate My Plan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div className="lg:col-span-2" initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.2 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Your Personalized Plan</CardTitle>
                    <CardDescription>Your workout and meal plan will appear here.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!result || isLoading}>
                      <Copy className="h-4 w-4" />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!result || isLoading}>
                      <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {result && (
                  <div className="h-[60vh] overflow-y-auto rounded-md border-border/50 bg-black/30 p-4 prose prose-sm max-w-none prose-h3:mt-4 prose-h3:mb-2 prose-ul:mt-0 prose-invert backdrop-blur-sm">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
                {!isLoading && !result && (
                  <div className="flex items-center justify-center h-[60vh] rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your plan will be generated here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
