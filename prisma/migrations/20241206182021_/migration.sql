/*
  Warnings:

  - You are about to drop the `_BlogPostToICR` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentToICR` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_BlogPostToICR_B_index";

-- DropIndex
DROP INDEX "_BlogPostToICR_AB_unique";

-- DropIndex
DROP INDEX "_CommentToICR_B_index";

-- DropIndex
DROP INDEX "_CommentToICR_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BlogPostToICR";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CommentToICR";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ICR" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER,
    "blogId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ICR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ICR_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ICR_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ICR" ("createdAt", "id", "report", "userId") SELECT "createdAt", "id", "report", "userId" FROM "ICR";
DROP TABLE "ICR";
ALTER TABLE "new_ICR" RENAME TO "ICR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
