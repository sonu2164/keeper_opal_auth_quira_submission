const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.note = async (noteId) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: parseInt(noteId),
      },
      include: {
        likes: true,
        user: true,
      },
    });
    return note;
  } catch (error) {
    console.error("Error fetching note:", error);
    throw error;
  }
};

exports.notes = async (userId = "") => {
  try {
    if (userId !== "") {
      const notes = await prisma.note.findMany({
        where: {
          ownerId: parseInt(userId), // Assuming ownerId is correct for user association
        },
        include: {
          likes: true,
          user: true,
        },
      });
      return notes;
    } else {
      const notes = await prisma.note.findMany({
        include: {
          likes: true,
          user: true,
        },
      });
      return notes;
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

exports.newNote = async (note) => {
  try {
    const newNote = await prisma.note.create({
      data: note,
    });
    return newNote;
  } catch (error) {
    console.error("Error creating new note:", error);
    throw error;
  }
};

exports.likeNote = async (noteId, likerId) => {
  try {
    const like = await prisma.like.create({
      data: {
        liker: { connect: { id: parseInt(likerId) } },
        note: { connect: { id: parseInt(noteId) } },
      },
    });

    const note = await prisma.note.update({
      where: { id: parseInt(noteId) },
      data: {
        likes: { connect: { id: parseInt(like.id) } },
      },
      include: {
        likes: true,
        user: true,
      },
    });

    return note;
  } catch (error) {
    console.error("Error liking note:", error);
    throw error;
  }
};

exports.updateNote = async (noteId, title, description) => {
  try {
    const updatedNote = await prisma.note.update({
      where: { id: parseInt(noteId) },
      data: {
        title,
        description,
      },
    });
    return updatedNote;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

exports.deleteNote = async (noteId) => {
  try {
    await prisma.like.deleteMany({ where: { noteId: parseInt(noteId) } }); // Delete associated likes
    await prisma.note.delete({
      where: { id: parseInt(noteId) },
    });
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};
