import { Confession } from "../models/confession.js";

// ✅ CREATE a new confession
export const postConfession = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Confession content is required" });
    }

    const newConfession = new Confession({ content });
    await newConfession.save();

    res.status(201).json({ message: "Confession posted successfully", confession: newConfession });
  } catch (error) {
    console.error("❌ Confession Post Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ READ all confessions
export const getAllConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(confessions);
  } catch (error) {
    console.error("❌ Fetch Confessions Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ UPDATE a confession
export const updateConfession = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Confession content is required" });
    }

    const updatedConfession = await Confession.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!updatedConfession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    res.status(200).json({ message: "Confession updated successfully", confession: updatedConfession });
  } catch (error) {
    console.error("❌ Update Confession Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ DELETE a confession
export const deleteConfession = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedConfession = await Confession.findByIdAndDelete(id);

    if (!deletedConfession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    res.status(200).json({ message: "Confession deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Confession Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
