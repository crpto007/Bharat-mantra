
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contentHumanizer } from '@/ai/flows/content-humanizer';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2, Wand2, Mic, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { downloadAsTxt } from '@/lib/utils';

type OutputLength = 'short' | 'normal' | 'long';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ContentHumanizerPage() {
  const [originalText, setOriginalText] = useLocalStorage('content-humanizer-original', '');
  const [humanizedText, setHumanizedText] = useLocalStorage('content-humanizer-humanized', '');
  const [isLoading, setIsLoading] = useState(false);
  const [humanizeLevel, setHumanizeLevel] = useLocalStorage('content-humanizer-level', [50]);
  const [outputLength, setOutputLength] = useLocalStorage<OutputLength>('content-humanizer-length', 'normal');
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('content-humanizer-lang', 'en');
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
      setOriginalText(transcript);
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
  }, [language, toast, setOriginalText]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter some text to humanize.',
      });
      return;
    }
    setIsLoading(true);
    setHumanizedText('');
    try {
      const result = await contentHumanizer({ 
        text: originalText,
        humanizeLevel: humanizeLevel[0],
        outputLength: outputLength,
        language,
      });
      setHumanizedText(result.humanizedText);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to humanize the text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(humanizedText);
    toast({ title: 'Copied!', description: 'Humanized text copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!humanizedText) return;
    downloadAsTxt(humanizedText, 'humanized-text');
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Content Humanizer"
        description="Make AI-generated text sound more natural and less robotic."
      />
      <div className="p-6 pt-0">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Paste any AI-generated text into the &quot;AI-Generated Text&quot; box.<br />
                  2. Use the slider to set the desired level of humanization.<br />
                  3. Select the desired output length (Short, Normal, or Long).<br />
                  4. Click the &quot;Humanize Text&quot; button.<br />
                  5. The revised text will appear in the &quot;Humanized Text&quot; box on the right.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
            <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
              <div className="space-y-2">
                <Label htmlFor="original-text">AI-Generated Text</Label>
                <div className="relative">
                  <Textarea
                    id="original-text"
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="Paste your AI-generated text here..."
                    className="h-60 pr-12 bg-transparent"
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
              </div>
            </motion.div>
            <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.2 }}>
              <div className="relative space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="humanized-text">Humanized Text</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!humanizedText}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy Humanized Text</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!humanizedText}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Humanized Text</span>
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="humanized-text"
                  readOnly
                  value={humanizedText}
                  placeholder="The natural-sounding text will appear here..."
                  className="h-60 bg-black/20 backdrop-blur-sm"
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
              </div>
            </motion.div>
          </div>

          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.3 }}>
            <Card className="max-w-2xl mx-auto bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Humanization Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Humanize Level: {humanizeLevel[0]}%</Label>
                    <Slider
                      value={humanizeLevel}
                      onValueChange={setHumanizeLevel}
                      max={100}
                      step={10}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Output Length</Label>
                    <RadioGroup
                      value={outputLength}
                      onValueChange={(v: OutputLength) => setOutputLength(v)}
                      className="flex items-center gap-4"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="len-short" />
                        <Label htmlFor="len-short">Short Form</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="len-normal" />
                        <Label htmlFor="len-normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="len-long" />
                        <Label htmlFor="len-long">Long Form</Label>
                      </div>
                    </RadioGroup>
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
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button type="submit" disabled={isLoading} size="lg">
               {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Humanize Text
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
