import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
    }

    
    var { userId, blogPostId, commentId, templateId, report } = req.body;
    // validity checks
    if (!userId || !report) {
        return res.status(400).json({ error: "userId and report are required" });
    }
    if (!blogPostId && !commentId && !templateId) {
        return res.status(400).json({ error: "blogPostId, commentId, or templateId is required" });
    }
    var userIdNum = Number(userId);
    var userIdCheck = await prisma.user.findUnique({
        where: {
            id: userIdNum,
        },
    });
    if (!userIdCheck) {
        return res.status(400).json({ error: "userId not found" });
    }

    // if blogPostId is provided
    if (blogPostId) {
        var blogPostIdNum = Number(blogPostId);
        var blogPostCheck = await prisma.blogPost.findUnique({
            where: {
                id: blogPostIdNum,
            },
        });
        if (!blogPostCheck) {
            return res.status(400).json({ error: "blogPostId not found" });
        }
        var offensiveContent = await prisma.blogPost.update({ // update the reports count
            where: {
                id: blogPostIdNum,
            },
            data: {
                reports: {
                    increment: 1,
                }
            }
        });
        var ICR = await prisma.ICR.create({   // create a new ICR entry
            data: {
                userId: userIdNum,
                blogPostId: blogPostIdNum,
                report: report,
            }
        });
        return res.status(200).json({ message: "Blog post has been reported" });
    }
    // if commentId is provided
    else if (commentId) {
        var commentIdNum = Number(commentId);
        var commentCheck = await prisma.comment.findUnique({
            where: {
                id: commentIdNum,
            },
        });
        if (!commentCheck) {
            return res.status(400).json({ error: "commentId not found" });
        }
        var offensiveContent = await prisma.comment.update({ // update the reports count
            where: {
                id: commentIdNum,
            },
            data: {
                reports: {
                    increment: 1,
                }
            }
        });
        var ICR = await prisma.ICR.create({  // create a new ICR entry
            data: {
                userId: userIdNum,
                commentId: commentIdNum,
                report: report,
            }
        });



        return res.status(200).json({ message: "Comment has been reported" });
    }
    // if templateId is provided
    else if (templateId) {
        var templateIdNum = Number(templateId);
        var templateCheck = await prisma.template.findUnique({
            where: {
                id: templateIdNum,
            },
        });
        if (!templateCheck) {
            return res.status(400).json({ error: "templateId not found" });
        }
        var offensiveContent = await prisma.template.update({ // update the reports count
            where: {
                id: templateIdNum,
            },
            data: {
                reports: {
                    increment: 1,
                }
            }
        });

        var ICR = await prisma.ICR.create({ // create a new ICR entry
            data: {
                userId: userIdNum,
                templateId: templateIdNum,
                report: report,
            }
        });

        return res.status(200).json({ message: "Template has been reported" });
    }
    res.status(400).json({ error: "Invalid request" });

}