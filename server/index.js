const express = require("express");
const axios = require("axios");
const cors = require("cors");
const updateOpaData = require("./src/updata_opa_data").updateOpaData;
const noteshandler = require("./src/noteshandler");
const userhandler = require("./src/userhandler");
const app = express();
const port = 3001;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(cors());

// generic authorization middleware, checks if user is chef means has karma > 49


const authenticate = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>


  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user object to request for further middleware or route handler access
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorization = async (req, res, next) => {


  try {
    const userId = parseInt(req.user.id);

    const noteId = parseInt(req.body.noteId);

    const check = await axios.post(
      "http://localhost:8181/v1/data/app/rbac/allow",
      {
        input: {
          user: userId,
          note: noteId,
        },
      }
    );

    if (check.data.result) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error during authorization check:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.post("/profile", async (req, res) => {
//   // requires authentication
//   const user = await userhandler.fetchProfile(req.body.user);
//   return res.status(200).json(user);
// });

app.post("/user/login", async (req, res) => {

  const { email, password } = req.body;
  const user = await userhandler.loginUser(email, password);
  return res.status(200).json(user);
});

app.post("/user/register", async (req, res) => {

  const { name, email, password, role } = req.body
  const user = await userhandler.registerUser(name, email, password, role);
  await updateOpaData();
  return res.status(200).json(user);
});


app.get("/notes", async (req, res) => {
  // requires nothing
  const notes = await noteshandler.notes();
  return res.status(200).json(notes);
});



app.post("/newNote", authenticate, async (req, res) => {
  // requires authentication
  const noteObj = {
    title: req.body.title,
    description: req.body.description,
    user: { connect: { id: req.user.id } },
  };

  try {
    const note = await noteshandler.newNote(noteObj);
    await updateOpaData(); // Update OPA data after creating a new note
    return res.status(200).json(note);
  } catch (error) {
    console.error("Error creating new note:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});




app.post("/note/update", authenticate, authorization, async (req, res) => {
  // requires authentication and authorization
  const { noteId, title, description } = req.body;

  try {
    const note = await noteshandler.updateNote(noteId, title, description);
    await updateOpaData(); // Update OPA data after updating a note
    return res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/note/delete", authenticate, authorization, async (req, res) => {
  // requires authentication and authorization
  const { noteId } = req.body;
  try {
    const delRes = await noteshandler.deleteNote(noteId);
    await updateOpaData(); // Update OPA data after deleting a note
    return res.status(200).json({ status: delRes });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// app.post("/note/like", authorization, async (req, res) => {
//   // requires authorization
//   const { noteId, userId } = req.body;
//   try {
//     const note = await noteshandler.likeNote(noteId, userId);
//     await updateOpaData(); // Update OPA data after liking a note
//     return res.status(200).json(note);
//   } catch (error) {
//     console.error("Error liking note:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.listen(port, () => {
  console.log(`app server listening on port ${port}`);
});
