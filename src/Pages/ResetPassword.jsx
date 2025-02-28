import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import img from "../assets/techsa.png"

const ResetPassword = () => {
    const { token } = useParams();
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/user/resetPassword/${token}`, { password });
            toast.success('Password reset successfully');
            navigate('/');
        } catch (error) {
            toast.error('Error resetting password');
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img style={{height:"30%", width:"30%", marginLeft:"40%"}} src={img} alt="logo" />
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                    RESET PASSWORD
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    onChange={handleChange}
                                    placeholder='Enter your new password'
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
