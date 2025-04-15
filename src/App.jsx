import { useState } from 'react'
import TiptapEditor from './components/TiptapEditor'

function App() {
  const [content, setcontent] = useState(``)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Rich Blog Editor</h1>
      <TiptapEditor mode='write' content={content} onContentChange={setcontent} />
    </div>
  )
}

export default App