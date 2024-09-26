import { useCallback, useEffect, useState, useRef } from 'react';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const TOOL_BAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
  [{ 'direction': 'rtl' }],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default language
  const [isRecognizing, setIsRecognizing] = useState(false); // New state for toggle
  const localStreamRef = useRef();
  const peerConnectionRef = useRef();
  const recognitionRef = useRef();
  const audioRef = useRef();

  const servers = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  };

  const languages = [
    { label: 'English (US)', code: 'en-US' },
    { label: 'Tamil', code: 'ta-IN' },
    { label: 'Hindi', code: 'hi-IN' },
    { label: 'Telugu', code: 'te-IN' },
    { label: 'Malayalam', code: 'ml-IN' },
    { label: 'Spanish', code: 'es-ES' },
    { label: 'French', code: 'fr-FR' },
    { label: 'Japanese', code: 'ja-JP' }
  ];

  useEffect(() => {
    const s = io("https://draftflow.onrender.com");
    //const s=io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", document => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);
  
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit("send-changes", delta);
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOL_BAR_OPTIONS } });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    audioRef.current.srcObject = stream;

    peerConnectionRef.current = new RTCPeerConnection(servers);
    stream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, documentId });
      }
    };

    peerConnectionRef.current.ontrack = event => {
      const [remoteStream] = event.streams;
      audioRef.current.srcObject = remoteStream;
    };

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit('offer', { offer, documentId });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    socket.emit('end-call', documentId);
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on('offer', async ({ offer }) => {
      if (!peerConnectionRef.current) {
        peerConnectionRef.current = new RTCPeerConnection(servers);
      }

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, documentId });
        }
      };

      peerConnectionRef.current.ontrack = event => {
        const [remoteStream] = event.streams;
        audioRef.current.srcObject = remoteStream;
      };

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { answer, documentId });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', ({ candidate }) => {
      if (candidate && peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, documentId]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleStartListening = () => {
    setShowLanguageDropdown(true);
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage; // Use selected language

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }
      if (finalText) {
        const range = quill.getSelection(true);
        quill.insertText(range.index, finalText);
        quill.setSelection(range.index + finalText.length, 0); // Move cursor to end of inserted text
        const delta = { ops: [{ retain: range.index }, { insert: finalText }] };
        socket.emit('send-changes', delta);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsRecognizing(false); // Reset recognizing to false
      setShowLanguageDropdown(false); // Hide dropdown after speech recognition ends
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setIsRecognizing(true); // Set recognizing to true
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsRecognizing(false); // Set recognizing to false
    setShowLanguageDropdown(false); // Hide dropdown when stopping listening
  };

  const toggleSpeechRecognition = () => {
    if (isRecognizing) {
      handleStopListening(); // If recognizing, stop
    } else {
      startSpeechRecognition(); // Otherwise, start
    }
  };

  return (
    <div className='container'>
      <div className='editor' ref={wrapperRef}></div>
      <div className="voice-recorder">
        <button onClick={handleStartRecording} className="voice-button-start">
          <FontAwesomeIcon icon={faMicrophone} /> Start Voice Chat
        </button>
        <button onClick={handleStopRecording} className="voice-button-stop">
          <FontAwesomeIcon icon={faStop} /> Stop Voice Chat
        </button>

        <button onClick={handleStartListening} className="voice-button-speech-on" disabled={isListening}>
          <FontAwesomeIcon icon={faMicrophone} /> Speech Recognition
        </button>

        {showLanguageDropdown && (
          <div className="language-selection-container">
            <select onChange={handleLanguageChange} value={selectedLanguage} className="language-select">
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>

            <button
              className={`voice-button-speech-start ${isListening ? 'active' : ''}`}
              onClick={toggleSpeechRecognition}
            >
              <div className={`switch ${isListening ? 'on' : 'off'}`}></div>
            </button>
          </div>
        )}

      </div>
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
}
