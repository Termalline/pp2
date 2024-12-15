/*
  Warnings:

  - You are about to drop the column `blogId` on the `ICR` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ICR" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER,
    "blogPostId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ICR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ICR_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ICR_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ICR" ("commentId", "createdAt", "id", "report", "userId") SELECT "commentId", "createdAt", "id", "report", "userId" FROM "ICR";
DROP TABLE "ICR";
ALTER TABLE "new_ICR" RENAME TO "ICR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
