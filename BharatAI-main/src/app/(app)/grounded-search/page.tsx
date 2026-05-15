
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { groundedSearchSummarization } from '@/ai/flows/grounded-search';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Loader2, Mic } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { downloadAsTxt } from '@/lib/utils';
import { cn } from '@/lib/utils';
import useLocalStorage from '@/hooks/use-local-storage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SummaryResult = {
  summary: string;
}

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function GroundedSearchPage() {
  const [query, setQuery] = useLocalStorage('grounded-search-query', '');
  const [result, setResult] = useLocalStorage<SummaryResult | null>('grounded-search-result', null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('grounded-search-lang', 'en');
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

    recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: { error: any; }) => {
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
  }, [language, toast, setQuery]);
  
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

  const getFullTextResult = () => {
    if (!result) return "";
    return result.summary;
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(getFullTextResult());
    toast({ title: 'Copied!', description: 'Summary copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!result) return;
    downloadAsTxt(getFullTextResult(), 'grounded-search-summary');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please provide a topic to search for.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const response = await groundedSearchSummarization({ query, language });
      query:prompt;
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
const [prompt, setPrompt] = useState("");
  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Knowledge Explorer"
        description="Get AI-powered summaries on any topic."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Enter any topic or question into the input field, or use the microphone to speak.<br />
                  2. Click &quot;Generate Summary&quot;.<br />
                  3. The AI will research the topic and provide a long and detailed summary.<br />
                  4. The results will be displayed in the card on the right.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Topic Input</CardTitle>
                <CardDescription>Enter the topic you want to research.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="query">Topic or Question</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What are the latest advancements in AI?"
                        required
                        className="flex-1 bg-transparent"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={handleMicClick}
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Summary'}
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
                        <CardTitle>Generated Summary</CardTitle>
                        <CardDescription>The AI-generated summary will appear here.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!result}>
                          <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!result}>
                          <Download className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && !result && (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {result && (
                  <Textarea
                      readOnly
                      value={result.summary}
                      className="h-96 text-sm whitespace-pre-wrap bg-black/20 backdrop-blur-sm"
                      aria-label="Generated Summary"
                  />
                )}
                {!isLoading && !result && (
                  <div className="flex items-center justify-center h-96 rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your summary will be generated here.</p>
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
