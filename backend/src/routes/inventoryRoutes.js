import express from "express";
import {
  createMovement,
  createProduct,
  getCategories,
  getMovements,
  getProducts,
  updateProduct,
} from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/categories", getCategories);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.post("/products/:id/movement", createMovement);
router.get("/movements", getMovements);

export default router;

