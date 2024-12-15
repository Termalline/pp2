import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoLinkText from "react-autolink-text2";



const CommentReports = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState([]);
  const [icr_reports, setIcr_reports] = useState([])
  //const [author, setAuthor] = useState("");
  const [reports, setReports] = useState([]);
  const [userId, setUserId] = useState();
  const [tags, setTags] = useState(""); // State for the tag input
  const [userRole, setUserRole] = useState();

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
      setUserRole(data.role);
    }

    if(token != null){
      fetchData()
    }
    //console.log(userId)
  }, []);
 
  useEffect(() => {

    const fetchBlog = async () => {
      const options = {  
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
          }
      };
      const url = `/api/admin/icr?comment=1`
      const response = await fetch(url, options)
      const data = await response.json();
      if (response.status != 200){
        return 
     }
      if (router.isReady && data?.posts) {
      const { id } = router.query; // Get the id from query params
      console.log("ID from router:", id);

      // Find the blog post (ensure type consistency)
      const foundPost = data.posts.find((item) => item.id === Number(id));
      console.log("Found Post:", foundPost);

      setBlog(foundPost || null);
    }
  
    }


    fetchBlog();

 //   }
  }, [id]);

  



  


  const commentsPerPage = 5;

  // Get the current page from the URL, default to 1
  const currentPage = parseInt(router.query.page || "1", 10);

  // Pagination logic
  const totalPages = blog?.icr ? Math.ceil(blog.icr.length / commentsPerPage) : 1;
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;

  const paginatedReports = blog?.icr?.slice(startIndex, endIndex);

 

  const goToPage = (pageNumber) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page: pageNumber } });
  };

  useEffect(() => {
    if (!blog.icr || blog.icr.length === 0) return;
    if (currentPage < 1 || currentPage > totalPages) {
      router.push({ pathname: `icr/blog/${router.query.id}`, query: { page: 1 } });
    }
  }, [currentPage, totalPages, blog?.icr?.length, router.query.id]);


if (!blog) {
  return <p>No post found</p>; // Show loading state if blog is not found
}


const hideComment = async () => {
    // Collect all the data and log it or send it to a backend
  
    const postData = {id_comment: id
    };
    const options = {  
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
  };
  const url = `/api/admin/icr`
  const response = await fetch(url, options)
  const data = await response.json();
  if (response.status == 200){ //https://www.npmjs.com/package/react-toastify
    toast.success('Post hidden!', {
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
      router.push('/icr');
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
  
  };
  

  return userRole == "ADMIN"?(
    <div className="max-w-screen-md mx-auto p-6 ">
            <div className="border border-gray-300 rounded-lg shadow-lg p-5 bg-green-100 mb-6 transition-shadow ">
      <p className="text-gray-700 text-lg mb-4"> 
        {blog.content?.split("\n").map((line, index) => (
    <span key={index}>
       {line}
      <br />
    </span>
  ))}




</p>




<p className="text-gray-600 text">
  <strong>User:</strong>  {blog.user?.name}
</p>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>








</div>

<div className="text-gray-600 ">
              
        <strong>Rating:</strong> {blog.rating}
      </div>






<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
  

<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <button 
        onClick={() => hideComment()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Hide Comment
      </button>   



    
      </div>
      </div>


      <div>
      </div>
      </div>
      <h2 className="text-2xl font-semibold text-rose-600 mb-4">Reports - {blog.reports}</h2>
      
      {paginatedReports?.length > 0 ? (
        <ul className="space-y-4">
          {paginatedReports.map((post) => (
            <div key={post.id}
            className="flex items-start space-x-4 border border-gray-300 rounded-lg p-4">
              
              <div>
                <p className="text-cyan-500">{post.report}</p>
                <div className="max-w-2xl mx-auto p-2"></div>
                
                

                
                <p className="text-sm text-violet-500"><strong>Reported by:</strong> {post.user.name}</p>


               

                

              </div>
              
              
              
              
              </div>
          ))}

          </ul>
        ) : (
          <p>No reports found.</p>
        )}

             {/* Pagination */}
             {totalPages > 1 && (
  <div className="flex justify-center items-center mt-4 space-x-2">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 border rounded ${
        currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"
      }`}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => goToPage(index + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === index + 1
            ? "bg-blue-500 text-white"
            : "text-blue-500 hover:text-blue-700"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 border rounded ${
        currentPage === totalPages
          ? "text-gray-400 cursor-not-allowed"
          : "text-blue-500 hover:text-blue-700"
      }`}
    >
      Next
    </button>
  </div>
)}
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
   ) : <div>Access denied</div>
}

export default CommentReports;
