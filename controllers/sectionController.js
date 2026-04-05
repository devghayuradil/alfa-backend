import sectionModel from "../models/sectionModel.js";

const addSectionController = async (req, res) => {
  try {
    const { pageId, type } = req.body;

    if (!pageId || !type) {
      return res.status(400).send({
        success: false,
        message: "pageId and type are required.",
      });
    }

    const section = await sectionModel.create({
      pageId,
      type,
      content: {},
    });

    await pageModel.findByIdAndUpdate(pageId, {
      $push: { sections: section._id },
    });

    return res.status(201).send({
      success: true,
      message: "Section added successfully.",
      section,
    });
  } catch (error) {
    console.log(`addSectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "addSectionController Error",
      error,
    });
  }
};

const updateSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const section = await sectionModel.findByIdAndUpdate(
      id,
      { content },
      { new: true },
    );

    if (!section) {
      return res
        .status(404)
        .send({ success: false, message: "Section not found." });
    }

    return res.status(200).send({
      success: true,
      message: "Section updated successfully.",
      section,
    });
  } catch (error) {
    console.log(`updateSectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "updateSectionController Error",
      error,
    });
  }
};

const deleteSectionController = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await sectionModel.findByIdAndDelete(id);

    if (!section) {
      return res
        .status(404)
        .send({ success: false, message: "Section not found." });
    }

    return res.status(200).send({
      success: true,
      message: "Section deleted successfully.",
    });
  } catch (error) {
    console.log(`deleteSectionController Error: ${error}`);
    return res.status(400).send({
      success: false,
      message: "deleteSectionController Error",
      error,
    });
  }
};

export {
  addSectionController,
  updateSectionController,
  deleteSectionController,
};
