import Head from "next/head";
// Extracted from: https://github.com/react-simple-code-editor/react-simple-code-editor
import {useState, useEffect} from 'react'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; 
import Link from 'next/link'
import { useRouter } from 'next/router'
import {Newline} from './Newline'

var output1 ="";
export default function Home() {
  const [code, setCode] = useState(""); // State to store user code
  const [language, setLanguage] = useState("c"); // State to store selected programming language
  const [stdin, setStdin] = useState(""); // State to store user input for stdin
  const [output, setOutput] = useState(""); // State to store code output
  const router = useRouter()
  const [userId, setUserId] = useState();


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    //console.log(token)

    const fetchData = async () => {
      const options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
      };
      const params = { token: token };
      const url = `/api/users/refresh?${new URLSearchParams(params)}`
      const response = await fetch(url, options)
      const data = await response.json();
      if (response.status != 200) {
          return
      }
      setUserId(data.id);
    }

    if(token != null){
      fetchData()
    }
    //console.log(userId)
  }, []);





  const saveCode = () => {
    // Example function to save code (e.g., downloading as a file)

    router.push({
      pathname: '/templates/create',
      query: { code: code },
  })
  
  };



  const compileCode = async (e) => {
    e.preventDefault();

    console.log(stdin)

      const request = { language: language, code: code, stdin: stdin };

    const response = await fetch('api/compiler', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
  });
  const data = await response.json();
      // @ts-expect-error
      
      
    console.log(output1)
       
       
      output1= data.output
      setOutput(output1)
      
   
  };

  useEffect(() => {
setOutput(output1)
  }),[output1]

  useEffect(() => {
    // console.log(router.query.code)
       if (router.query.code != undefined){
           setCode(router.query.code)
       }
     }, [router.query.code]);



  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Code Editor and Compiler</title>
        <meta name="description" content="Code editor with compile and save functionality" />
      </Head>

      {/* Top Controls */}
      <div className="bg-white shadow p-4 flex items-center justify-between">
        {/* Programming Language Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="language" className="font-medium text-gray-700">
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
  <option value="c">C</option>
  <option value="python">Python</option>
  <option value="cpp">C++</option>
  <option value="javascript">JavaScript</option>
  <option value="java">Java</option>
  <option value="php">PHP</option>
  <option value="ruby">Ruby</option>
  <option value="rust">Rust</option>
  <option value="r">R</option>
  <option value="go">Go</option>
  <option value="perl">Perl</option>
          </select>
        </div>

        {/* Standard Input (stdin) */}
        <div className="flex items-center space-x-2">
          <label htmlFor="stdin" className="font-medium text-gray-700">
            
            
            Stdin:
          </label>
          <input
            id="stdin"
            type="text"
            placeholder="Enter standard input..."
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-64 text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {/* Compile Button */}
          <button
            onClick={compileCode}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Compile
          </button>
          {/* Save Button */}
         {userId && <button
            onClick={saveCode}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Save
          </button>}
        </div>
      </div>

      {/* Split Screen Layout */}
      <main className="flex h-[calc(100vh-64px)]">
        {/* Left: Code Input Area */}
        <section className="w-1/2 bg-gray-100 p-3 border-r border-gray-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Enter Your Code:</h2>


          <Editor
          className="w-full h-full border border-gray-300 rounded-lg p-4 text-gray-700 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
           placeholder="Type your code here..."
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.js)}
      padding={10}
  
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 17,
      }}
    />

        </section>

        {/* Right: Code Output Area */}
        <section className="w-1/2 bg-gray-900 text-white p-3">
          <h2 className="text-lg font-semibold mb-2 text-white-300">Output:</h2>
          <div className="w-full h-full bg-gray-800 rounded-lg p-4 font-mono overflow-auto border border-gray-700 whitespace-pre-wrap">
  {output? (
    <pre>{output}</pre>
  ) : (
    <p className="text-gray-500">Your output will be displayed here...</p>
  )}
</div>

        </section>
      </main>
    </div>
  );
}
