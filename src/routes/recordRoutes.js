const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  createRecord,
  getAllRecords,
  getMyRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

router.use(authMiddleware);

router.post("/", authorizeRoles("ADMIN"), createRecord);
router.get("/", authorizeRoles("ADMIN", "ANALYST"), getAllRecords);
router.get("/my", getMyRecords);
router.patch("/:id", authorizeRoles("ADMIN"), updateRecord);
router.delete("/:id", authorizeRoles("ADMIN"), deleteRecord);

module.exports = router;
