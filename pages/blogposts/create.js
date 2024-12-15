import React, { useState, useEffect } from "react";
import AutoLinkText from "react-autolink-text2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'



export default function newBlog() {

    const [title, setTitle] = useState(""); // State for the title
    const [text, setText] = useState("");  // State for the content
    const [tags, setTags] = useState([]);  // State for the tags
    const [tagInput, setTagInput] = useState(""); // State for the tag input
    const [userId, setUserId] = useState();
    const router = useRouter()
    const [links, setLinks] = useState([]); // State for the links
    const [linkInput, setLinkInput] = useState(""); // State for the link input
    const [submitted, setSubmitted] = useState(0);
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleTextChange = (event) => {
      setText(event.target.value);
    };
  
    const handleTagInputChange = (event) => {
      setTagInput(event.target.value);
    };

    const handleLinkInputChange = (event) => {
        setLinkInput(event.target.value);
      };    
  
    const addTag = () => {
      if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    };

    const addLink = () => {
        if (linkInput.trim() !== "" && !links.includes(linkInput.trim())) {
          setLinks([...links, linkInput.trim()]);
          setLinkInput("");
        }
      };
  
    const removeTag = (tagToRemove) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const removeLink = (linkToRemove) => {
        setLinks(links.filter((link) => link !== linkToRemove));
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
          setUserId(data.id);
        }
    
        if(token != null){
          fetchData()
        }
        //console.log(userId)
      }, []);

  
  
    const handleSubmit = async () => {
      // Collect all the data and log it or send it to a backend
      const postData = {
        title,
        content: text,
        tags: tags.toString(),
        links: links.toString(),
        userId,
      };
      const options = {  
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
    const url = `/api/blogposts`
    const response = await fetch(url, options)
    const data = await response.json();
    if (response.status == 201){ //https://www.npmjs.com/package/react-toastify
      toast.success('Blog Post created!', {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      
        setSubmitted(1)
      setTimeout(() => {
        router.push('/blogposts/'+ data.id);
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
  
    return (
        












        
      <div className="p-4 max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-fuchsia-500 mb-5">Create Blog Post</h1>
        {/* Title Input */}
        <label htmlFor="titleInput" className="block text-cyan-400 font-medium mb-2">
          Title:
        </label>
        <input
          id="titleInput"
          value={title}
          onChange={handleTitleChange}
          type="text"
          placeholder="Enter a title..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mb-4 text-violet-600"
        />

  
        {/* Multi-line Text Input */}
        <label htmlFor="multiLineInput" className="block text-cyan-400 font-medium mb-2">
          Description:
        </label>
        <textarea
          id="multiLineInput"
          value={text}
          onChange={handleTextChange}
          rows="10"
          placeholder="Write something here..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mb-4 text-violet-600"
        ></textarea>

        {/* Tag Input */}
        <label htmlFor="tagInput" className="block text-cyan-400 font-medium mb-2">
          Tags:
        </label>
        <div className="flex items-center space-x-2 mb-4">
          <input
            id="tagInput"
            value={tagInput}
            onChange={handleTagInputChange}
            type="text"
            placeholder="Add a tag..."
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 text-violet-600"
          />
          <button
            onClick={addTag}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Add
          </button>
        </div>
  
        {/* Display Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </span>
          ))}
        </div>



     {/* Link Input */}
     <label htmlFor="linkInput" className="block text-cyan-400 font-medium mb-2">
        Links to Code Templates:
      </label>
      <div className="flex items-center space-x-2 mb-4">
        <input
          id="linkInput"
          value={linkInput}
          onChange={handleLinkInputChange}
          type="url"
          placeholder="Add a link..."
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 text-violet-600"
        />
        <button
          onClick={addLink}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Display Links */}
      <div className="flex flex-wrap gap-2 mb-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center space-x-2"
          >
            <a
              href={"/templates/"+link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {link}
            </a>
            <button
              onClick={() => removeLink(link)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>


  
        {/* Submit Button */}
        <button
        disabled={submitted === 1}
          onClick={handleSubmit}
          className={`w-full mt-4 px-4 py-2 bg-green-500 text-white rounded ${
            submitted === 1
            
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "hover:bg-green-600"
          }`}



        >
          Submit
        </button>
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
      
    );
  };
  
 


