import { Request, Response } from "express"
import User from "../models/UserModel.js";
import bcrypt from "bcrypt"

//! regitser user

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist" });
        }

        //! hash the password
        const saltedValue = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedValue);

        // ! create new user 
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // ! set user data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        return res.json({
            message: "Account created succesfully!",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


//! login user

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or Password" });
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            return res.status(400).json({ message: "Invalid email or Password" });
        }

        // ! set user data in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        return res.json({
            message: "Login Successfull!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// ! Logout Controller function

export const logoutUser = async (req: Request, res: Response) => {
    req.session.destroy((error: any) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        return res.json({ message: "Logged Out Successfully!" });
    })
}

//! verify user
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select("-password");//! query projection for a specific field
        if (!user) {
            return res.status(400).json({ message: "Invalid User!" });
        }
        return res.json({ user })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}