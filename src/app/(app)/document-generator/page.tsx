
"use client";

import { useState, useRef, useEffect } from 'react';
import { documentGenerator } from '@/ai/flows/document-generator-flow';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Mic, Download } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { downloadAsTxt } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DocumentGeneratorPage() {
  const [docType, setDocType] = useLocalStorage('doc-gen-type', 'Non-Disclosure Agreement (NDA)');
  const [details, setDetails] = useLocalStorage('doc-gen-details', '');
  const [generatedDoc, setGeneratedDoc] = useLocalStorage('doc-gen-result', '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useLocalStorage<'en' | 'hi'>('doc-gen-lang', 'en');
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
      setDetails(transcript);
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
  }, [language, toast, setDetails]);

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
    navigator.clipboard.writeText(generatedDoc);
    toast({ title: 'Copied!', description: 'Document copied to clipboard.' });
  };
  
  const handleDownload = () => {
    if (!generatedDoc) return;
    downloadAsTxt(generatedDoc, 'generated-document');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please provide some details for the document.',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedDoc('');
    try {
      const result = await documentGenerator({ docType, details, language });
      setGeneratedDoc(result.generatedDoc);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate the document. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title="Contract Assistant"
        description="Generate basic legal contracts, NDAs, and affidavits."
      />
      <div className="p-6 pt-0 space-y-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="how-to-use">
            <AccordionTrigger className="text-lg font-medium">How to use</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                1. Select the type of document you want to generate from the dropdown menu.<br />
                2. In the &quot;Key Details&quot; text area, provide all the necessary information for the document, such as names, dates, terms, and any specific clauses.<br />
                3. Click &quot;Generate Document&quot;. The AI will create a formatted, detailed document based on your input.<br />
                4. Review the generated document on the right. You can then copy it to your clipboard.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Select a document type and provide the key details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Document Type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger id="doc-type" className="bg-transparent">
                      <SelectValue placeholder="Select a document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</SelectItem>
                      <SelectItem value="Simple Service Agreement">Simple Service Agreement</SelectItem>
                      <SelectItem value="Basic Rental Agreement">Basic Rental Agreement</SelectItem>
                      <SelectItem value="Affidavit">Affidavit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Key Details</Label>
                  <div className="relative">
                    <Textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g., Parties involved, effective date, terms, jurisdiction..."
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
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Document'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle>Generated Document</CardTitle>
                <CardDescription>Your AI-drafted document will appear here.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedDoc || isLoading}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!generatedDoc || isLoading}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <div className="h-96 overflow-y-auto rounded-md border-border/50 bg-black/30 p-4 backdrop-blur-sm">
                  {generatedDoc ? (
                      <pre className="whitespace-pre-wrap text-sm font-sans">{generatedDoc}</pre>
                  ) : (
                      !isLoading && (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                              <p>Your document will be generated here.</p>
                          </div>
                      )
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
