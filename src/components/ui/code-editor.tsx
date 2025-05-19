"use client"

import { useState, useRef, useEffect } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CodeEditorProps {
  value?: string
  onChange?: (code: string | undefined) => void
  language?: string
  onLanguageChange?: (language: string) => void
}

// Define a type for the editor reference
type MonacoEditorRef = {
  setValue: (value: string) => void
  getValue: () => string
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language: initialLanguage = "python",
  onLanguageChange
}: CodeEditorProps) {
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(value || "")
  const [output, setOutput] = useState("No output")
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<MonacoEditorRef | null>(null)

  useEffect(() => {
    // Set language-specific starter code when language changes
    if (!value) {
      let starterCode = ""

      switch (language) {
        case "python":
          starterCode =
            "# Python code here\n\ndef main():\n    print('Hello, World!')\n\nif __name__ == '__main__':\n    main()"
          break
        case "java":
          starterCode =
            '// Java code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
          break
        case "c":
          starterCode =
            '// C code here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
          break
        case "cpp":
          starterCode =
            '// C++ code here\n\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
          break
        case "matlab":
          starterCode = "% MATLAB code here\n\nfunction result = main()\n    disp('Hello, World!');\n    result = 0;\nend"
          break
        default:
          starterCode = ""
      }

      if (editorRef.current && !code) {
        editorRef.current.setValue(starterCode)
        setCode(starterCode)
        if (onChange) onChange(starterCode)
      }
    }
  }, [language, code, value, onChange])

  // Update internal code state when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== code) {
      setCode(value)
      if (editorRef.current) {
        editorRef.current.setValue(value)
      }
    }
  }, [value, code])

  // Update language when initialLanguage prop changes
  useEffect(() => {
    if (initialLanguage !== language) {
      setLanguage(initialLanguage)
    }
  }, [initialLanguage, language])

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor as unknown as MonacoEditorRef
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (onLanguageChange) onLanguageChange(newLanguage)
  }

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || "")
    if (onChange) onChange(newCode)
  }

  const runCode = async () => {
    if (!editorRef.current) return

    setIsRunning(true)
    setOutput("Running...")

    try {
      // In a real implementation, you would send the code to a backend service
      // that can execute Python code and return the result
      // This is a mock implementation
      setTimeout(() => {
        const currentCode = editorRef.current?.getValue() || ""
        if (currentCode.trim() === "") {
          setOutput("No output")
        } else {
          setOutput(`Output of:\n${currentCode}`)
        }
        setIsRunning(false)
      }, 1000)
    } catch (error) {
      setOutput(`Error: ${error}`)
      setIsRunning(false)
    }
  }

  const clearCode = () => {
    if (editorRef.current) {
      editorRef.current.setValue("")
      setCode("")
      setOutput("No output")
      if (onChange) onChange("")
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden border border-gray-800 bg-black">
      <div className="flex items-center justify-between p-2 bg-black border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-gray-700 hover:bg-gray-800">
            <Expand className="h-4 w-4 text-gray-400" />
          </Button>
          {}
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 bg-transparent border-gray-700 text-white">
              <SelectValue placeholder="Language" defaultValue={language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="matlab">MATLAB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={runCode} disabled={isRunning}>
            Run
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={clearCode}>
            Clear
          </Button>
        </div>
      </div>

      <div className="flex" style={{ height: "400px" }}>
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            language={language === "matlab" ? "plaintext" : language === "cpp" ? "cpp" : language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
              },
            }}
            onMount={handleEditorDidMount}
          />
        </div>

        <div className="w-1 bg-gray-800 cursor-col-resize" />

        <div className="w-1/3 bg-black text-white p-4 overflow-auto">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  )
}
