import React, { useEffect, useState } from "react";
import type { DataProps, UserProps } from "./types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import DeleteModal from "./DeleteModal";

const CommentList = () => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<DataProps[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number>();

  const handleOpenModal = (id: number) => {
    setSelectedCommentId(id);
    setOpen(true);
  };

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4000/data");
      const data = await response.json();
      setComments(data.comments || []);
      setCurrentUser(data.currentUser);
    } catch (err) {
      console.error("Error fetching comments: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
      const addedComment = await res.json();
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  const handleReply = async (
    parentId: number,
    content: string,
    replyingTo: string
  ): Promise<void> => {
    try {
      const res = await fetch(
        `http://localhost:4000/comments/${parentId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, replyingTo }),
        }
      );

      const newReply = await res.json();

      // Recursive helper to insert the reply at the correct level in state
      const insertReply = (comments: DataProps[]): DataProps[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: insertReply(comment.replies),
            };
          }
          return comment;
        });
      };

      // Update the comments state immutably
      setComments((prev) => insertReply(prev));
    } catch (err) {
      console.error("Error replying:", err);
    }
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await fetch(`http://localhost:4000/comments/${id}`, { method: "DELETE" });
  //     setComments((prev) =>
  //       prev
  //         .map((comment) => ({
  //           ...comment,
  //           replies: (comment.replies ?? []).filter((r) => r.id !== id),
  //         }))
  //         .filter((comment) => comment.id !== id)
  //     );
  //   } catch (err) {
  //     console.error("Error deleting:", err);
  //   }
  // };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:4000/comments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Safely delete recursively
      const deleteRecursively = (list: DataProps[]): DataProps[] => {
        return list
          .filter((item) => item.id !== id)
          .map((item) => ({
            ...item,
            replies: item.replies ? deleteRecursively(item.replies) : [],
          }));
      };

      setComments((prev) => deleteRecursively(prev));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleEdit = async (id: number, content: string) => {
    try {
      const res = await fetch(`http://localhost:4000/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const updated = await res.json();

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === id)
            return { ...comment, content: updated.content };
          return {
            ...comment,
            replies: (comment.replies ?? []).map((r) =>
              r.id === id ? { ...r, content: updated.content } : r
            ),
          };
        })
      );
    } catch (err) {
      console.error("Error editing:", err);
    }
  };

  const handleVote = async (id: number, newScore: number) => {
    try {
      const res = await fetch(`http://localhost:4000/comments/${id}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore }),
      });

      const updated = await res.json();

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === id) return { ...comment, score: updated.score };
          return {
            ...comment,
            replies: (comment.replies ?? []).map((r) =>
              r.id === id ? { ...r, score: updated.score } : r
            ),
          };
        })
      );
    } catch (err) {
      console.error("Error voting:", err);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <div className="flex flex-col gap-5">
        {comments.map((cmmnt) => (
          <CommentItem
            key={cmmnt.id}
            currentUser={currentUser}
            comment={cmmnt}
            onReply={handleReply}
            onDelete={() => handleOpenModal(cmmnt.id)}
            onEdit={handleEdit}
            onVote={handleVote}
          />
        ))}
      </div>

      <CommentForm
        placeholder="Add a comment..."
        ButtonLabel="Send"
        onSubmit={handleAddComment}
        initialValue={newComment}
        onChange={handleChange}
      />

      <DeleteModal
        onCancel={() => setOpen(false)}
        onDelete={() => {
          if (selectedCommentId != null) {
            handleDelete(selectedCommentId);
          }
          setOpen(false);
        }}
        open={open}
      />
    </div>
  );
};

export default CommentList;
