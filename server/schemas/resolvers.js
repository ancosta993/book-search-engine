const {User} = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
   Query: {
      me: async(parent, args, context) => {
         if (context.user){
            const userData = await User.findById(
               {_id: context.user._id}
            ).select('-_v -password')
            return userData
         }

         throw new AuthenticationError('Not logged in');
      }
   },

   Mutation: {
      addUser: async(parents, args) => {
         const user = await User.create(args);
         const token = signToken(user);
         return {token, user};
      },
      login: async(parent, {email, password}) => {
         const user = await User.findOne({email});

         if(!user) {
            throw new AuthenticationError('Incorrect credentials')
         }

         const correctPw = await user.isCorrectPassword(password);

         if(!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
         }

         const token = signToken(user);
         return {token, user};
      },
      saveBook: async(parent, args, context) => {
         if(context.user){
            const updatedUser = User.findOneAndUpdate(
               {_id: context.user._id},
               {$push:{savedBooks:args}},
               {new:true, runValidators: true}
            )

            return updatedUser;
         }
         throw new AuthenticationError('You need to be logged in!');
      },
      // removeBook will only take the bookId as arg
      removeBook: async(parent, {bookId}, context) => {
         if(context.user) {
            const updatedUser = User.findOneandUpdate(
               {_id:context.user._id},
               {$pull:{savedBooks:bookId}},
               {new:true, runValidators:true}
            )
            return updatedUser;
         }

         throw new AuthenticationError('You need to be logged in!');
      }
   }
}