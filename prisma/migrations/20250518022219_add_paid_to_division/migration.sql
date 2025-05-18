-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Division" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "amountOwed" REAL NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Division_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Division_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Division" ("amountOwed", "expenseId", "id", "paid", "userId") SELECT "amountOwed", "expenseId", "id", "paid", "userId" FROM "Division";
DROP TABLE "Division";
ALTER TABLE "new_Division" RENAME TO "Division";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
