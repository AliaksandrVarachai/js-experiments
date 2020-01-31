const db = require('./db');

const Query = {
  test: (root, arts, context, info) => 'Test Success, GraphQL server is up & running!!',
  students: async () => Promise.resolve(db.students.list()),
  colleges: async () => Promise.resolve(db.colleges.list()),
  studentById: async (root, args, context, info) => {
    return db.students.get(args.id)
  },
  collegeById: async (root, args, context, info) => db.colleges.get(args.id),
  // variables
  sayHello: async (root, args) => `GraphQL says hi to ${args.name}!`,
  // Enum
  setFavouriteColor: (root, args) => `Favourite color is ${args.color}.`,
};

const Student = {
  fullName: async (root, args, context, info) => `${root.firstName}:${root.lastName}`,
  college: async (root) => db.colleges.get(root.collegeId),
};

const Mutation = {
  createStudent: (root, args, context, info) =>
    db.students.create({
      collegeId: args.collegeId,
      firstName: args.firstName,
      lastName: args.lastName
    }),
  createStudentObject: (...args) => {
    const id = Mutation.createStudent(...args);
    return db.students.get(id);
  },
  deleteStudent: async (root, args) => {
    try {
      db.students.delete(args.id);
      return 1;
    } catch (err) {
      return 0;
    }
  }

};

module.exports = { Query, Student, Mutation };
