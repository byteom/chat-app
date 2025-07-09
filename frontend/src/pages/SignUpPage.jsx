import React from 'react'
import { useState } from 'react'
import { ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';



const SignUpPage = () => {

  const [signupData,setSignupData] = useState({
    fullName:"",
    email:"",
    password:""
  });

  const queryClient = useQueryClient()

  const{mutate,isPending,error} =useMutation({
        mutationFn:async()=>{
          const response = await axiosInstance.post("auth/signup",signupData)
          return response.data
        },
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  });

  const handleSignup =(e)=>{
    e.preventDefault();
    mutate()
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest"  >
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

      {/* Left side panel */}
      <div className='left-panel w-full lg:w-1/2 sm:p-8 flex flex-col'>
        {/*Logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
          <ShipWheelIcon className='h-9 w-9 text-primary' />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>ChatApp</span>
        </div>

        {/* SignuP form */}
        <div className='w-full max-w-md mx-auto'>
          <form onSubmit={handleSignup}>
            <div className='form space-y-4'>
              <div>
                <h2 className='text-xl font-semibold text-primary mb-2'>Create an Account</h2>
                <p className='space-y-3'>
                  Join ChatApp Start your Learning Experience
                </p>
              </div>

              <div className='space-y-3'>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      className='input input-bordered w-full' 
                      value={signupData.fullName}
                      onChange={(e)=>setSignupData({...signupData,fullName:e.target.value})}
                      required
                    />
                  </div>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className='input input-bordered w-full' 
                      value={signupData.email}
                      onChange={(e)=>setSignupData({...signupData,email:e.target.value})} // Update email state 
                      required
                    />
                  </div>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input 
                      type="password" 
                      placeholder="********" 
                      className='input input-bordered w-full' 
                      value={signupData.password}
                      onChange={(e)=>setSignupData({...signupData,password:e.target.value})}
                      minLength={6} // Ensure password is at least 6 characters
                      required
                    />
                    <p className='text-sm text-gray-500'>Make sure it's at least 6 characters long.</p>
                  </div>
              </div>
              <div className='form-control w-full'>
                <button 
                  type="submit" 
                  className='btn btn-primary w-full'
                >
                  {isPending?"Signing Up...":"Create Account"}
                </button>
              </div>

              <div className='text-center mt-4'>
                <p className='text-sm text-gray-500'>
                  Already have an account? 
                  <Link to="/login" className='text-primary hover:underline'> Log In</Link>
                </p>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Right side image */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
  <div className="max-w-md p-8">
    {/* Illustration */}
    <div className="relative aspect-square max-w-w-sm mx-auto">
      <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
    </div>

    <div className="text-center space-y-3 mt-6">
      <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
      <p className="opacity-70">
        Practice conversations, make friends, and improve your language skills together
      </p>
    </div>
  </div>
</div>

      </div>
    </div>
  )
}

export default SignUpPage