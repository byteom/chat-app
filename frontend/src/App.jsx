import React from 'react'
import { Routes } from 'react-router'
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import NotificationPage from "./pages/NotificationPage"
import OnboardingPage from "./pages/OnboardingPage"

const App = () => {
  return (
   <>
   <div className='h-screen' data-theme="night">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/call" element={<CallPage />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="*" element={<HomePage />} />

    </Routes>
   </div>
   </>  
   
  )
}

export default App