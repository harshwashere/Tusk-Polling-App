import { useContext, useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import AuthInput from "../../components/Input/AuthInput";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import AuthLoader from "../../components/layout/AuthLoader";

const SignupForm = () => {
  const [input, setInput] = useState({
    profilePic: null as File | null,
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userContext = useContext(UserContext);
  const updateUser = userContext?.updateUser;
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let profileimageUrl = "";

    if (!input.fullName || !input.email || !input.username || !input.password) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      if (input.profilePic) {
        const imgUpload = await uploadImage(input.profilePic);
        profileimageUrl = imgUpload.imageUrl || "";
        console.log("Uploaded Image URL: ", profileimageUrl);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullname: input.fullName,
        username: input.username,
        email: input.email,
        password: input.password,
        profileimageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        if (updateUser) {
          updateUser(user);
        }
        navigate("/dashboard");
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error("Signup Error: ", error.response?.data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (file: File) => {
    setInput((prev) => ({ ...prev, profilePic: file }));
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>
      </div>

      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector
          profilePic={input.profilePic}
          setProfilePic={handleProfilePicChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthInput
            name="fullName"
            value={input.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            label="Full Name"
            type="text"
            pattern="^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$"
          />
          <AuthInput
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder="Email"
            label="Email"
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />
          <AuthInput
            name="username"
            value={input.username}
            onChange={handleChange}
            placeholder="Username"
            label="Username"
            type="text"
            pattern="[A-Za-z][A-Za-z0-9_]{2,15}$"
          />
          <AuthInput
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder="Password"
            label="Password"
            type="password"
            pattern="/^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          {loading ? <AuthLoader /> : "SIGN UP"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <Link className="font-medium text-blue-600 underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupForm;
