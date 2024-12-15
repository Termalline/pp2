// pages/profile.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [updateInfo, setUpdateInfo] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPicture, setFormPicture] = useState('/default.ico');

 

  const profilePictures = [
    '/avatar1.ico',
    '/avatar2.ico',
    '/avatar3.ico',
    '/avatar4.ico',
  ];


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



  const fetchUserInfo = async () => {
    const options = {  
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    };
    const url = `/api/users/`+ userId
    const response = await fetch(url, options)
    const data = await response.json();
    if (response.status != 200){
      return 
   }
   setUser(data);
   setLoading(false)
  };

  useEffect(() => {
   // if (id != undefined){
   fetchUserInfo();
 //   }
  }, [userId]);



/*
  useEffect(() => {
    // Fetch user profile data from the API
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/users/'+userId); // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch user profile data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);
*/
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Please login to view your profile.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const handleEdit = () => {
    if (updateInfo == 0){
      fetchUserInfo()
      setUpdateInfo(1)
      setFormName(user.name)
      setFormEmail(user.email)
      setFormNumber(user.number)
      setFormName(user.name)
      setFormPicture(user.picture)
 
    }
    else{
      setUpdateInfo(0)
    }
  };


  

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Collect all the data and log it or send it to a backend
      const postData = {
        name: formName,
        email: formEmail,
        number: formNumber,
        password: formPassword,
        picture: formPicture
      };
      const options = {  
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
    const url = `/api/users/`+ userId
    const response = await fetch(url, options)
    const data = await response.json();
    if (response.status == 200){ //https://www.npmjs.com/package/react-toastify
      toast.success('Profile updated!', {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        fetchUserInfo()
    //  setTimeout(() => {
    //    router.push('/blogposts/'+ id);
   // }, 2000);
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


  }

  const handlePictureSelect = (picture) => {
    setFormPicture(picture)
  };




  return (
    <div>
    <div className="max-w-2xl mx-auto my-10 p-6 bg-teal-100 rounded-lg shadow-md">
      <div className="flex items-center space-x-8">
        <Image
          src={user?.profilePicture || user.picture}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold text-fuchsia-500">{user.name} </h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.number}</p>
          <p className="text-gray-600">{user.role}</p>
        </div>
      </div>

      <button 
        onClick={handleEdit} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Edit Information
      </button>
    </div>

    {updateInfo == 1? 

<div className="max-w-2xl mx-auto my-10 p-6 bg-teal-100 rounded-lg shadow-md">
<h1 className="text-2xl font-bold mb-4 text-sky-500">Update Profile Info</h1>
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Name</label>
    <input
      type="text"
      name="name"
      value={formName}
      onChange={(e) => setFormName(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-violet-600"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      name="email"
      value={formEmail}
      onChange={(e) => setFormEmail(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-violet-600"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Password</label>
    <input
      type="password"
      name="password"
      value={formPassword}
      onChange={(e) => setFormPassword(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-violet-600"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
    <input
      type="number"
      name="number"
      value={formNumber}
      onChange={(e) => setFormNumber(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-violet-600"
    />
  </div>

  <div>
          <label className="block text-sm font-medium text-gray-700">Choose Profile Picture</label>
          <div className="flex space-x-4 mt-2">
            {profilePictures.map((picture) => (
              <div
                key={picture}
                className={`w-16 h-16 p-1 border rounded-full cursor-pointer ${
                  formPicture === picture ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handlePictureSelect(picture)}
              >
                <Image
                  src={picture}
                  alt="Profile Picture Option"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
            ))}
          </div>
        </div>


        <button
          disabled={submitted === 1}
          type="submit"
          className={`w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
            submitted === 1
            
              ? "bg-gray-500 text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
        >
          Update Information
        </button>





  </form>
  </div>
      
      
      
      
      
      
      :""}

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
}

