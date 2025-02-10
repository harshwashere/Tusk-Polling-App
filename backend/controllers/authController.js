import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Poll from "../models/Poll.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res) => {
  const { fullname, username, email, password, profileimageUrl } = req.body;

  if (!fullname || !username || !email || !password || !profileimageUrl) {
    console.log("Missing Fields: ", {
      fullname,
      username,
      email,
      password,
      profileimageUrl,
    });
    return res.status(400).json({ message: "All fields are required" });
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .json({
        message: "Invalid username. Only alpha-numeric characters are allowed.",
      });
  }

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username is not available. Try another one." });
    }

    const user = await User.create({
      fullname,
      username,
      email,
      password,
      profileimageUrl,
    });

    return res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    return res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are requred." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const totalPollsCreated = await Poll.countDocuments({ creator: user._id })

    const totalPollsVotes = await Poll.countDocuments({ voters: user._id })

    const totalPollsBookmarked = user.bookmarkedPolls.length

    const pass = await bcrypt.compare(password, user.password);

    if (pass) {
      return res.status(200).json({
        id: user._id,
        user: {
          ...user.toObject(),
          totalPollsCreated,
          totalPollsVotes,
          totalPollsBookmarked,
        },
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error login user: ", error });
  }
};

export const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalPollsCreated = await Poll.countDocuments({ creator: user._id })

    const totalPollsVotes = await Poll.countDocuments({ voters: user._id })

    const totalPollsBookmarked = user.bookmarkedPolls.length

    const userInfo = {
      ...user.toObject(),
      totalPollsCreated,
      totalPollsVotes,
      totalPollsBookmarked,
    };

    return res.status(200).json({ userInfo });
  } catch (error) {
    return res.status(500).json({ message: "Error finding user", error });
  }
};
