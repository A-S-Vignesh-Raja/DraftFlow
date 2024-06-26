/*import {useCallback, useEffect, useState} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'

const Tool_Bar_Options=[
  [{header:[1,2,3,4,5,6,false]}],
  [{font:[]}],
  [{list:"ordered"},{list:"bullet"}],
  ["bold","italic","underline"],
  [{color:[]},{background:[]}],
  [{script:"sub"},{script:"super"}],
  [{align:[]}],
  ["image","blockquote","code-block"],
  ["clean"],
  [{ 'direction': 'rtl' }],
]

export default function TextEditor() {
  const {id:documentId}=useParams()
  const [socket,setSocket]=useState()
  const [quill,setQuill]=useState()

  useEffect(()=>{
    const s=io("http://localhost:3001")
    setSocket(s)

    return ()=>{
      s.disconnect()
    }
  },[])

  useEffect(()=>{
    if(socket == null || quill == null) return 

    socket.once("load-document",document=>{
      quill.setContents(document)
      quill.enable()
    })

    socket.emit('get-document',documentId)

  },[socket,quill,documentId])

  useEffect(()=>{
    if(socket == null || quill==null) return

    const handler = (delta)=>{
      quill.updateContents(delta)
    }
    socket.on('receive-changes',handler)

    return()=>{
      socket.off('receive-changes',handler)
    }
  },[socket,quill])

  
  useEffect(()=>{
    if(socket == null || quill==null) return

    const handler = (delta,oldDelta,source)=>{
      if(source !== 'user') return
      socket.emit("send-changes",delta)
    }
    quill.on('text-change',handler)

    return()=>{
      quill.off('text-change',handler)
    }
  },[socket,quill])
  
  const wrapperref=useCallback((wrapper)=>{
    if(wrapper == null) return

    wrapper.innerHTML = ""
    const editor=document.createElement("div")
    wrapper.append(editor)
    const q= new Quill(editor,{theme:"snow",modules:{toolbar:Tool_Bar_Options},})
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  },[])
  
  return (
    <div className='container' ref={wrapperref} ></div>
  )
}*/

/*
import { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { ReactMediaRecorder } from 'react-media-recorder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons'

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
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit('get-document', documentId)

  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      socket.emit("send-changes", delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOL_BAR_OPTIONS }, })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])

  // Audio recording and streaming
  const handleAudioStop = (blobUrl, blob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
      const audioBuffer = reader.result;
      if (socket) {
        socket.emit("send-audio", audioBuffer);
      }
    };
    setIsRecording(false);
  };

  const handleAudioStart = () => {
    setIsRecording(true);
  };

  useEffect(() => {
    if (socket == null) return;

    const audioHandler = (audioBuffer) => {
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    };

    socket.on("receive-audio", audioHandler);

    return () => {
      socket.off("receive-audio", audioHandler);
    }
  }, [socket]);

  return (
    <div className='container'>
      <div className='editor' ref={wrapperRef}></div>
      <div className="voice-recorder">
        <ReactMediaRecorder
          audio
          onStart={handleAudioStart}
          onStop={handleAudioStop}
          render={({ startRecording, stopRecording }) => (
            <div>
              <button onClick={startRecording} className="voice-button">
                <FontAwesomeIcon icon={faMicrophone} /> Start Recording
              </button>
              <button onClick={stopRecording} className="voice-button">
                <FontAwesomeIcon icon={faStop} /> Stop Recording
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}
  */
