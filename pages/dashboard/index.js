import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function App() {
  const router = useRouter();
  const { query } = router;

  // Extract query parameters or set defaults
  const currentPage = parseInt(query.page || "1", 10);
  const currentSelection = query.selection || "code_templates";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 4;


  useEffect(() => {
 const token = localStorage.getItem('accessToken');
  if (token == null) {
    router.push('/login');
  }



  
  const params = { token: token };
  
  const options = {
    
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
    };
    const url = `/api/users/refresh?${new URLSearchParams(params)}`
    const fetchData = async () => {
   
    
      const data = await fetch(url, options)
      const json = await data.json();
      if (data.status === 401) {
        router.push('/login');
      }
      if (json!= null){
        setUserId(json.id);
       }
       else if(json == null){
         setUserId(undefined);
       }

    }
    if(token != null){
    fetchData()
    }

  },[])








  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
        const params = { blog_post: 1 };
        const params1 = { code_templates: 1 };
      const endpoint =
        currentSelection === "blogs"
          ? `/api/users/`+ userId + `?` + new URLSearchParams(params)
          : `/api/users/`+ userId + `?` + new URLSearchParams(params1)
      const response = await fetch(endpoint);
      if (!response.ok) {
        return
      }
      const result = await response.json();
      setData(result.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSelection, userId]);

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const contentMatch = item.content
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const explanationMatch = item.explanation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const titleMatch = item.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const tagMatch = item.tags.map(tag => " " + tag.name).toString()
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return contentMatch || explanationMatch || titleMatch || tagMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSelectionChange = (newSelection) => {
    router.push(`?selection=${newSelection}&page=1`, undefined, {
      shallow: true,
    });
  };

  const goToPage = (pageNumber) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: pageNumber },
    });
  };

  const createTemplate = () => {
    router.push('/templates/create');
  
  }

  const createBlog = () => {
    router.push('/blogposts/create');
  
  }
  

  return (
    <div className="max-w-2xl mx-auto p-4">
        {/* Header Section */}
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-fuchsia-500">My Posts</h1>
    <div className="flex space-x-4">
    <button
      onClick={() => createBlog()}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Create Blog Post
    </button>

      <button
      onClick={() => createTemplate()}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Create Code Template
    </button>
  </div>
  </div>
      {/* Selector */}
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="content" className="font-medium text-sky-400">
          Sort by:
        </label>
        <select
          id="content"
          value={currentSelection}
          onChange={(e) => handleSelectionChange(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="code_templates">Code Templates</option>
          <option value="blogs">Blog Posts</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by content, title, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 bg-teal-100"
        />
      </div>

      {loading ? (
        <p>Loading {currentSelection}...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : currentItems.length > 0 ? (
        <div>
          {currentItems.map((item) =>
            currentSelection === "blogs" ? (
                <Link key={item.id} href={`/blogposts/${item.id}`} passHref>
                <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-green-100 mb-6 hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">{item.title}</h2>
                  <p className="text-gray-700 mb-4">{item.content?.slice(0, 65)}...</p>
                  
      <div className="flex items-center mt-4 space-x-4">
      <p className="text-gray-600 text-sm">
                      
                      <strong>Author:</strong> {item.user.name}
                    </p>
                  <div className="flex-1" />
                  <p className="text-gray-600 text-sm">
                    <strong>Tags:</strong> {item.tags.map(tag => " " + tag.name).toString()}
                  </p>
      
      
                  </div>
                  
                  <div className="flex items-center mt-4 space-x-4">
      
                   
      
      
                    <div className="flex-1" />
      
                    {/* Display Rating */}
                    <span className="text-gray-800 font-semibold">
                      Rating: {item.rating}
                    </span>
                    
                    
                    
      
                  </div>
                </div>
                 </Link>
            ) : (
                <Link key={item.id} href={`/templates/${item.id}`} passHref>
                <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-green-100 mb-6 cursor-pointer hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">{item.title}</h2>
                  <p className="text-gray-700 mb-4">{item.explanation?.slice(0, 300)}...</p>
                  
        <div className="flex items-center mt-4 space-x-4">
        <p className="text-gray-600 text-sm">
                      
                      <strong>Author:</strong> {item.user.name}
                    </p>
                  <div className="flex-1" />
                  <p className="text-gray-600 text-sm">
                    <strong>Tags:</strong> {item.tags.map(tag => " " + tag.name).toString()}
                  </p>
        
                  </div>
                  
                    
                    
        
                  </div>
                      
                </Link>
            )
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-700"
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
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
