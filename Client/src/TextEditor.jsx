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
