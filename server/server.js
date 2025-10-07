import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Path to your data.json file
const filePath = path.join(__dirname, "data.json");

// Read helper
function readJson() {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Write helper
function writeJson(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/* ------------------ ROUTES ------------------ */

// ✅ Get all comments + currentUser
app.get("/data", (req, res) => {
  const data = readJson();
  res.json(data);
});

// ✅ Add a new top-level comment
app.post("/comments", (req, res) => {
  const data = readJson();

  const newComment = {
    id: Date.now(),
    content: req.body.content,
    createdAt: "just now",
    score: 0,
    user: data.currentUser,
    replies: [],
  };

  data.comments.push(newComment);
  writeJson(data);

  res.json(newComment);
});

// ✅ Add a reply to a specific comment
app.post("/comments/:id/replies", (req, res) => {
  const data = readJson();
  const parentId = Number(req.params.id);

  // Recursive helper function to find and insert a reply at any level
  const addReply = (comments) => {
    for (const comment of comments) {
      if (comment.id === parentId) {
        const newReply = {
          id: Date.now(),
          content: req.body.content,
          createdAt: "just now",
          score: 0,
          replyingTo: req.body.replyingTo,
          user: data.currentUser, // ✅ always attach current user
          replies: [], // ✅ support further nesting
        };

        comment.replies = comment.replies || [];
        comment.replies.push(newReply);
        return newReply; // ✅ stop recursion once inserted
      }

      // 🔁 Recurse deeper if this comment has replies
      if (comment.replies && comment.replies.length > 0) {
        const newReply = addReply(comment.replies);
        if (newReply) return newReply;
      }
    }
    return null;
  };

  const newReply = addReply(data.comments);

  if (!newReply) {
    return res.status(404).json({ error: "Parent comment not found" });
  }

  writeJson(data);
  res.json(newReply);
});

// ✅ Update score (upvote/downvote) for comment or reply
app.put("/comments/:id/score", (req, res) => {
  const data = readJson();
  const id = Number(req.params.id);

  let target = data.comments.find((c) => c.id === id);

  // If not a top-level comment, search in replies
  if (!target) {
    for (const comment of data.comments) {
      target = comment.replies.find((r) => r.id === id);
      if (target) break;
    }
  }

  if (!target) {
    return res.status(404).json({ error: "Comment/Reply not found" });
  }

  target.score = req.body.score;
  writeJson(data);

  res.json(target);
});

// ✅ Edit a comment or reply
app.put("/comments/:id", (req, res) => {
  const data = readJson();
  const id = Number(req.params.id);

  let target = data.comments.find((c) => c.id === id);

  if (!target) {
    for (const comment of data.comments) {
      target = comment.replies.find((r) => r.id === id);
      if (target) break;
    }
  }

  if (!target) {
    return res.status(404).json({ error: "Comment/Reply not found" });
  }

  target.content = req.body.content ?? target.content;
  writeJson(data);

  res.json(target);
});

// ✅ Delete a comment or reply
// app.delete("/comments/:id", (req, res) => {
//   const data = readJson();
//   const id = Number(req.params.id);

//   // Try delete from top-level comments
//   const commentIndex = data.comments.findIndex((c) => c.id === id);
//   if (commentIndex !== -1) {
//     data.comments.splice(commentIndex, 1);
//     writeJson(data);
//     return res.json({ success: true });
//   }

//   // Try delete from replies
//   for (const comment of data.comments) {
//     const replyIndex = comment.replies.findIndex((r) => r.id === id);
//     if (replyIndex !== -1) {
//       comment.replies.splice(replyIndex, 1);
//       writeJson(data);
//       return res.json({ success: true });
//     }
//   }

//   res.status(404).json({ error: "Comment/Reply not found" });
// });

app.delete("/comments/:id", (req, res) => {
  const data = readJson();
  const id = Number(req.params.id);

  // Helper function: recursively delete a comment/reply by ID
  const deleteRecursively = (comments, id) => {
    for (let i = comments.length - 1; i >= 0; i--) {
      const comment = comments[i];

      // If this comment matches, delete it
      if (comment.id === id) {
        comments.splice(i, 1);
        return true;
      }

      // Otherwise, check its replies recursively
      if (comment.replies && deleteRecursively(comment.replies, id)) {
        return true;
      }
    }
    return false;
  };

  // Perform deletion
  const deleted = deleteRecursively(data.comments, id);

  if (deleted) {
    writeJson(data);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Comment or reply not found" });
  }
});


/* ------------------ START SERVER ------------------ */

app.listen(4000, () =>
  console.log("🚀 Server running at http://localhost:4000")
);
