'use client';

import React, { useRef, useState } from 'react';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const transcribeAudioWithWhisper = async (audioBlob: Blob): Promise<string> => {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not set');
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: formData
  });
  if (!response.ok) throw new Error('Failed to transcribe audio');
  const data = await response.json();
  return data.text;
};

const synthesizeSpeechWithOpenAI = async (text: string): Promise<Blob> => {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not set');
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'alloy', // You can use 'alloy', 'echo', 'fable', 'onyx', 'nova', or 'shimmer'
      response_format: 'mp3',
    }),
  });
  if (!response.ok) throw new Error('Failed to synthesize speech');
  const arrayBuffer = await response.arrayBuffer();
  return new Blob([arrayBuffer], { type: 'audio/mp3' });
};

/**
 * VoiceAssistant component handles:
 * - Audio recording
 * - Sending audio to OpenAI Whisper API for transcription
 * - Sending text to OpenAI TTS API for speech synthesis
 */
const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  React.useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    );
  }, []);

  // Start recording audio
  const handleStartRecording = async () => {
    setTranscript('');
    setAudioUrl(null);
    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setTranscript('Audio recording is not supported in this environment.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorder.onstop = handleStopRecording;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop recording and process audio
  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setAudioUrl(URL.createObjectURL(audioBlob));
    try {
      const text = await transcribeAudioWithWhisper(audioBlob);
      setTranscript(text);
    } catch (err) {
      setTranscript('Transcription failed.');
    }
    setIsLoading(false);
  };

  // Stop recording on button click
  const handleStopClick = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSpeak = async () => {
    if (!transcript) return;
    setIsSpeaking(true);
    setTtsAudioUrl(null);
    try {
      const ttsBlob = await synthesizeSpeechWithOpenAI(transcript);
      const url = URL.createObjectURL(ttsBlob);
      setTtsAudioUrl(url);
    } catch (err) {
      setTtsAudioUrl(null);
    }
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow bg-white dark:bg-gray-900 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">AI Voice Assistant</h2>
      <button
        className={`px-4 py-2 rounded text-white font-medium transition-colors ${isRecording ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        onClick={isRecording ? handleStopClick : handleStartRecording}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        tabIndex={0}
        disabled={isLoading || !isSupported}
      >
        {isRecording ? 'Stop Recording' : isLoading ? 'Transcribing...' : 'Start Recording'}
      </button>
      {!isSupported && (
        <div className="text-red-600 text-sm mt-2">Audio recording is not supported in this environment.</div>
      )}
      {audioUrl && (
        <audio controls src={audioUrl} className="w-full mt-2" />
      )}
      {transcript && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded w-full text-sm flex flex-col gap-2">
          <div><strong>Transcript:</strong> {transcript}</div>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white font-medium w-fit self-end disabled:opacity-50"
            onClick={handleSpeak}
            disabled={isSpeaking}
            aria-label="Speak transcript"
            tabIndex={0}
          >
            {isSpeaking ? 'Speaking...' : 'Speak' }
          </button>
          {ttsAudioUrl && (
            <audio controls src={ttsAudioUrl} className="w-full mt-2" autoPlay />
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant; 