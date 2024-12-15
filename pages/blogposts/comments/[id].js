import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BlogComments = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState([]);
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [error, setError] = useState("");
  

  const handleOpenModal = () => setIsModalOpen(true);
 // const [commentAuthor, setCommentAuthor] = useState("");
  // const post = posts.find((post) => post.id === parseInt(id));
  
  const fetchBlog = async () => {
    const options = {  
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    //console.log(response)
    if (response.status != 200){
       return 
    }

    setBlog(data.comment);
    //if (data != undefined) {
    setAuthor(data.comment?.user.name)
    //}
    //console.log(data.user.name)
    setComments(data.comment?.Children)
  };


  /*
  const fetchComments = async () => {
    const options = {  
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    };
    const params = { blogId: id };
    const url = `/api/blogposts/comments?${new URLSearchParams(params)}`
    const response = await fetch(url, options)
    const data = await response.json();
    setComments(data.comments);
    //if (data != undefined) {
 //   setAuthor(data.blogPost.user.name)
    //}
    console.log(data.comments)
  };
*/

  useEffect(() => {
   // if (id != undefined){
   router.isReady && fetchBlog();
 //   }
  }, [id]);

  



//  if (!blog) {
//    return <p className="text-center text-gray-600 mt-10">Comment not found.</p>;
//  }

  

 // const [comments, setComments] = useState(commentsData.comments);
  
  const commentsPerPage = 5;

  // Get the current page from the URL, default to 1
  const currentPage = parseInt(router.query.page || "1", 10);

  // Pagination logic
  const totalPages = Math.ceil(comments?.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;

  const paginatedComments = comments
    ?.slice()
    ?.sort((a, b) => b.rating - a.rating)
    ?.slice(startIndex, endIndex);

  const goToPage = (pageNumber) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page: pageNumber } });
  };

  /*
  // Upvote a comment
  const upvoteComment = (id) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, rating: comment.rating + 1 } : comment
      )
    );
  };

  // Downvote a comment
  const downvoteComment = (id) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, rating: comment.rating - 1 } : comment
      )
    );
  };
*/


  const upvoteComment = async (id) => {
    const upVoteBody = {id: id, rating: 1}
    const options = {  
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(upVoteBody)
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    fetchBlog()
    
};

const downvoteComment = async (id) => {
    const downVoteBody = {id: id, rating: -1}
    const options = {  
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(downVoteBody)
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    fetchBlog()
    
};




  useEffect(() => {
    if (comments?.length === 0) return;
    if (currentPage < 1 || currentPage > totalPages) {
      router.push({ pathname: `/blogposts/${router.query.id}`, query: { page: 1 } });
    }
  }, [currentPage, totalPages, comments?.length, router.query.id]);



  
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
  //console.log(userId)


  const handleAddComment = async () => {
    const addCommentBody = {content: newComment, userId: userId}
    const options = {  
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(addCommentBody)
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    //console.log(response.status)
    if (response.status == 201){
      toast.success('Post Added!', {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    fetchBlog()
    setNewComment("")
    
  };

  





if (!author) {
    return <p className="text-center text-gray-600 mt-10">Comment not found.</p>;
  }


  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setError("Please provide a reason for reporting.");
    } else {
      const postData = {userId: userId, commentId: id, report: reportReason
      };
      const options = {  
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
    const url = `/api/users/report`
    const response = await fetch(url, options)
    const data = await response.json();
    if (response.status == 200){ //https://www.npmjs.com/package/react-toastify
      toast.success('Report received.', {
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
      
      
     // setTimeout(() => {
      //  router.push('/blogposts');
   // }, 2000);
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

      // Submit the report (implement your API call here)
      console.log("Report submitted:", reportReason);
      setIsModalOpen(false);
      setReportReason("");
      setError("");
    }
  };


  const upVoteBlog = async (id, delta) => {
    const upVoteBody = {id: id, rating: delta}
    const options = {  
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(upVoteBody)
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    fetchBlog();
    
};

const downVoteBlog = async (id, delta) => {
    const downVoteBody = {id: id, rating: delta}
    const options = {  
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(downVoteBody)
    };
    const url = `/api/blogposts/comments/`+ id
    const response = await fetch(url, options)
    const data = await response.json();
    fetchBlog();
    
};


  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between">
  {/* Post Content */}
  <div className="flex flex-col">
  </div>

  {/* Report Button */}
  {userId && <button
    className="flex items-center text-gray-500 hover:text-red-600"
    onClick={handleOpenModal}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 mr-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v18m0-14h10l-2.5 4L15 17H5"
      />
    </svg>
    Report
  </button> }

        {/* Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-bold mb-4 text-red-600">Report Post</h3>
            <textarea
              value={reportReason}
              onChange={(e) => {
                setReportReason(e.target.value);
                setError(""); // Clear error on input
              }}
              placeholder="Enter the reason for reporting this post..."
              className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-violet-700"
            />
            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setReportReason("");
                  setError("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6"></h1>
      <p className="text-cyan-400 text-lg mb-4">{blog.content}</p>
      <p className="text-gray-600 text-sm">
        <strong>User:</strong>  {author}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {userId &&<button 
        onClick={() => upVoteBlog(id, 1)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Upvote
      </button>   }

  
      {userId &&<button 
        onClick={() => downVoteBlog(id, -1)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Downvote


        
      </button> } 

             <span className="text-violet-600">
              
        <strong>Rating:</strong> {blog.rating}
      </span> 

      

    



    
      </div>
  
      <div className="max-w-2xl mx-auto p-3"></div>

      <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-violet-600 bg-teal-100"
          />
          <button
            disabled={userId === undefined}
            onClick={() => {
              handleAddComment()

           }}

            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              userId === undefined
                ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            Add
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



        <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-fuchsia-500 mb-4">Replies</h2>

      {paginatedComments.length > 0 ? (
        <ul className="space-y-4">
          {paginatedComments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-4 border border-gray-300 rounded-lg p-4"
            >
            {userId && <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => upvoteComment(comment.id)}
                  className="text-green-500 hover:text-green-700"
                >
                  ▲
                </button>
                <span className="font-medium text-violet-600">{comment.rating}</span>
                <button
                  onClick={() => downvoteComment(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ▼
                </button>
              </div> }

              {!userId && <span className="block text-center font-medium text-violet-600">
              <div>Rating</div> {comment.rating}
              </span> }

              <div>
                <p className="text-purple-500">{comment.content}</p>
                <div className="max-w-2xl mx-auto p-2"></div>
                
                

                
                <p className="text-sm text-gray-500">User: {comment.user.name}</p>


                <div className="max-w-2xl mx-auto p-2"></div>

                <Link href={`/blogposts/comments/${comment.id}`} passHref>
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reply
              </button>
              </Link>

              </div>
              

            

            </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No replies yet.</p>
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
      
    </div>
        

    </div>




  );
};

export default BlogComments;
