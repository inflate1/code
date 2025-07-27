import { useState, useCallback } from 'react';
import { mockVoiceService } from '../services/mockService';
import { useToast } from './use-toast';

export const useMockVoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const processCommand = useCallback(async (command, sessionId = null, context = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mockVoiceService.processCommand(command, sessionId, context);
      
      toast({
        title: "Command Processed",
        description: result.response,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to process voice command';
      setError(errorMessage);
      toast({
        title: "Command Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const transcribeAudio = useCallback(async (audioFile) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock transcription
      const mockTranscriptions = [
        "Find the signed contract from last October for ACME Corp",
        "Merge the three most recent invoices from Vendor A into one PDF",
        "Summarize all HR onboarding forms signed this month",
        "Show me all compliance documents that need review",
        "Convert this document to PDF format",
        "Send the quarterly report to the team"
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        transcription: mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)],
        confidence: Math.random() * 0.13 + 0.85, // 0.85 to 0.98
        language: "en",
        duration: Math.random() * 5.5 + 2.5, // 2.5 to 8.0 seconds
        processing_time: 1.0
      };
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to transcribe audio';
      setError(errorMessage);
      toast({
        title: "Transcription Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const textToSpeech = useCallback(async (text, voice = 'default') => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock TTS
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = {
        audio_url: `mock_audio_${Date.now()}.mp3`,
        text,
        voice,
        duration: text.length * 0.05, // Rough estimate
        format: "mp3"
      };
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate speech';
      setError(errorMessage);
      toast({
        title: "Speech Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getSupportedLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const languages = {
        transcription: [
          {"code": "en", "name": "English"},
          {"code": "es", "name": "Spanish"},
          {"code": "fr", "name": "French"},
          {"code": "de", "name": "German"},
          {"code": "it", "name": "Italian"},
          {"code": "pt", "name": "Portuguese"},
          {"code": "nl", "name": "Dutch"},
          {"code": "pl", "name": "Polish"}
        ],
        synthesis: [
          {"code": "en", "name": "English", "voices": ["default", "professional", "friendly"]},
          {"code": "es", "name": "Spanish", "voices": ["default", "professional"]},
          {"code": "fr", "name": "French", "voices": ["default", "professional"]},
          {"code": "de", "name": "German", "voices": ["default", "professional"]}
        ]
      };
      
      return languages;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get supported languages';
      setError(errorMessage);
      console.error('Get languages error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    processCommand,
    transcribeAudio,
    textToSpeech,
    getSupportedLanguages
  };
};