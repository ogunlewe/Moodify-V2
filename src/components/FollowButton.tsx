import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";

interface FollowButtonProps {
  userIdToFollow: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userIdToFollow }) => {
  const [user] = useAuthState(auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState<string | null>(null);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (user) {
        const q = query(collection(db, 'followers'), where('followeeId', '==', userIdToFollow), where('followerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsFollowing(true);
          setFollowId(querySnapshot.docs[0].id);
        }
      }
    };

    checkIfFollowing();
  }, [user, userIdToFollow]);

  const toggleFollow = async () => {
    if (user) {
      if (isFollowing) {
        await deleteDoc(doc(db, 'followers', followId!));
        setIsFollowing(false);
        setFollowId(null);
      } else {
        const docRef = await addDoc(collection(db, 'followers'), {
          followeeId: userIdToFollow,
          followerId: user.uid,
          createdAt: new Date(),
        });
        setIsFollowing(true);
        setFollowId(docRef.id);
      }
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition"
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;