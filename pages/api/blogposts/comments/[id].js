import prisma from "@/utils/db";
import { create } from "domain";


export default async function handler(req, res) {

    // Get a specific comment
    if (req.method === "GET") {
        // validity checks
        const { id } = req.query;
        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.comment.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
        // get the comment
        var comment = await prisma.comment.findUnique({

            where: {
                id: idCheck,
                visibility: true
            },
            select: {
                userId: true,
                id: true,
                content: true,
                parentId: true,
                Children: {
                    select: {
                        user:{
                            select:{
                                name:true
                            }
                        },
                        userId: true,
                        content: true,
                        rating: true,
                        id:true,
                        
                    },
                    orderBy: {
                        rating: "desc",
                    },
                    where: {
                        visibility: true  
                    }
                    
                },
                rating: true,
                blogId: true,
                createdAt: true,
                user: {
                    select:{
                        name: true
                    }
                }

            },

        });
        return res.status(200).json({ comment });

    // Make a new comment on a comment (reply)
    } else if (req.method === "POST") {
        const { id } = req.query;
        var { content, userId} = req.body;
        var parentId = id;
        // validity checks
        if (!content || !userId || !parentId) {
            return res.status(400).json({ error: "content, userId, and parentId are required" });
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
        var parentIdNum = Number(parentId);
        var parentIdCheck = await prisma.comment.findUnique({
            where: {
                id: parentIdNum,
            },
        });
        if (!parentIdCheck) {
            return res.status(400).json({ error: "parentId not found" });
        }
        var parentIdMatchesBlogId = await prisma.comment.findFirst({
            where: {
                id: parentIdNum,
            },
        });
        if (!parentIdMatchesBlogId) {
            return res.status(400).json({ error: "comment not found on blog" });
        }
    

        // create the comment
        var comment = await prisma.comment.create({
            data: {
                content: content,
                userId: userIdNum,
                parentId: parentIdNum,
                blogId: parentIdMatchesBlogId.blogId,
            },
        });
        return res.status(201).json({comment});

        // Rate a comment   
    } else if (req.method === "PUT") {
        var {rating, id} = req.body;
        // validity checks
        if (!id || !rating) {
            return res.status(400).json({ error: "comment id and rating are required, -1 for downvote, 1 for upvote" });
        }
        var idNum = Number(id);
        var ratingNum = Number(rating);
        var idCheck = await prisma.comment.findUnique({
            where: {
                id: idNum,
            },
        });
        if (!idCheck) {
            return res.status(400).json({ error: "id not found" });
        }
        if (ratingNum !== 1 && ratingNum !== -1) {
            return res.status(400).json({ error: "rating must be 1 or -1" });
        }
        // update the rating
        var ratingUpdate = await prisma.comment.update({
            where: {
                id: idNum,
            },
            data: {
                rating: {
                    increment: ratingNum,
                },
            },
            select: {
                rating: true,
            },
        });
        return res.status(200).json({ ratingUpdate });


    } else {
        res.status(405).json({ message: "Method not allowed" });
    }


}