const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.registerUser = async (name, email, password, role = 'member') => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,

  );

  return { user: newUser, token };
}

exports.loginUser = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Incorrect password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  return { user, token };
}


// exports.fetchProfile = async (user) => {
//   try {
//     // Checking if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: user.email,
//       },
//     });

//     if (existingUser) {
//       return existingUser; // Return existing user if found
//     } else {
//       // Create new user if not found
//       const newUser = await prisma.user.create({
//         data: {
//           name: user.name,
//           email: user.email,
//         },
//       });
//       return newUser;
//     }
//   } catch (error) {
//     console.error("Error fetching or creating user:", error);
//     throw error; // Throw error for handling in higher layers
//   }
// };

// Uncomment and modify as needed for update location functionality
// export const updateLocation = async (user, location) => {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { email: user.email },
//       data: {
//         location: location,
//       },
//     });
//     return updatedUser;
//   } catch (error) {
//     console.error("Error updating user location:", error);
//     throw error;
//   }
// };
