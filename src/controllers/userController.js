import * as userService from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ status: "ok", data: user });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(401).json({ status: "error", message: error.message });
  }
};

// Returns the decrypted sensitive information
export const getSensitiveInfo = async (req, res) => {
  try {
    // req.user.id comes from the auth middleware
    const data = await userService.getDecryptedUserInfo(req.user.id);
    res.status(200).json({ status: "ok", data });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserInfo(req.user.id, req.body);
    res.status(200).json({ status: "ok", data: updatedUser });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.user.id);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
