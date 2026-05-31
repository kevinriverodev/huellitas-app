import type { Request, Response } from "express";
import mongoose from "mongoose";
import { fetchRandomDogs, getDogById, getPetLikesCount, getPetSavedCount } from "../services/pet.js";
import { fetchRandomCats, getCatById } from "../services/pet.js";
import { sendError, sendSuccess } from "../helpers/response.js";
import { findOrCreatePet } from "../services/pet.js";
import type { PetItem } from "../interfaces/pet.js";
import { User } from "../models/User.js";
import { Pet } from "../models/Pet.js";

export const getPets = async (req: Request, res: Response) => {
  const { limit, type } = req.query;
  const parsedLimit = limit ? Number(limit) : 10;
  let data: PetItem[];

  try {
    if (type === "dog") data = await fetchRandomDogs(parsedLimit);
    else if (type === "cat") data = await fetchRandomCats(parsedLimit);
    else {
      const response = await Promise.all([
        fetchRandomDogs(Math.round(parsedLimit / 2)),
        fetchRandomCats(Math.round(parsedLimit / 2)),
      ]);

      data = response.flat().sort(() => Math.random() - 0.5);
    }

    return sendSuccess(res, data, 200);
  } catch (error) {
    console.error("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const getPet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.query;
  let data: PetItem;

  if (!id || typeof id !== "string") return sendError(res, "Invalid id format", 400);

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const pet = await Pet.findById(id, "name description category temperament type imageURL").exec();

      if (pet) {
        const { _id, ...petData } = pet.toObject();
        return sendSuccess(res, { id: _id, ...petData }, 200);
      }
    }

    data = type === "dog" ? await getDogById(id) : await getCatById(id);

    return sendSuccess(res, data, 200);
  } catch (error) {
    console.log("Server errror: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const getLikedPets = async (req: Request, res: Response) => {
  if (!req.user) return sendError(res, "Unverified user", 401);

  try {
    const user = await User.findById(req.user.id, "likedPets")
      .populate("likedPets", "name description category temperament type imageURL")
      .lean()
      .exec();

    const formattedPets = (user?.likedPets || []).map((pet) => {
      const { _id, ...data } = pet;
      return { id: _id, ...data };
    });

    return sendSuccess(res, formattedPets, 200);
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const likePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, temperament, type, imageURL } = req.body;

  if (!req.user) return sendError(res, "Unverified user", 401);

  if (!id || typeof id !== "string") return sendError(res, "Invalid Id format", 400);

  try {
    const pet = await findOrCreatePet({
      apiId: id,
      name,
      description,
      category,
      temperament,
      type,
      imageURL,
    });

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { likedPets: pet.id } }).exec();

    const likesCount = await getPetLikesCount(pet.id.toString());

    return sendSuccess(
      res,
      {
        pet,
        likesCount,
        isLiked: true,
      },
      200,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const dislikePet = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) return sendError(res, "Unverified user", 401);

  if (!id || typeof id !== "string") return sendError(res, "Invalid id format", 400);

  try {
    const pet = await Pet.findOne({ apiId: id }, "name description category temperament type imageURL").exec();

    if (!pet) return sendError(res, "Invalid pet id", 400);

    const { _id, ...petData } = pet.toObject();

    await User.findByIdAndUpdate(req.user.id, { $pull: { likedPets: _id } }).exec();

    const likesCount = await getPetLikesCount(_id.toString());

    return sendSuccess(
      res,
      {
        pet: { id: _id, ...petData },
        likesCount,
        isLiked: false,
      },
      200,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const getSavedPets = async (req: Request, res: Response) => {
  if (!req.user) return sendError(res, "Unverified user", 401);

  try {
    const user = await User.findById(req.user.id, "savedPets")
      .populate("savedPets", "name description category temperament type imageURL")
      .lean()
      .exec();

    const formattedPets = (user?.savedPets || []).map((pet) => {
      const { _id, ...data } = pet;
      return { id: _id, ...data };
    });

    return sendSuccess(res, formattedPets, 200);
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const savePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, temperament, type, imageURL } = req.body;

  if (!req.user) return sendError(res, "Unverified user", 401);

  if (!id || typeof id !== "string") return sendError(res, "Invalid id format", 400);

  try {
    const pet = await findOrCreatePet({
      apiId: id,
      name,
      description,
      category,
      temperament,
      type,
      imageURL,
    });

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedPets: pet.id } }).exec();

    const savedCount = await getPetSavedCount(pet.id.toString());

    return sendSuccess(
      res,
      {
        pet,
        savedCount,
        isSaved: true,
      },
      200,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const unsavePet = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) return sendError(res, "Unverified user", 401);

  if (!id || typeof id !== "string") return sendError(res, "Invalid id format", 400);

  try {
    const pet = await Pet.findOne({ apiId: id }, "name description category temperament type imageURL").exec();

    if (!pet) return sendError(res, "Invalid pet id", 400);

    const { _id, ...petData } = pet.toObject();

    await User.findByIdAndUpdate(req.user.id, { $pull: { savedPets: _id } }).exec();

    const savedCount = await getPetSavedCount(_id.toString());

    return sendSuccess(
      res,
      {
        pet: { id: _id, ...petData },
        savedCount,
        isSaved: false,
      },
      200,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const getPetsCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Pet.distinct("category").exec();
    return sendSuccess(res, categories, 200);
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const getTopLikedPets = async (req: Request, res: Response) => {
  const { limit } = req.query;
  const parsedLimit = limit ? Number(limit) : 10;
  try {
    const topLikedPets = await User.aggregate([
      { $unwind: "$likedPets" },

      {
        $group: {
          _id: "$likedPets",
          likesCount: { $sum: 1 },
        },
      },

      { $sort: { likesCount: -1 } },

      { $limit: parsedLimit },

      {
        $lookup: {
          from: "pets",
          localField: "_id",
          foreignField: "_id",
          as: "petDetails",
        },
      },

      { $unwind: "$petDetails" },

      {
        $project: {
          _id: 0,
          id: { $toString: "$petDetails._id" },
          name: "$petDetails.name",
          description: "$petDetails.description",
          category: "$petDetails.category",
          temperament: "$petDetails.temperament",
          type: "$petDetails.type",
          imageURL: "$petDetails.imageURL",
          likesCount: 1,
        },
      },
    ]).exec();

    return sendSuccess(res, topLikedPets, 200);
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};
