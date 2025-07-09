import { Routes, Route } from 'react-router-dom'
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import NotificationPage from "./pages/NotificationPage"
import OnboardingPage from "./pages/OnboardingPage"
import  { Toaster } from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import { Navigate } from 'react-router-dom'



const App = () => {
  //tanstack query client can be added here if needed
  // This is used to fetch user data from the backend when the app loads
  // It will automatically handle loading and error states
  // The data will be available in the `data` variable once the query is successful
  // The `isLoading` variable will be true while the data is being fetched
  // The `error` variable will contain any error that occurs during the fetch
  // This is useful for displaying user-specific data or handling authentication state
  // The query will automatically refetch the data when the component mounts or when the query key changes
  const{data:authData,isLoading,error} = useQuery({
    queryKey: ['authUser'], // Unique key for the query to identify it
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me') // Fetching user data from the backend
      return response.data // Returning the user data from the response
    },
    
  });

const authUser = authData?.user; // Extracting the user data from the response

console.log("User Data:", authUser);

return (
  <>
      <Toaster />
      <div className='h-screen' data-theme="night">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} /> // if user is authenticated, show HomePage, otherwise redirect to LoginPage
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} /> // if user is not authenticated, show LoginPage, otherwise redirect to HomePage
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} /> // if user is not authenticated, show SignUpPage, otherwise redirect to HomePage
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} /> // if user is authenticated, show ChatPage, otherwise redirect to LoginPage
          <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} /> // if user is authenticated, show CallPage, otherwise redirect to LoginPage
          <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} /> // if user is authenticated, show NotificationPage, otherwise redirect to LoginPage
          <Route path="*" element={authUser ? <HomePage /> : <Navigate to="/login" />} /> // if user is authenticated, show HomePage, otherwise redirect to LoginPage
        </Routes>
      </div>
    </>
  )
}
export default App