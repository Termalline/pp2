// pages/registration.js
import { useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

export default function Registration() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    number: '',
    picture: '/default.ico',
  });
  

  const profilePictures = [
    '/avatar1.ico',
    '/avatar2.ico',
    '/avatar3.ico',
    '/avatar4.ico',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureSelect = (picture) => {
    setFormData({ ...formData, picture: picture });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
        //https://www.npmjs.com/package/react-toastify
    toast.success('Account created!', {
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
            router.push('/login');
        }, 2000);
    } else {;
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



    // console.log('User Data:', formData);
 
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-fuchsia-500">Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Choose Profile Picture</label>
          <div className="flex space-x-4 mt-2">
            {profilePictures.map((picture) => (
              <div
                key={picture}
                className={`w-16 h-16 p-1 border rounded-full cursor-pointer ${
                  formData.picture === picture ? 'border-blue-500' : 'border-gray-300'
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
          Register
        </button>
      </form>

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