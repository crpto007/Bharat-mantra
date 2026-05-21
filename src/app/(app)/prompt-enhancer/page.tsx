
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { enhancePromptForChatbot } from '@/ai/flows/prompt-enhancement-for-chatbot';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Mic, Download } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { downloadAsTxt } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function PromptEnhancerPage() {
  const [originalPrompt, setOriginalPrompt] = useLocalStorage('prompt-enhancer-original', '');
  const [enhancedPrompt, setEnhancedPrompt] = useLocalStorage('prompt-enhancer-enhanced', '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('prompt-enhancer-lang', 'en');
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

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
      setOriginalPrompt(transcript);
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
  }, [language, toast, setOriginalPrompt]);
  
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
    if (!enhancedPrompt) return;
    navigator.clipboard.writeText(enhancedPrompt);
    toast({ title: 'Copied!', description: 'Enhanced prompt copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!enhancedPrompt) return;
    downloadAsTxt(enhancedPrompt, 'enhanced-prompt');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a prompt to enhance.',
      });
      return;
    }
    setIsLoading(true);
    setEnhancedPrompt('');
    try {
      const result = await enhancePromptForChatbot({ prompt: originalPrompt, language });
      setEnhancedPrompt(result.enhancedPrompt);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to enhance the prompt. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Prompt Enhancer"
        description="Automatically refine your prompts for better AI output."
      />
      <div className="p-6 pt-0">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Enter a simple or vague prompt into the &quot;Original Prompt&quot; box.<br />
                  2. Click &quot;Enhance Prompt&quot;.<br />
                  3. The AI will use its own knowledge to rewrite your prompt, making it clearer and more specific.<br />
                  4. The improved prompt will appear in the &quot;Enhanced Prompt&quot; box. You can then copy it for use elsewhere.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.2 }}>
              <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
                <CardHeader>
                  <CardTitle>Original Prompt</CardTitle>
                  <CardDescription>Enter the prompt you want to improve.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea
                      id="original-prompt"
                      value={originalPrompt}
                      onChange={(e) => setOriginalPrompt(e.target.value)}
                      placeholder="e.g., write a story"
                      className="h-48 pr-12 bg-transparent"
                      required
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={handleMicClick}
                        className="absolute bottom-2 right-2"
                      >
                        <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.3 }}>
              <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>Enhanced Prompt</CardTitle>
                        <CardDescription>The refined prompt will appear here.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={handleCopy} disabled={!enhancedPrompt}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy Enhanced Prompt</span>
                      </Button>
                       <Button type="button" variant="ghost" size="icon" onClick={handleDownload} disabled={!enhancedPrompt}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download Enhanced Prompt</span>
                      </Button>
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea
                      id="enhanced-prompt"
                      readOnly
                      value={enhancedPrompt}
                      placeholder="The enhanced prompt will appear here..."
                      className="h-48 bg-black/20 backdrop-blur-sm"
                      aria-label="Enhanced Prompt"
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.4 }}>
            <Card className="max-w-md mx-auto bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="flex justify-center pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Enhance Prompt
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
