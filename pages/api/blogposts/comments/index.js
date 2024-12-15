import prisma from "@/utils/db";


export default async function handler(req, res) {

    // Create a comment on a blog post
    if (req.method === "POST") {
        var { content, userId, blogId } = req.body;
        if (!content || !userId || !blogId) {
            return res.status(400).json({ error: "content, userId, and blogId are required" });
        }

        // Check if the user exists
        var userIdNum = Number(userId);
        var userIdCheck = await prisma.user.findUnique({
            where: {
                id: userIdNum,
            },
        });
        if (!userIdCheck) {
            return res.status(400).json({ error: "userId not found" });
        }

        // Check if the blog post exists
        var blogIdNum = Number(blogId);
        var blogIdCheck = await prisma.blogPost.findUnique({
            where: {
                id: blogIdNum,
            },
        });
        if (!blogIdCheck) {
            return res.status(400).json({ error: "blogId not found" });
        }
        var comment = await prisma.comment.create({
            data: {
                content: content,
                userId: userIdNum,
                blogId: blogIdNum,
            },
        });


        return res.status(201).json(comment);


    // View all comments on a blog post, paginated 5 per page
    } else if (req.method === "GET") {
        // validity checks
     //   const pageSize = 5;
        var { page, blogId } = req.query;
   //     var pageInt = Number(page);
        var blogIdInt = Number(blogId);
        if (!blogIdInt) {
            return res.status(400).json({ error: "provide blogId" });
        }
        var blogIdCheck = await prisma.blogPost.findUnique({
            where: {
                id: blogIdInt,
            },
        });
        if (!blogIdCheck) {
            return res.status(400).json({ error: "Invalid blogId" });
        }
    //    if (pageInt < 1 || isNaN(pageInt)) {
     //       pageInt = 1;
    //    }
     //   if (pageInt < 1 || isNaN(pageInt)) {
     //       pageInt = 1;
     //   }
        // get paginated comments
        var comments = await prisma.comment.findMany({
            where: {
                visibility: true,
                blogId: blogIdInt,
                parentId: null,
            },
    //        skip: (pageInt - 1) * pageSize,
     //       take: pageSize,
            orderBy: {
                rating: "desc",
            },
            select: {
                id: true,
                userId: true,
                content: true,
                rating: true,
                user: {
                    select: {
                        name: true
                    }
                }

            },
        });

    //    var prev = pageInt === 1 ? undefined : pageInt - 1;
    //    var next;
     //   if (comments.length === 0 || comments.length < pageSize ) {
      //      next = undefined;
     //   }
      //  else {
      //      next = pageInt + 1;
      //  }


        return res.status(200).json({ comments });



    } else {
        res.status(405).json({ message: "Method not allowed" });
    }


}