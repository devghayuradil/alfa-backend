import slugify from "slugify";
import collectionModel from "../models/collectionModel.js";
import productModel from "../models/productModel.js";

const createCollectionController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Name is required." });
    }
    const collection = await collectionModel.findOne({ name });
    if (collection) {
      return res
        .status(400)
        .send({ success: false, message: "Collection already exist." });
    }

    // creating new collection
    const newCollection = await collectionModel.create({
      name,
      slug: slugify(name, { strict: true }),
    });

    return res.status(201).send({
      success: true,
      message: "Collection added successfully.",
      newCollection,
    });
  } catch (error) {
    console.log(`createCollectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "createCollectionController Error",
      error,
    });
  }
};

const deleteCollectionController = async (req, res) => {
  try {
    const { slug } = req.params;

    const collection = await collectionModel.findOneAndDelete({ slug });

    if (!collection) {
      return res
        .status(400)
        .send({ success: false, message: "Collection Not Found." });
    }

    return res.status(200).send({
      success: true,
      message: "Collection Deleted successfully.",
    });
  } catch (error) {
    console.log(`deleteCollectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "deleteCollectionController Error",
      error,
    });
  }
};
const updateCollectionController = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    //validation check
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    const collection = await collectionModel.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name, { strict: true, lower: true }) },
      { new: true },
    );

    if (!collection) {
      return res
        .status(400)
        .send({ success: false, message: "Collection Not Found." });
    }

    return res.status(200).send({
      success: true,
      message: "Collection Updated successfully.",
      collection,
    });
  } catch (error) {
    console.log(`updateCollectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "updateCollectionController Error",
      error,
    });
  }
};

const getCollectionsController = async (req, res) => {
  try {
    const collections = await collectionModel.find({});
    console.log(collections,"collections");
    if (collections.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No collections Found", collections });
    }
    return res.status(201).send({
      success: true,
      message: "Collections fetched successfully.",
      collections,
    });
  } catch (error) {
    console.log(`getCollectionsController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "getCollectionsController Error",
      error,
    });
  }
};

const getProductsByCollectionController = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res
        .status(400)
        .send({ success: false, message: "slug is required." });
    }
    const collection = await collectionModel.findOne({ slug });

    if (!collection) {
      return res
        .status(404)
        .send({ success: false, message: "No collection Found" });
    }

    const products = await productModel
      .find({ collection: collection._id })
      .populate("collection", "name slug");

    if (!products || products.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No products found for this collection.",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Products fetched successfully.",
      products,
    });
  } catch (error) {
    console.log(`getProductsByCollectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "getProductsByCollectionController Error",
      error,
    });
  }
};

export {
  createCollectionController,
  deleteCollectionController,
  updateCollectionController,
  getCollectionsController,
  getProductsByCollectionController,
};
