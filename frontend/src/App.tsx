import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm";
import SignupForm from "./pages/Auth/SignupForm";
import Home from "./pages/Dashboard/Home";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import MyPolls from "./pages/Dashboard/MyPolls";
import VotedPolls from "./pages/Dashboard/VotedPolls";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/createpoll" element={<CreatePoll />} />
            <Route path="/mypoll" element={<MyPolls />} />
            <Route path="/votedpoll" element={<VotedPolls />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}

export default App;

const Root = () => {
  const isAuthenticate = !!localStorage.getItem("token");

  return isAuthenticate ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
