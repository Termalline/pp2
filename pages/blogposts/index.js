import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

const SearchablePostList = () => {
    const [blogs, setBlogs] = useState([]);
    const router = useRouter();
    const { query } = router;
    const [searchQuery, setSearchQuery] = useState(query.search || "");
    const currentPage = parseInt(query.page || "1", 10);
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

    const fetchBlogs = async () => {
        const options = {  
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        };
        const url = `/api/blogposts`
        const response = await fetch(url, options)
        const data = await response.json();
        setBlogs(data.posts);
    };

    
    const upVoteBlog = async (id, delta) => {
        const upVoteBody = {id: id, rating: delta}
        const options = {  
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(upVoteBody)
        };
        const url = `/api/blogposts/`+ id
        const response = await fetch(url, options)
        const data = await response.json();
        fetchBlogs();
        
    };

    const downVoteBlog = async (id, delta) => {
        const downVoteBody = {id: id, rating: delta}
        const options = {  
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(downVoteBody)
        };
        const url = `/api/blogposts/`+ id
        const response = await fetch(url, options)
        const data = await response.json();
        fetchBlogs();
        
    };


  useEffect(() => {
    fetchBlogs();
  }, []);


 // if (posts != undefined){

  // Filter posts based on the search query
  const filteredPosts = blogs.filter(
    (blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.map(tag => " " + tag.name).toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
//}

  // Sort posts by rating (highest rating first)
  const sortedPosts = [...filteredPosts].sort((a, b) => b.rating - a.rating);

  // Paginate posts
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Total pages
  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);

  // Handle query changes
  const handlePageChange = (page) => {
   // console.log(router.pathname)
   // console.log(query.page) 
    router.push({
      pathname: router.pathname,
      query: { ...query, page },
      
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    router.push({
      pathname: router.pathname,
      query: { ...query, search: e.target.value, page: 1 },
    });
  };

  const createBlog = () => {
    router.push({
      pathname: router.pathname+"/create",
    });
  
  }


  
  
  return (
    <div className="max-w-2xl mx-auto p-4">
    {/* Header Section */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-fuchsia-500">Blog Posts</h1>
      {userId && <button
        onClick={() => createBlog()}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Create Blog Post
      </button>}
    </div>

      {/* Search input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by title, content, tags, or author..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2  focus:ring-blue-400 bg-teal-100 text-violet-700"
      />

      {/* Posts */}
      {paginatedPosts.length > 0 ? (
        paginatedPosts.map((post) => (
            <div key={blogs.id}>
          <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-green-100 mb-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content.slice(0, 65)}...</p>
            
<div className="flex items-center mt-4 space-x-4">
<p className="text-gray-600 text-sm">
                
                <strong>Author:</strong> {post.user.name}
              </p>
            <div className="flex-1" />
            <p className="text-gray-600 text-sm">
              <strong>Tags:</strong> {post.tags.map(tag => " " + tag.name).toString()}
            </p>


            </div>
            
            <div className="flex items-center mt-4 space-x-4">


            {/* View the blog post */}
            <Link href={`/blogposts/${post.id}`} passHref>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Post
              </button>
              </Link>


              <div className="flex-1" />

              {/* Upvote/Downvote buttons */}
             {userId && <button
                onClick={() => upVoteBlog(post.id, 1)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Upvote
              </button>}
              {userId && <button
                onClick={() => downVoteBlog(post.id, -1)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Downvote
              </button>}
              {/* Display Rating */}
              <span className="text-gray-800 font-semibold">
                Rating: {post.rating}
              </span>
              
              
              

            </div>
          </div>
          </div>
          
        ))
      ) : (
        <p className="text-gray-600 text-center">No posts found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Previous
          </button>
          <span className="text-pink-500 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchablePostList;
