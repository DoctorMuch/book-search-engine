const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })

        return userData;
      }
      throw new AuthenticationError('You are not logged in.');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect login credentials.');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect login credentials.');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { content }, context) => {
      console.log(content);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: content } },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('You must be logged in to save a book.');

    },
    removeBook: async (parent, { bookId, content }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId, content } } },
          { new: true }
        )
        return updatedUser;
      }

    }
  }
};

module.exports = resolvers;