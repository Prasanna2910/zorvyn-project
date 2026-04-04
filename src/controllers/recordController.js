const prisma = require("../config/db");

const VALID_TYPES = ["INCOME", "EXPENSE"];

// ================= VALIDATION =================
const parseAndValidateRecordInput = (body) => {
  const { amount, type, category, date, note } = body;

  const parsedAmount = Number(amount);
  const normalizedType = typeof type === "string" ? type.toUpperCase() : "";

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return { error: "Amount must be a positive number" };
  }

  if (!VALID_TYPES.includes(normalizedType)) {
    return { error: "Type must be either INCOME or EXPENSE" };
  }

  if (!category || typeof category !== "string") {
    return { error: "Category is required" };
  }

  if (!date) {
    return { error: "Date is required" };
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "Date must be a valid date" };
  }

  return {
    data: {
      amount: parsedAmount,
      type: normalizedType,
      category: category.trim(),
      date: parsedDate,
      note: typeof note === "string" && note.trim() ? note.trim() : null,
    },
  };
};

// ================= CREATE RECORD =================
// POST /records (ADMIN)
exports.createRecord = async (req, res) => {
  try {
    const validation = parseAndValidateRecordInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    // 🔥 FIX: get userId from token (NOT request body)
    const userId = req.user.userId;

    const record = await prisma.record.create({
      data: {
        ...validation.data,
        userId,
      },
    });

    return res.status(201).json(record);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= GET ALL RECORDS =================
// GET /records (ADMIN, ANALYST)
exports.getAllRecords = async (_req, res) => {
  try {
    const records = await prisma.record.findMany({
      orderBy: { date: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= GET MY RECORDS =================
// GET /records/my
exports.getMyRecords = async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: "desc" },
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= UPDATE RECORD =================
// PATCH /records/:id (ADMIN)
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const existingRecord = await prisma.record.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updateData = {};
    const { amount, type, category, date, note } = req.body;

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number" });
      }
      updateData.amount = parsedAmount;
    }

    if (type !== undefined) {
      const normalizedType = String(type).toUpperCase();
      if (!VALID_TYPES.includes(normalizedType)) {
        return res
          .status(400)
          .json({ message: "Type must be either INCOME or EXPENSE" });
      }
      updateData.type = normalizedType;
    }

    if (category !== undefined) {
      if (!category || typeof category !== "string") {
        return res.status(400).json({ message: "Category must be a string" });
      }
      updateData.category = category.trim();
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Date must be a valid date" });
      }
      updateData.date = parsedDate;
    }

    if (note !== undefined) {
      updateData.note =
        typeof note === "string" && note.trim() ? note.trim() : null;
    }

    // ❌ IMPORTANT: Do NOT allow changing userId
    // This prevents ownership tampering

    const updatedRecord = await prisma.record.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= DELETE RECORD =================
// DELETE /records/:id (ADMIN)
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const existingRecord = await prisma.record.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    await prisma.record.delete({ where: { id } });

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};