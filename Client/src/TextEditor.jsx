import {useEffect,useRef} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"

export default function TextEditor() {

  const wrapper = useRef()
  
  useEffect(()=>{
    const editor=document.createElement("div")
    wrapper.current.append(editor)
    new Quill(editor,{theme:"snow"})

    return()=>{
      wrapper.innerHTML = ""
    }
  },[])
  
  return (
    <div id='container' ref={wrapper} ></div>
  )
}
