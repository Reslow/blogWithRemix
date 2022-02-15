const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPosts().map((post) => {
      return db.post.create({ data: post });
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
