import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, collection, query, getDocs, where } from "firebase/firestore";
import { updateEmail, updateProfile, deleteUser } from "firebase/auth";
import FollowButton from "../components/FollowButton";
import { User } from "lucide-react";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            const newProfile = {
              name: user.displayName || "Anonymous",
              email: user.email,
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          setError("Failed to fetch profile");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchFollowerCount = async () => {
      if (user) {
        const q = query(collection(db, 'followers'), where('followeeId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setFollowerCount(querySnapshot.size);
      }
    };

    fetchFollowerCount();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        if (newName) {
          await updateProfile(user, { displayName: newName });
          await updateDoc(doc(db, "users", user.uid), { name: newName });
        }
        if (newEmail) {
          await updateEmail(user, newEmail);
          await updateDoc(doc(db, "users", user.uid), { email: newEmail });
        }
        setProfile({
          ...profile,
          name: newName || profile.name,
          email: newEmail || profile.email,
        });
        setNewName("");
        setNewEmail("");
        setShowUpdateForm(false);
        toast.success("Profile updated successfully!");
      } catch (err) {
        setError("Failed to update profile");
        toast.error("Failed to update profile");
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        toast.success("Profile deleted successfully!");
      } catch (err) {
        setError("Failed to delete profile");
        toast.error("Failed to delete profile");
      }
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center text-white">Please log in to view your profile.</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96 text-center">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-700 flex items-center justify-center rounded-full">
            <User size={48} className="text-leaf-green" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold">{profile?.name}</h1>
        <p className="text-gray-400">{profile?.email}</p>

        {/* Follower Count */}
        <p className="text-lg font-medium mt-4">Followers: {followerCount}</p>

        {/* Update Profile Button */}
        <div className="mt-4 flex flex-col space-y-3">
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="bg-leaf-green text-black font-medium px-4 py-2 rounded-lg hover:bg-green-500 transition"
          >
            {showUpdateForm ? "Cancel" : "Edit Profile"}
          </button>

          <button
            onClick={handleDeleteProfile}
            className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete Profile
          </button>
        </div>

        {/* Update Form */}
        {showUpdateForm && (
          <div className="mt-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New Name"
              className="mb-2 p-2 w-full bg-gray-800 text-white rounded-lg focus:outline-none"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New Email"
              className="mb-2 p-2 w-full bg-gray-800 text-white rounded-lg focus:outline-none"
            />
            <button
              onClick={handleUpdateProfile}
              className="bg-leaf-green text-black font-medium px-4 py-2 rounded-lg w-full hover:bg-green-500 transition"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Follow Button */}
        <div className="mt-4">
          <FollowButton userIdToFollow={user.uid} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
