import { adminModel } from "../models/adminModel.js";

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            success: false,
            message: "All Fields are required",
        });
    }
    try {
        // req.body is {username:"havyas",password:"havyas@1234"}

        const adminExists = await adminModel.findOne({
            username: username
        });

        if (!adminExists) {
            return res.json({
                success: false,
                message: "Username Invalid",
            });
        }

        const isPasswordValid = (adminExists.password == password);

        if (isPasswordValid) {
            return res.json({
                success: true,
                message: "Login Successful",
            });
        } else {
            return res.json({
                success: false,
                message: "Invalid Password",
            });
        }

    } catch (error) {
        console.log("Error while admin login", error);
        res.json({
            success: false,
            message: "Server error",
        });
    }
};

