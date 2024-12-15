import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function App() {
  const router = useRouter();
  const { query } = router;

  // Extract query parameters or set defaults
  const currentPage = parseInt(query.page || "1", 10);
  const currentSelection = query.selection || "blogs";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 4;

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        currentSelection === "blogs"
          ? "/api/admin/icr?blog=1"
          : "/api/admin/icr?comment=1";
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${currentSelection}`);
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
  }, [currentSelection]);

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const contentMatch = item.content
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const authorMatch = item.user?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return contentMatch || authorMatch;
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

  return userRole == "ADMIN"?  (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-3xl font-bold text-fuchsia-500 mb-8">Reported Posts</div>

      {/* Selector */}
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="content" className="font-medium text-sky-500">
          Sort by:
        </label>
        <select
          id="content"
          value={currentSelection}
          onChange={(e) => handleSelectionChange(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="blogs">Blog Posts</option>
          <option value="comments">Comments</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by content or author..."
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
              <Link key={item.id} href={`/icr/blog/${item.id}`} passHref>
                <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-green-100 mb-6">
                  <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                  Reports: {item.reports} | {item.title}
                  </h2>
                  <div className="text-violet-600"><strong>Author:</strong> {item.user.name}</div>
                  <div className="text-violet-600">
                    <strong>Tags:</strong> {(item.tags?.map(tag => " " + tag.name) || []).toString()}
                  </div>
                  <div className="text-violet-600"><strong>Rating:</strong> {item.rating}</div>
                  <p className="text-gray-700 ">
                    {item.content.slice(0, 60)}...
                  </p>
                </div>
              </Link>
            ) : (
<Link key={item.id} href={`/icr/comment/${item.id}`} passHref>
  <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-green-100 mb-6">
    <div className="flex items-center mb-4">
      <h2 className="text-2xl font-semibold text-rose-600 mr-7">
        Reports: {item.reports}
      </h2>
      <div className="text-gray-700">{item.content.slice(0, 300)}...</div>
    </div>
   <div className="text-violet-600"> <strong >User:</strong> {item.user.name}</div>
    <div className="text-violet-600">
      <strong>Rating:</strong> {item.rating}
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
        <p>No {currentSelection} found.</p>
      )}
    </div>
  ) : <div>Access denied</div>
}
