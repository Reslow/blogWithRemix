const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // sample user ava
  const ada = await prisma.user.create({
    data: {
      username: "ada",
      // password = twixrox
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      const data = {
        userId: ada.id,
        ...post,
      };
      return prisma.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  return [
    {
      title: "Javascript",
      body: "this is my javascript blog post conent",
    },
    {
      title: "HTML & CSS",
      body: "HTML AND CSS IS KING blog post conent",
    },
    {
      title: "I am learnign REMIX",
      body: "Working with this tuturial is awesome blog post conent",
    },
    {
      title: "I know how to code, do you?",
      body: "everything is just 010101010101",
    },
  ];
}
