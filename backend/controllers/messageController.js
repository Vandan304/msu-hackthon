import { SecretMessage } from "../models/message.js";
import bcrypt from "bcryptjs";

// ✅ POST: Create a Secret Message
export const createSecretMessage = async (req, res) => {
  try {
    const { message, password } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newMessage = new SecretMessage({
      message,
      password: hashedPassword,
    });

    await newMessage.save();
    res.status(201).json({ message: "Secret message saved successfully", id: newMessage._id });
  } catch (error) {
    console.error("❌ Error creating secret message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET: Retrieve a Secret Message (Deletes after viewing)
export const getSecretMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const secretMessage = await SecretMessage.findById(id);

    if (!secretMessage) {
      return res.status(404).json({ error: "Message not found or already deleted" });
    }

    // Check password if required
    if (secretMessage.password) {
      if (!password) {
        return res.status(401).json({ error: "Password required" });
      }

      const isMatch = await bcrypt.compare(password, secretMessage.password);
      if (!isMatch) {
        return res.status(403).json({ error: "Incorrect password" });
      }
    }

    // Store the message temporarily before deleting
    const messageContent = secretMessage.message;

    // Delete the message after viewing
    await SecretMessage.findByIdAndDelete(id);

    res.status(200).json({ message: messageContent });
  } catch (error) {
    console.error("❌ Error retrieving secret message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
