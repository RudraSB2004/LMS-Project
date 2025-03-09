import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name, role } = req.body; // Get role from frontend
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete existing photo from Cloudinary if it exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // Upload new photo if provided
    let photoUrl = user.photoUrl;
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.buffer); // Use buffer
      photoUrl = cloudResponse.secure_url;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, role, photoUrl }, // Update role along with other fields
      { new: true, select: "-password" } // Ensure password is excluded
    );

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};
