import { useState, useCallback } from 'react';
import { voiceAPI } from '../services/api';
import { useToast } from './use-toast';

export const useVoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const processCommand = useCallback(async (command, sessionId = null, context = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await voiceAPI.processCommand(command, sessionId, context);
      
      toast({
        title: "Command Processed",
        description: result.response,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to process voice command';
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
      
      const result = await voiceAPI.transcribeAudio(audioFile);
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to transcribe audio';
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
      
      const result = await voiceAPI.textToSpeech(text, voice);
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to generate speech';
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
      
      const languages = await voiceAPI.getSupportedLanguages();
      
      return languages;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get supported languages';
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