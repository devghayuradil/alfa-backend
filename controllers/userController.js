import { encryptPassword, decryptPassword } from "../helper/userHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required." });
    }
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exist." });
    }

    // encrypting user Password
    const hashedPassword = await encryptPassword(password);
    // creating new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).send({
      success: true,
      message: "User registration successful.",
      newUser,
    });
  } catch (error) {
    console.log(`Registration Error: ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "Registration Error", error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All Fields are required" });
    }
    // check email is exist in database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Email not registered" });
    }

    // match the password
    const isMatch = await decryptPassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Password" });
    }

    // generating tokken
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });

    // remove password field to send user data from backend to frontend
    user.password = undefined;

    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .send({
        success: true,
        message: "User Logged In successfully",
        user,
        token,
      });
  } catch (error) {
    console.log(`loginController Error: ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "loginController Error", error });
  }
};

const logoutController = async (req, res) => {
  return res
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    })
    .status(200)
    .send({
      success: true,
      message: "logout successfully",
    });
};

const allUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    if (!users) {
      return res.status(404).send({ success: false, message: "No User Found" });
    }

    return res.status(200).send({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.log(`allUsersController Error: ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "allUsersController Error", error });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  allUsersController,
};
