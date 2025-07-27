import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const VoiceCommandConsole = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(finalTranscript);
        setCommand(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Unable to process voice input. Please try again.",
          variant: "destructive",
        });
      };
    }
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setCommand('');
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onCommand(command.trim());
    setCommand('');
    setTranscript('');
    setIsProcessing(false);
    
    toast({
      title: "Command Processed",
      description: "Your request is being handled by FileClerkAI",
    });
  };

  const exampleCommands = [
    "Find the signed contract from last October for ACME Corp",
    "Merge the three most recent invoices from Vendor A into one PDF",
    "Summarize all HR onboarding forms signed this month",
    "Show me all compliance documents that need review"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Command Console
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type your command or use voice input..."
              className="pr-24"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!command.trim() || isProcessing}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>

        {isListening && (
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening... Speak your command
            </div>
            {transcript && (
              <div className="mt-2 text-blue-700">
                Transcript: {transcript}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Example Commands:</h4>
          <div className="grid grid-cols-1 gap-2">
            {exampleCommands.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start text-left h-auto p-3 text-xs"
                onClick={() => setCommand(example)}
              >
                "{example}"
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommandConsole;