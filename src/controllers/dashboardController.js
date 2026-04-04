const prisma = require("../config/db");

// GET /dashboard/summary
exports.getSummary = async (_req, res) => {
  try {
    const totalsByType = await prisma.record.groupBy({
      by: ["type"],
      _sum: {
        amount: true,
      },
    });

    const totalIncome =
      totalsByType.find((item) => item.type === "INCOME")?._sum.amount || 0;
    const totalExpense =
      totalsByType.find((item) => item.type === "EXPENSE")?._sum.amount || 0;

    return res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /dashboard/category-wise
exports.getCategoryWise = async (_req, res) => {
  try {
    const grouped = await prisma.record.groupBy({
      by: ["category"],
      _sum: {
        amount: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    const formatted = grouped.map((item) => ({
      category: item.category,
      total: item._sum.amount || 0,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /dashboard/recent
exports.getRecent = async (_req, res) => {
  try {
    const records = await prisma.record.findMany({
      orderBy: {
        date: "desc",
      },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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

// GET /dashboard/monthly
exports.getMonthly = async (_req, res) => {
  try {
    const groupedByDateAndType = await prisma.record.groupBy({
      by: ["date", "type"],
      _sum: {
        amount: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const monthMap = new Map();

    for (const item of groupedByDateAndType) {
      const month = item.date.toISOString().slice(0, 7); // YYYY-MM
      const current = monthMap.get(month) || { month, income: 0, expense: 0 };
      const value = item._sum.amount || 0;

      if (item.type === "INCOME") {
        current.income += value;
      } else if (item.type === "EXPENSE") {
        current.expense += value;
      }

      monthMap.set(month, current);
    }

    return res.status(200).json(Array.from(monthMap.values()));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
