
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { presentationGuide } from '@/ai/flows/presentation-guide';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Presentation, Copy, Mic, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

type Result = { outline: string; script: string; imagePrompts: string[] };
type ActiveTab = 'outline' | 'script' | 'images';

export default function PresentationGuidePage() {
  const [topic, setTopic] = useLocalStorage('pres-guide-topic', '');
  const [audience, setAudience] = useLocalStorage('pres-guide-audience', '');
  const [numberOfSlides, setNumberOfSlides] = useLocalStorage('pres-guide-slides', [10]);
  const [result, setResult] = useLocalStorage<Result | null>('pres-guide-result', null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('pres-guide-lang', 'en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('outline');
  
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
  }, [language, toast, setTopic]);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Content copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!result) return;
    let content = '';
    let filename = `presentation-guide-${activeTab}`;
    if (activeTab === 'outline') {
      content = result.outline;
    } else if (activeTab === 'script') {
      content = result.script;
    } else if (activeTab === 'images') {
      content = result.imagePrompts.join('\n\n');
    }
    downloadAsTxt(content, filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim() || !audience.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please provide a topic and target audience.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await presentationGuide({ topic, audience, numberOfSlides: numberOfSlides[0], language });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate presentation guide. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Presentation Guide"
        description="Generate speech outlines, presentation scripts, and image prompts with tone control."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Enter the topic of your presentation.<br />
                  2. Describe your target audience (e.g., students, investors, colleagues).<br />
                  3. Select the number of slides for the presentation.<br />
                  4. Click &quot;Generate Guide&quot;.<br />
                  5. The AI will produce a structured outline, a full script, and image prompts for your presentation, which you can view in the tabs on the right.<br />
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Presentation Details</CardTitle>
                <CardDescription>Define your topic, audience, and desired tone.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                     <div className="relative">
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The Future of Renewable Energy"
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
                  <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                       <Input
                          id="audience"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          placeholder="e.g., Industry experts, potential clients"
                          required
                          className="bg-transparent"
                      />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Slides: {numberOfSlides[0]}</Label>
                    <Slider
                      value={numberOfSlides}
                      onValueChange={setNumberOfSlides}
                      min={5}
                      max={20}
                      step={1}
                      disabled={isLoading}
                    />
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Presentation className="mr-2 h-4 w-4" />}
                    Generate Guide
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
                      <CardTitle>Generated Guide</CardTitle>
                      <CardDescription>Your presentation outline, script, and image prompts will appear here.</CardDescription>
                  </div>
                   <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!result}>
                      <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {result && (
                  <Tabs defaultValue="outline" onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
                    <TabsList className="w-full grid grid-cols-3 bg-black/30">
                      <TabsTrigger value="outline">Outline</TabsTrigger>
                      <TabsTrigger value="script">Script</TabsTrigger>
                      <TabsTrigger value="images">Image Prompts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="outline">
                      <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex-row items-center justify-between">
                          <CardTitle className="text-lg">Outline</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(result.outline)}>
                            <Copy className="h-4 w-4"/>
                          </Button>
                        </CardHeader>
                        <CardContent className="h-80 overflow-y-auto prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown>{result.outline}</ReactMarkdown>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="script">
                      <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex-row items-center justify-between">
                          <CardTitle className="text-lg">Script</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(result.script)}>
                            <Copy className="h-4 w-4"/>
                          </Button>
                        </CardHeader>
                        <CardContent className="h-80 overflow-y-auto prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown>{result.script}</ReactMarkdown>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="images">
                      <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex-row items-center justify-between">
                          <CardTitle className="text-lg">Image Prompts</CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(result.imagePrompts.join('\n\n'))}>
                            <Copy className="h-4 w-4"/>
                          </Button>
                        </CardHeader>
                        <CardContent className="h-80 overflow-y-auto">
                          <ul className="space-y-4">
                            {result.imagePrompts.map((prompt, index) => (
                              <li key={index} className="text-sm border-l-2 border-primary pl-3 italic text-muted-foreground">
                                {prompt}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
                {!isLoading && !result && (
                  <div className="flex items-center justify-center h-96 rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your guide will be generated here.</p>
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
