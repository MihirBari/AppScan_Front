import React, { useState, useContext } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import img from "../assets/techsa.png"

const Register = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        role:'user',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const { register } = useContext(AuthContext);
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validate = () => {
        const errors = {};
        if (!inputs.name) errors.name = "Name is required";
        if (!inputs.surname) errors.surname = "Surname is required";
        if (!inputs.email) errors.email = "Email is required";
        if (!inputs.password) errors.password = "Password is required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
        setLoading(true);
        try {
          await register(inputs);
        } catch (error) {
          console.log(error);
          toast.error("Registration failed. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img style={{height:"30%", width:"30%", marginLeft:"40%"}} src={img} alt="logo" />
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                    REGISTER YOUR ACCOUNT
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your Name"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                Surname
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="surname"
                                    value={inputs.surname}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your Surname"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    value={inputs.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                    placeholder='Enter your E-mail'
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    value={inputs.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                    placeholder='Enter your password'
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={inputs.rememberMe}
                                    onChange={handleChange}
                                />{' '}
                                Remember Me
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/" className="font-medium text-blue-600 ">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

