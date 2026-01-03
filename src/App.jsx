import React, { Suspense } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";

// Lazy loaded components
const Home = React.lazy(() => import("./pages/Home.jsx"));
const Login = React.lazy(() => import("./components/Login.jsx"));
const Signup = React.lazy(() => import("./components/Signup.jsx"));
const CreatePost = React.lazy(() => import("./components/CreatePost.jsx"));
const Profile = React.lazy(() => import("./components/Profile.jsx"));
const UserProfile = React.lazy(() => import("./components/UserProfile.jsx"));
const Messges = React.lazy(() => import("./components/Messges.jsx"));
const Notification = React.lazy(() => import("./components/Notification.jsx"));
const Messgesss = React.lazy(() => import("./components/Messgesss.jsx"));
const Explore = React.lazy(() => import("./components/Explore.jsx"));
const LogOut = React.lazy(() => import("./components/Logout.jsx"));
const MobileTabs = React.lazy(() => import("./components/MobileTabs.jsx"));
const Changepassword = React.lazy(() => import("./components/changsepassword.jsx"));
const Requset = React.lazy(() => import("./components/Requset.jsx"));


///upload

///signup.login
//changepass
function App() {
  return (
      <Router>
<ToastContainer
position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
/>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/userprofile/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UserProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
             <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Messgesss />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
              <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LogOut />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
                 <Route
              path="/message/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Messges />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

<Route
              path="/changepassword"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Changepassword />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreatePost />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
             <Route
              path="/noti"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notification />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreatePost />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

<Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Explore />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

<Route
              path="/request"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Requset />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
  );
}

export default App;
