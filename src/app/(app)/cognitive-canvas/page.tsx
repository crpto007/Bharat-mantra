
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cognitiveCanvas } from '@/ai/flows/cognitive-canvas-flow';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Download, PenSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { downloadAsTxt } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

type Result = {
  organizedContent: string;
  suggestions: string;
}

export default function CognitiveCanvasPage() {
  const [rawText, setRawText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: 'Content copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!result) return;
    const fullContent = `## Organized Ideas\n\n${result.organizedContent}\n\n---\n\n## AI Suggestions\n\n${result.suggestions}`;
    downloadAsTxt(fullContent, 'cognitive-canvas-output');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter your ideas or notes to be organized.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await cognitiveCanvas({ rawText, language });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process ideas. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Cognitive Canvas"
        description="Your AI partner for brainstorming and organizing ideas."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Paste all of your raw brainstorming notes, keywords, and ideas into the text area.<br />
                  2. Don't worry about formatting; just dump all your thoughts.<br />
                  3. Click &quot;Organize My Ideas.&quot;<br />
                  4. The AI will structure your thoughts into a clear outline and provide new, related ideas and connections in the output panel.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="h-full bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Idea Dump</CardTitle>
                <CardDescription>Paste all your brainstorming notes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <Textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="New app idea - social media for pets. Users post pics of dogs, cats. AI generates funny captions. Monetization: premium filters, virtual treats. Target audience: millennials. Marketing: partner with pet influencers..."
                    className="h-80 flex-1 bg-transparent"
                    required
                  />
                  <div className="space-y-3 mt-4">
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
                  <Button type="submit" disabled={isLoading} className="w-full mt-6">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                    Organize My Ideas
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.2 }}>
            <Card className="h-full bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle>AI Analysis</CardTitle>
                    <CardDescription>Your organized ideas and new suggestions.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!result}>
                          <Download className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[40rem]">
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {result && (
                   <div className="h-full overflow-y-auto space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">Organized Ideas</h3>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(result.organizedContent)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                         <div className="rounded-md border border-white/10 bg-black/30 p-4 prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown>{result.organizedContent}</ReactMarkdown>
                        </div>
                      </div>
                      <Separator />
                       <div>
                         <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">AI Suggestions</h3>
                           <Button variant="ghost" size="icon" onClick={() => handleCopy(result.suggestions)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="rounded-md border border-white/10 bg-black/30 p-4 prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown>{result.suggestions}</ReactMarkdown>
                        </div>
                      </div>
                   </div>
                )}
                {!isLoading && !result && (
                  <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your analysis will appear here.</p>
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
