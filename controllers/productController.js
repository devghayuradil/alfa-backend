import slugify from "slugify";
import productModel from "../models/productModel.js";
import {
  deleteImageOnCloudinary,
  uploadImageOnCloudinary,
} from "../helper/cloudinaryHelper.js";

const createProductController = async (req, res) => {
  try {
    const { title, description, price, collection } = req.body;
    const picture = req.file?.fieldname;
    const picturePath = req.file?.path;

    if (
      !title ||
      !description ||
      !price ||
      !collection ||
      !picture ||
      !picturePath
    ) {
      return res.status(400).send({
        success: false,
        message: "all fields are required.",
      });
    }

    console.log(picturePath, "picturePath");
    // uploading image on cloudinary
    const { secure_url, public_id } = await uploadImageOnCloudinary(
      picturePath,
      "products"
    );

    if (!secure_url) {
      res.status(400).send({
        success: false,
        message: "error while uploading Image",
        error: secure_url,
      });
    }

    // const product = await productModel.findOne({ title });
    // if (product) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Product already exist.",
    //   });
    // }

    const newProduct = await productModel.create({
      title,
      slug: slugify(title, { strict: true }),
      description,
      price,
      collection,
      user: req.user._id,
      picture: {
        secure_url,
        public_id,
      },
    });

    return res.status(201).send({
      success: true,
      message: "Product added successfully.",
      newProduct,
    });
  } catch (error) {
    console.log("createProductController error :", error);
    res.status(400).send({
      success: false,
      message: "createProductController error",
      error,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("user", "name")
      .populate("collection", "name");

    if (!products) {
      return res
        .status(404)
        .send({ success: false, message: "No Products Found" });
    }

    res.status(200).send({
      success: true,
      message: "Products fetched successfully.",
      products,
    });
  } catch (error) {
    console.log("getProductController error: ", error);
    res.status(400).send({
      success: false,
      message: "getProductController error",
      error,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.findOneAndDelete({ slug });

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "No Product Found" });
    }

    if (product.picture && product.picture.public_id) {
      await deleteImageOnCloudinary(product.picture.public_id);
    }

    res.status(200).send({
      success: true,
      message: "Product Deleted successfully.",
    });
  } catch (error) {
    console.log("deleteProductController error: ", error);
    res.status(400).send({
      success: false,
      message: "deleteProductController error",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .populate("user", "name")
      .populate("collection", "name");

    if (!product) {
      res.status(400).send({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "product fetched successfully...",
      product,
    });
  } catch (error) {
    console.log("getSingleProduct error: ", error);
    res.status(404).send({
      success: false,
      message: "getSingleProduct error",
      error,
    });
  }
};

const updateSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, collection, price } = req.body;
    const picturePath = req.file?.path;

    let product = await productModel.findOne({ slug });
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product not found.",
      });
    }

    if (title) {
      product.title = title;
      product.slug = slugify(title, { strict: true, unique: true });
    }
    if (description) product.description = description;
    if (collection) product.collection = collection;
    if (price) product.price = price;

    if (picturePath) {
      if (product.picture?.public_id) {
        await deleteImageOnCloudinary(product.picture.public_id);
      }

      const { public_id, secure_url } = await uploadImageOnCloudinary(
        picturePath,
        "products"
      );

      product.picture = {
        public_id,
        secure_url,
      };
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("updateSingleProduct error: ", error);
    res.status(404).send({
      success: false,
      message: "updateSingleProduct error",
      error,
    });
  }
};

export {
  getProductController,
  getSingleProductController,
  createProductController,
  deleteProductController,
  updateSingleProductController,
};
