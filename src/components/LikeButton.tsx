import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const q = query(collection(db, 'likes'), where('songId', '==', songId), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setLiked(true);
          setLikeId(querySnapshot.docs[0].id);
        }
      }
    };

    checkIfLiked();
  }, [user, songId]);

  const handleLike = async () => {
    if (user) {
      if (liked) {
        await deleteDoc(doc(db, 'likes', likeId!));
        setLiked(false);
        setLikeId(null);
      } else {
        const docRef = await addDoc(collection(db, 'likes'), {
          songId,
          userId: user.uid,
        });
        setLiked(true);
        setLikeId(docRef.id);
      }
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Unlike' : 'Like'}
    </button>
  );
};

export default LikeButton;