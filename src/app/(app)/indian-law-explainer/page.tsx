
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { simplifyIndianLaw } from '@/ai/flows/indian-law-simplification';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Loader2, Mic } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { downloadAsTxt } from '@/lib/utils';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function IndianLawExplainerPage() {
  const [topic, setTopic] = useLocalStorage('law-explainer-topic', '');
  const [targetLanguage, setTargetLanguage] = useLocalStorage<'en' | 'hi'>('law-explainer-lang', 'en');
  const [explanation, setExplanation] = useLocalStorage('law-explainer-explanation', '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
    recognition.lang = targetLanguage;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
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
  }, [targetLanguage, toast, setTopic]);

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
    navigator.clipboard.writeText(explanation);
    toast({ title: 'Copied!', description: 'Explanation copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!explanation) return;
    downloadAsTxt(explanation, 'indian-law-explanation');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a law or topic to explain.',
      });
      return;
    }
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await simplifyIndianLaw({ topic, targetLanguage });
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to explain the topic. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Indian Law Explainer"
        description="Get detailed explanations for any Indian law, rule, or legal topic in English or Hindi."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Enter the name of any Indian law, legal act, or rule into the topic field.<br />
                  2. Select your preferred language for the explanation (English or Hindi).<br />
                  3. Click &quot;Explain Topic&quot;.<br />
                  4. The AI will provide a fully detailed and comprehensive explanation of the topic in simple, easy-to-understand language.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Legal Topic</CardTitle>
                <CardDescription>Enter the law or topic you want explained.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="legal-topic">Law, Act, or Topic</Label>
                    <div className="relative">
                      <Input
                        id="legal-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Right to Information Act, 2005"
                        required
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
                    <Label>Target Language</Label>
                    <RadioGroup
                      value={targetLanguage}
                      onValueChange={(value: 'en' | 'hi') => setTargetLanguage(value)}
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Explain Topic'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.2 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                      <CardTitle>Detailed Explanation</CardTitle>
                      <CardDescription>The detailed explanation will appear here.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!explanation}>
                          <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!explanation}>
                          <Download className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {explanation && (
                  <Textarea
                    readOnly
                    value={explanation}
                    className="h-80 text-sm whitespace-pre-wrap bg-black/20 backdrop-blur-sm"
                    aria-label="Detailed Explanation"
                  />
                )}
                {!isLoading && !explanation && (
                  <div className="flex items-center justify-center h-40 rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your explanation will be generated here.</p>
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
