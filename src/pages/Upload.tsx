import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { CloudUpload, Music, User, Smile } from "lucide-react";
import { toast } from "react-toastify";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [user] = useAuthState(auth);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) {
      toast.error('Please select a file and ensure you are logged in.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "moodify_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dctspbnuy/raw/upload",
        formData
      );

      const downloadURL = response.data.secure_url;

      await addDoc(collection(db, "songs"), {
        title,
        artist,
        mood,
        url: downloadURL,
        userId: user.uid,
        uploaderName: user.displayName || "Anonymous",
        createdAt: new Date(),
      });

      setFile(null);
      setTitle("");
      setArtist("");
      setMood("");
      toast.success("Upload successful!");
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Upload Music</h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <label className="block cursor-pointer bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-gray-400 flex justify-center items-center space-x-2">
            <CloudUpload size={20} />
            <span>{file ? file.name : "Choose a file"}</span>
            <input type="file" onChange={handleFileChange} className="hidden" required />
          </label>

          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
            <Music size={20} className="text-gray-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
            <User size={20} className="text-gray-400" />
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist"
              required
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
            <Smile size={20} className="text-gray-400" />
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Mood"
              required
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-2 rounded-lg w-full"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
