import React, { useState } from "react";
import Score from "./Score";
import { Avatar, AvatarImage } from "./ui/avatar";
import type { DataProps, UserProps } from "./types";
import CommentForm from "./CommentForm";

type CommentItemProps = {
  comment: DataProps;
  currentUser: UserProps | null;
  onReply: (parentId: number, content: string, replyingTo: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onVote: (id: number, newScore: number) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onReply,
  onDelete,
  onEdit,
  onVote,
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const isCurrentUser = currentUser?.username === comment?.user?.username;

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent, comment.user.username);
    setReplyContent("");
    setReplying(false);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    onEdit(comment.id, editContent);
    setEditing(false);
  };

  const handleUpvote = () => onVote(comment.id, comment.score + 1);
  const handleDownvote = () => onVote(comment.id, comment.score - 1);

  return (
    <div>
      <div className="flex flex-col md:flex-row pb-22 md:pb-2 p-2 w-[90%] mx-auto md:w-[550px] bg-[#fff] rounded-md">
        <div className="md:pr-5 pr-0 pt-4 md:pt-0 md:order-0 relative">
          <Score
            score={comment?.score ?? 1}
            onUpVote={handleUpvote}
            onDownVote={handleDownvote}
          />
        </div>
        <div className="w-full relative">
          {/* User info */}
          <div className="flex items-center justify-between pl-8">
            <div className="flex items-center gap-2">
              <Avatar className="size-[40px]">
                <AvatarImage
                  src={
                    comment.user?.image?.png.replace("./", "/") ||
                    "images/avatars/image-juliusomo.png"
                  }
                  alt={comment.user.username}
                />
              </Avatar>
              <p className="font-bold">{comment.user.username}</p>
              {isCurrentUser && (
                <span className="flex justify-center items-center bg-[#5457b6] h-[20px] w-[40px] pb-1 text-white rounded-[3px]">
                  you
                </span>
              )}
              <span className="text-[#67727e] font-medium whitespace-nowrap">
                {comment?.createdAt}
              </span>
            </div>
            {/* Comment Actions Btn */}
            <div className="absolute right-0 md:right-0 md:top-0 top-[170px] pt-2">
              {!editing ? (
                <>
                  {isCurrentUser ? (
                    <div className="flex justify-between">
                      <div
                        className="flex gap-[8px] items-center px-5 text-[#ed6468] font-medium cursor-pointer hover:text-[#ffb8bb] transition duration-300 ease-in-out"
                        onClick={() => onDelete(comment.id)}
                      >
                        <img
                          src="images/icon-delete.svg"
                          alt=""
                          className="h-[18px] w-[16px]"
                        />{" "}
                        Delete
                      </div>
                      <div
                        className="flex gap-[8px] items-center text-[#5457b6] font-medium cursor-pointer hover:text-[#c3c4ef] transition duration-300 ease-in-out"
                        onClick={() => setEditing((prev) => !prev)}
                      >
                        <img
                          src="images/icon-edit.svg"
                          alt=""
                          className="h-[18px] w-[16px]"
                        />{" "}
                        Edit
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex gap-[8px] items-center text-[#5457b6] font-medium cursor-pointer hover:text-[#c3c4ef] transition duration-300 ease-in-out"
                        onClick={() => setReplying((prev) => !prev)}
                      >
                        <img src="images/icon-reply.svg" alt="" /> Reply
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Comment Content */}
          <div className="text-[#67727e] font-medium mt-4 pl-8">
            {editing ? (
              <div className="flex flex-col">
                <CommentForm
                  placeholder="Edit your comment..."
                  ButtonLabel="Update"
                  initialValue={editContent}
                  onSubmit={handleEditSubmit}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
            ) : (
              <>
                {comment.replyingTo && (
                  <span className="text-[#5457b6] font-bold">
                    @{comment.replyingTo}{" "}
                  </span>
                )}
                {comment.content}
              </>
            )}
          </div>
        </div>
      </div>
      {replying && (
        <div className="my-5">
          <CommentForm
            placeholder={`Reply to @${comment.user.username}`}
            ButtonLabel="Reply"
            onSubmit={handleReplySubmit}
            initialValue={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
        </div>
      )}
      {comment?.replies && comment.replies?.length > 0 && (
        <div className="scale-x-95 origin-right my-5 border-l-2 border-gray-200 flex flex-col gap-4">
          {comment?.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={{ ...reply, replies: reply.replies || [] }}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
