import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from "next/link";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoLinkText from "react-autolink-text2";


export default function Template() {
    const router = useRouter()
    const { id } = router.query
    const [title, setTitle] = useState()
    const [explanation, setExplanation] = useState()
    const [code, setCode] = useState()
    const [user, setUser] = useState()
    const [tags, setTags] = useState()
    const [status, setStatus] = useState()
    const [viewerId, setViewerId] = useState()
    const [visibility, setVisibility] = useState(0)
    const [fork, setFork] = useState(0)

    
    
    



    const handleButtonPress = async () => {
      router.push({
        pathname: '/compiler',
        query: { code: code },
    })
       };


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
          setViewerId(data.id);
        }
    
        if(token != null){
          fetchData()
        }
        //console.log(userId)
      }, []);


      useEffect(() => {
  
        const options = {    
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
          };
          const params = { userId: viewerId };
          const url = `/api/templates/${id}?${new URLSearchParams(params)}`
          
          const fetchData = async () => {
            const data = await fetch(url, options)
            const json = await data.json();
            if (data.status === 200) {
            setTitle(json.template.title)
            setExplanation(json.template.explanation)
            setCode(json.template.code)
            setUser(json.template.user)
            setTags(json.template.tags)
            if (json.template.visibility == false){
              setVisibility(1)
            }
            setFork(0)
            setStatus(200)
            }
        
        }

        if (id){
        fetchData()
        }

    },[id, viewerId])



      const handleFork = async () => {
        // Collect all the data and log it or send it to a backend
        const postData = {
          userId: viewerId
        };
        const options = {  
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      };
      const url = `/api/templates/`+ id
      const response = await fetch(url, options)
      const data = await response.json();
      if (response.status == 200){ //https://www.npmjs.com/package/react-toastify
        toast.success('Fork successful!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
          //console.log(data)
          setFork(1)
        
        
        setTimeout(() => {
          router.push('/templates/'+data.forkedTemplate.id);
      }, 2000);
      }
  
      toast.error(data.error, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
  
  
      };

      const handleEdit = async () => {
        router.push('/templates/edit/'+id);
      }




      const handleDelete = async () => {
        // Collect all the data and log it or send it to a backend

        if (user.id != viewerId){
            toast.error("Cannot delete template", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        return

        }
        else if(user.id == viewerId){

        const postData = {
        };
        const options = {  
          method: 'DELETE',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      };
      const url = `/api/templates/`+ id
      const response = await fetch(url, options)
      const data = await response.json();
      if (response.status == 200){ //https://www.npmjs.com/package/react-toastify
        toast.success('Deletion successful!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
          //console.log(data)
        
        
        setTimeout(() => {
          router.push('/templates');
      }, 2000);
      }
      else{toast.error(data.error, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
  
        }
    }
      };





      
    if(status != 200){
        return(<p className="text-gray-600 text-center">No template found.</p>)
    }
return (<div>     

<div>
<div className="max-w-screen-xl mx-auto p-4">
  
          <div className="border border-gray-300 rounded-lg shadow-lg p-5 bg-green-100 mb-6 transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title} </h2>

            <Editor
            readOnly={true}
           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mb-3 bg-white text-violet-600"
      value={code}
      highlight={code => highlight(code, languages.js)}
      padding={10}
  
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 17,
      }}
    />
            
           
              <button 
              onClick={handleButtonPress}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 mb-2"
              >
                Run Code
              </button>
    

            <p className="text-gray-700 mb-4">
              
              


              {explanation.split("\n").map((line, index) => (
    <span key={index}>
     <AutoLinkText text= {line} />
      <br />
    </span> ))}





            </p>
            
<div className="flex items-center mt-4 space-x-4">
<p className="text-gray-600 text">
                
                <strong>User:</strong> {user.name}
              </p>
            <div className="flex-1" />
            <p className="text-gray-600 text">
              <strong>Tags:</strong> {tags.map(tag => " " + tag.name)}
            </p>

            </div>
            
            <div className="flex items-center mt-4 space-x-4">


            {viewerId &&
              <button 
              disabled={fork === 1}
              onClick={handleFork}
          
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
               fork === 1
            
               ? "bg-gray-500 text-gray-400 cursor-not-allowed"
               : "hover:bg-blue-600"
            }`}
              >
                Fork Template
              </button>}
              


              <div className="flex-1" />

             
          {viewerId == user.id && visibility != 1 && <button onClick={handleEdit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Edit
              </button>}

              {visibility == 1? <div><strong>Post hidden</strong></div>:""}
 {viewerId == user.id   &&      <button onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button> }
        

            </div>

                {/*https://www.npmjs.com/package/react-toastify*/}
        <ToastContainer
position="bottom-left"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"/>
            
          </div>



          </div>
          

</div>

</div>


)
}