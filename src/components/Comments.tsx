import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';

interface Comment {
  id: string;
  songId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

interface CommentsProps {
  songId: string;
}

const Comments: React.FC<CommentsProps> = ({ songId }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, 'comments'), where('songId', '==', songId));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    };

    fetchComments();
  }, [songId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await addDoc(collection(db, 'comments'), {
        songId,
        userId: user.uid,
        text: commentText,
        createdAt: new Date(),
      });
      setCommentText('');
      // Refresh comments
      const q = query(collection(db, 'comments'), where('songId', '==', songId));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;