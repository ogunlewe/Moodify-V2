import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface CommentProps {
  songId: string;
}

interface Comment {
  id: string;
  songId: string;
  text: string;
  timestamp: any;
}

const Comment: React.FC<CommentProps> = ({ songId }) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, "comments"), where("songId", "==", songId), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [songId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    try {
      await addDoc(collection(db, "comments"), {
        songId,
        text: comment,
        timestamp: new Date(),
      });
      setComment("");
      // Refresh comments
      const q = query(collection(db, "comments"), where("songId", "==", songId), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="p-2 rounded-md bg-gray-800 text-white focus:outline-none"
        />
        <button type="submit" className="bg-green-500 p-2 rounded-md hover:bg-green-400">
          Submit
        </button>
      </form>
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-2 rounded-md mb-2">
            <p className="text-white">{comment.text}</p>
            <p className="text-gray-400 text-sm">{new Date(comment.timestamp.toDate()).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;