/*
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
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const peerConnectionRef = useRef();
  const servers = {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302'
      }
    ]
  };

  useEffect(() => {
    const s = io("http://localhost:3001");
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
    if (peerConnectionRef.current) {
      stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
    }
    socket.emit('start-call', documentId);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    localStreamRef.current.getTracks().forEach(track => track.stop());
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    socket.emit('end-call', documentId);
  };

  useEffect(() => {
    if (socket == null) return;

    const handleCall = async () => {
      peerConnectionRef.current = new RTCPeerConnection(servers);
      remoteStreamRef.current.srcObject = new MediaStream();
      
      peerConnectionRef.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current.srcObject.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, documentId });
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });
      }

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { offer, documentId });
    };

    const handleOffer = async ({ offer }) => {
      peerConnectionRef.current = new RTCPeerConnection(servers);
      remoteStreamRef.current.srcObject = new MediaStream();
      
      peerConnectionRef.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current.srcObject.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, documentId });
        }
      };

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { answer, documentId });
    };

    const handleAnswer = async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = ({ candidate }) => {
      if (candidate && peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on('start-call', handleCall);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('start-call', handleCall);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, documentId]);

  return (
    <div className='container'>
      <div className='editor' ref={wrapperRef}></div>
      <div className="voice-recorder">
        <button onClick={handleStartRecording} className="voice-button">
          <FontAwesomeIcon icon={faMicrophone} /> Start Voice Chat
        </button>
        <button onClick={handleStopRecording} className="voice-button">
          <FontAwesomeIcon icon={faStop} /> Stop Voice Chat
        </button>
      </div>
      <audio ref={remoteStreamRef} autoPlay />
    </div>
  );
}
*/
/* work avura code with webrtc
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
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const peerConnectionRef = useRef();
  const recognitionRef = useRef();
  const servers = {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302'
      }
    ]
  };

  useEffect(() => {
    const s = io("http://localhost:3001");
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
    if (peerConnectionRef.current) {
      stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
    }
    socket.emit('start-call', documentId);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    localStreamRef.current.getTracks().forEach(track => track.stop());
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    socket.emit('end-call', documentId);
  };

  useEffect(() => {
    if (socket == null) return;

    const handleCall = async () => {
      peerConnectionRef.current = new RTCPeerConnection(servers);
      remoteStreamRef.current.srcObject = new MediaStream();
      
      peerConnectionRef.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current.srcObject.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, documentId });
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });
      }

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { offer, documentId });
    };

    const handleOffer = async ({ offer }) => {
      peerConnectionRef.current = new RTCPeerConnection(servers);
      remoteStreamRef.current.srcObject = new MediaStream();
      
      peerConnectionRef.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current.srcObject.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, documentId });
        }
      };

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { answer, documentId });
    };

    const handleAnswer = async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = ({ candidate }) => {
      if (candidate && peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on('start-call', handleCall);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('start-call', handleCall);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, documentId]);

  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          quill.insertText(quill.getLength(), event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className='container'>
      <div className='editor' ref={wrapperRef}></div>
      <div className="voice-recorder">
        <button onClick={handleStartRecording} className="voice-button">
          <FontAwesomeIcon icon={faMicrophone} /> Start Voice Chat
        </button>
        <button onClick={handleStopRecording} className="voice-button">
          <FontAwesomeIcon icon={faStop} /> Stop Voice Chat
        </button>
        <button onClick={handleStartListening} className="voice-button" disabled={isListening}>
          <FontAwesomeIcon icon={faMicrophone} /> Start Speech Recognition
        </button>
        <button onClick={handleStopListening} className="voice-button" disabled={!isListening}>
          <FontAwesomeIcon icon={faStop} /> Stop Speech Recognition
        </button>
      </div>
      <audio ref={remoteStreamRef} autoPlay />
    </div>
  );
}
*/
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
  const localStreamRef = useRef();
  const audioRefs = useRef({});
  const recognitionRef = useRef();

  useEffect(() => {
    const s = io("http://localhost:3001");
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
    socket.emit('start-call', { documentId });

    // Broadcast the audio stream to other users
    stream.getTracks().forEach(track => {
      socket.emit('broadcast-track', { documentId, track: track });
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    socket.emit('end-call', { documentId });
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on('broadcast-track', ({ documentId, track }) => {
      if (!audioRefs.current[documentId]) {
        audioRefs.current[documentId] = new Audio();
        audioRefs.current[documentId].autoplay = true;
      }
      audioRefs.current[documentId].srcObject = new MediaStream([track]);
    });

    socket.on('end-call', ({ documentId }) => {
      if (audioRefs.current[documentId]) {
        audioRefs.current[documentId].srcObject = null;
      }
    });

    return () => {
      socket.off('broadcast-track');
      socket.off('end-call');
    };
  }, [socket]);

  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
        const delta = { ops: [{ insert: finalText }] };
        socket.emit('send-changes', delta);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className='container'>
      <div className='editor' ref={wrapperRef}></div>
      <div className="voice-recorder">
        <button onClick={handleStartRecording} className="voice-button">
          <FontAwesomeIcon icon={faMicrophone} /> Start Voice Chat
        </button>
        <button onClick={handleStopRecording} className="voice-button">
          <FontAwesomeIcon icon={faStop} /> Stop Voice Chat
        </button>
        <button onClick={handleStartListening} className="voice-button" disabled={isListening}>
          <FontAwesomeIcon icon={faMicrophone} /> Start Speech Recognition
        </button>
        <button onClick={handleStopListening} className="voice-button" disabled={!isListening}>
          <FontAwesomeIcon icon={faStop} /> Stop Speech Recognition
        </button>
      </div>
      <div>
        {Object.keys(audioRefs.current).map(documentId => (
          <audio key={documentId} ref={audio => audioRefs.current[documentId] = audio} autoPlay />
        ))}
      </div>
    </div>
  );
}
