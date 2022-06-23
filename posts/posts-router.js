const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
} = require("graphql");

const Posts = require("./posts-helpers");
const Comments = require("../comments/comments-helpers");
const Users = require("../users/users-helpers");
const { CommentType } = require("../comments/comments-router");

//post schema for post list
const PostType = new GraphQLObjectType({
  name: "Posts",
  description: "Get a list of posts",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    method: { type: GraphQLString },
    liked: { type: GraphQLBoolean },
    user_id: { type: new GraphQLNonNull(GraphQLInt) },
    //list of comments for a post
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async (post) => {
        let comments = await Comments.getComments();
        return comments.filter((comment) => comment.post_id === post.id);
      },
    },
  }),
});

// get posts from db
const getPosts = {
  type: new GraphQLList(PostType),
  description: "get list of posts",
  resolve: (parent, args) => {
    return Posts.getPosts();
  },
};

// get post by Id from db
const getPostId = {
  type: PostType,
  description: "get post by id",
  args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
  resolve: async (parent, args) => {
    let postById = await Posts.getPostById(args.id);
    if (!postById) throw new Error(`no id of ${args.id} found`);
    return Posts.getPostById(args.id);
  },
};

// create post
const createPost = {
  type: PostType,
  description: "create a new post",
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    method: { type: GraphQLString },
    liked: { type: GraphQLBoolean },
    user_id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args) => {
    let newPost = {
      title: args.title,
      date: args.date,
      image: args.image,
      content: args.content,
      method: args.method,
      liked: args.liked,
      user_id: args.user_id,
    };
    let users = await Users.getUsers();
    let result = users.find((user) => user.id === args.user_id);
    if (!result) throw new Error(`user ID # ${args.id} doesn't exist`);

    let posts = await Posts.addPost(newPost);
    return posts;
  },
};

// update post by id
const updatePost = {
  type: PostType,
  description: "update post by id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    method: { type: GraphQLString },
    liked: { type: GraphQLBoolean },
    image: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    let post = {
      method: args.method,
      liked: args.liked,
      image: args.image,
    };
    let postById = await Posts.getPostById(args.id);
    if (!postById) throw new Error(`post ID # ${args.id} does not exist`);
    return Posts.updatePost(post, args.id);
  },
};

// delete post by id
const deletePost = {
  type: PostType,
  description: "delete post by id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args) => {
    let postById = await Posts.getPostById(args.id);
    if (!postById) throw new Error(`post ID # ${args.id} does not exist`);
    return Posts.deletePost(args.id);
  },
};

//export modules for posts router
module.exports = {
  getPosts,
  getPostId,
  createPost,
  PostType,
  updatePost,
  deletePost,
};
