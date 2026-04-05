import slugify from "slugify";
import pageModel from "../models/pageModel.js";

const createPageController = async (req, res) => {
  try {
    const { title } = req.body;
    console.log(title,"title");
    if (!title) {
      return res
        .status(400)
        .send({ success: false, message: "Page title is required." });
    }

    const page = await pageModel.findOne({ title });

    if (page) {
      return res
        .status(400)
        .send({ success: false, message: "Page already exists." });
    }

    const newPage = await pageModel.create({
      title,
      slug: slugify(title, { strict: true, lower: true }),
    });

    return res.status(201).send({
      success: true,
      message: "Page created successfully.",
      newPage,
    });
  } catch (error) {
    console.log(`createPageController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "createPageController Error",
      error,
    });
  }
};

const getPagesController = async (req, res) => {
  try {
    const pages = await pageModel.find({});

    if (!pages || pages.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No pages found." });
    }

    return res.status(200).send({
      success: true,
      message: "Pages fetched successfully.",
      pages,
    });
  } catch (error) {
    console.log(`getPagesController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "getPagesController Error",
      error,
    });
  }
};

const getSinglePageController = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await pageModel.findOne({ slug }).populate("sections");

    if (!page) {
      return res
        .status(404)
        .send({ success: false, message: "Page not found." });
    }

    return res.status(200).send({
      success: true,
      message: "Page fetched successfully.",
      page,
    });
  } catch (error) {
    console.log(`getSinglePageController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "getSinglePageController Error",
      error,
    });
  }
};

const deletePageController = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await pageModel.findOneAndDelete({ slug });

    if (!page) {
      return res
        .status(404)
        .send({ success: false, message: "Page not found." });
    }

    return res.status(200).send({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error) {
    console.log(`deletePageController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "deletePageController Error",
      error,
    });
  }
};

export {
  createPageController,
  getPagesController,
  getSinglePageController,
  deletePageController,
};
