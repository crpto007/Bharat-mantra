
"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { neuralWeaver } from '@/ai/flows/neural-weaver-flow';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Download, BrainCog, Upload, X, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { downloadAsTxt } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const cardVariants = {
  initial: { y: 20, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function NeuralWeaverPage() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [goal, setGoal] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length + selectedFiles.length > 5) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You can upload a maximum of 5 documents in total.",
      });
      return;
    }

    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    const readers = newFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    });

    Promise.all(readers)
      .then(contents => {
        setDocuments(prev => [...prev, ...contents]);
      })
      .catch(error => {
        console.error("Error reading files:", error);
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "There was an error reading one or more files.",
        });
      });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({ title: 'Copied!', description: 'Synthesized content copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!result) return;
    downloadAsTxt(result, 'neural-weaver-output');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length < 2 || !goal.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please upload at least 2 documents and specify a goal.',
      });
      return;
    }
    setIsLoading(true);
    setResult('');
    try {
      const response = await neuralWeaver({ documents, goal, language });
      setResult(response.synthesizedContent);
    } catch (error)
    {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to synthesize content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Neural Weaver"
        description="Synthesize multiple documents into a new, coherent piece of content."
      />
      <div className="p-6 pt-0 space-y-6">
        <motion.div initial="initial" animate="animate" variants={cardVariants}>
          <Accordion type="single" collapsible>
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  1. Upload at least two text documents (.txt, .md, etc.) using the upload button.<br />
                  2. You can upload up to 5 documents in total.<br />
                  3. In the &quot;Goal&quot; field, describe what you want to create from these documents (e.g., &quot;a blog post,&quot; &quot;a summary report,&quot; &quot;an email to the team&quot;).<br />
                  4. Click &quot;Weave Content.&quot; The AI will read all documents and generate a new text that fulfills your goal.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={cardVariants} transition={{ delay: 0.1 }}>
            <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
              <CardHeader>
                <CardTitle>Source Content</CardTitle>
                <CardDescription>Upload the text files you want to synthesize.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Card className="bg-black/30 border-white/10 p-4">
                      <div className="space-y-3">
                        <Label>Uploaded Documents ({selectedFiles.length}/5)</Label>
                        {selectedFiles.length > 0 ? (
                          <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between text-sm bg-background p-2 rounded-md">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center py-4">No documents uploaded.</div>
                        )}
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept=".txt,.md,.text"
                        onChange={handleFileChange}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={selectedFiles.length >= 5}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Files
                      </Button>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <Input
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g., A blog post comparing these sources"
                      required
                      className="bg-transparent"
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCog className="mr-2 h-4 w-4" />}
                    Weave Content
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
                    <CardTitle>Synthesized Output</CardTitle>
                    <CardDescription>The woven content will appear here.</CardDescription>
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
              <CardContent className="h-[42rem] ">
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {result && (
                   <div className="h-full overflow-y-auto rounded-md border-border/50 bg-black/30 p-4 prose prose-sm max-w-none prose-invert backdrop-blur-sm">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
                {!isLoading && !result && (
                  <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-border/50 text-muted-foreground">
                    <p>Your synthesized content will appear here.</p>
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
