import axios from "axios";
import { Pet, type PetAttributes } from "../models/Pet.js";
import { User } from "../models/User.js";

export const fetchRandomDogs = async (limit: number) => {
  try {
    const response = await axios.get(`${process.env.DOG_API_BASE_URL}/images/search`, {
      params: {
        limit,
      },
      headers: {
        "x-api-key": process.env.DOG_API_KEY || "",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Failed to fetch dogs from API", error);
    throw error;
  }
};

export const getDogById = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.DOG_API_BASE_URL}/images/${id}`, {
      headers: {
        "x-api-key": process.env.DOG_API_KEY || "",
      },
    });

    return { ...response.data, type: "dog" };
  } catch (error) {
    console.log("Failed to fetch dog data from API", error);
    throw error;
  }
};

export const fetchRandomCats = async (limit: number) => {
  try {
    const response = await axios.get(`${process.env.CAT_API_BASE_URL}/images/search`, {
      params: {
        limit,
      },
      headers: {
        "x-api-key": process.env.CAT_API_KEY || "",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Failed to fetch cats from API", error);
    throw error;
  }
};

export const getCatById = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.CAT_API_BASE_URL}/images/${id}`, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY || "",
      },
    });

    return { ...response.data, type: "cat" };
  } catch (error) {
    console.log("Failed to fetch cat data from API", error);
    throw error;
  }
};

export const findOrCreatePet = async (petData: PetAttributes) => {
  try {
    let pet = await Pet.findOne({ apiId: petData.apiId }).exec();

    if (!pet) {
      pet = new Pet({ ...petData });

      await pet.save();
    }

    const { _id, __v, apiId: apiIdentifier, createdAt, updatedAt, ...data } = pet.toObject();

    return { id: _id, ...data };
  } catch (error) {
    console.log("Server error: ", error);
    throw error;
  }
};

export const getPetLikesCount = async (id: string) => {
  try {
    return await User.countDocuments({ likedPets: id });
  } catch (error) {
    console.log("Server error: ", error);
    throw error;
  }
};

export const getPetSavedCount = async (id: string) => {
  try {
    return await User.countDocuments({ savedPets: id });
  } catch (error) {
    console.log("Server error", error);
    throw error;
  }
};
