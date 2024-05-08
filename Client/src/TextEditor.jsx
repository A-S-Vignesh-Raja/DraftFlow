import {useCallback, useEffect,useRef} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'

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

  useEffect(()=>{
    const socket=io("http://localhost:3001")

    return ()=>{
      socket.disconnect()
    }
  },[])
  
  const wrapperref=useCallback((wrapper)=>{
    if(wrapper == null) return

    wrapper.innerHTML = ""
    const editor=document.createElement("div")
    wrapper.append(editor)
    new Quill(editor,{theme:"snow",modules:{toolbar:Tool_Bar_Options}})
  },[])
  
  return (
    <div className='container' ref={wrapperref} ></div>
  )
}
