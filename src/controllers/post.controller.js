import Post from "../models/Post.js";

// Helper para limpiar URLs de video
const normalizeVideoUrl = (postData) => {
  if (
    postData.mediaUrl &&
    (postData.mediaType === "video" || postData.mediaType === "reel")
  ) {
    if (postData.mediaUrl.includes("youtube.com/watch?v=")) {
      const videoId = postData.mediaUrl.split("v=")[1]?.split("&")[0];
      postData.mediaUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (postData.mediaUrl.includes("youtu.be/")) {
      const videoId = postData.mediaUrl.split("youtu.be/")[1]?.split("?")[0];
      postData.mediaUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }
  return postData;
};

export const getPublicPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "published" }).sort({
      publishAt: -1,
    });
    res.json({ ok: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getAdminPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPublicPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ ok: false, message: "No encontrado" });
    res.json({ ok: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const postData = normalizeVideoUrl({ ...req.body });
    const post = await Post.create(postData);
    res.status(201).json({ ok: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postData = normalizeVideoUrl({ ...req.body });
    const post = await Post.findByIdAndUpdate(req.params.id, postData, {
      new: true,
    });
    res.json({ ok: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePostStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ ok: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
