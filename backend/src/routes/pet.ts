import { Router } from "express";
import {
  dislikePet,
  getLikedPets,
  getPet,
  getPetsCategories,
  getPets,
  getSavedPets,
  likePet,
  savePet,
  unsavePet,
  getTopLikedPets,
} from "../controllers/pet.js";
import validateJWT from "../middlewares/validate-jwt.js";
import validateZodSchema from "../middlewares/validate-zod-schema.js";
import { getPetSchema, getPetsSchema, petSchema, topLikedPetLimitSchema } from "../schemas/pet.js";

const router = Router();

router.get("/top", [validateJWT, validateZodSchema(topLikedPetLimitSchema)], getTopLikedPets);

router.get("/liked", [validateJWT], getLikedPets);

router.get("/saved", [validateJWT], getSavedPets);

router.get("/categories", [validateJWT], getPetsCategories);

router.get("/", [validateJWT, validateZodSchema(getPetsSchema)], getPets);

router.get("/:id", [validateJWT, validateZodSchema(getPetSchema)], getPet);

router.post("/:id/like", [validateJWT, validateZodSchema(petSchema)], likePet);

router.delete("/:id/like", [validateJWT], dislikePet);

router.post("/:id/save", [validateJWT, validateZodSchema(petSchema)], savePet);

router.delete("/:id/save", [validateJWT], unsavePet);

export { router as petRouter };
