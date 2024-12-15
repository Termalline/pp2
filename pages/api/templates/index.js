import prisma from "@/utils/db";

export default async function handler(req, res) {
    // Create a new code template 
    if (req.method === "POST") {
        var { title, code, explanation, userId, tags } = req.body;
        if (!title || !code || !explanation || !userId) {
            return res.status(400).json({ error: "Title, Code, Explanation fields cannot be left blank." });
        }
        
        if (tags) {
            tags = tags.split(',')
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

        var template = await prisma.template.create({
            data: {
                title,
                code,
                explanation, 
                userId: userIdNum,
                ...(tags && { tags: {// https://stackoverflow.com/questions/68874214/how-to-use-connectorcreate-with-many-to-many-in-prisma
                    connectOrCreate: tags.map((tag) => {
                        return {
                            where: { name: tag },
                            create: { name: tag },
                        };
                    }),
            }})
                }

            },
        );

 
        return res.status(201).json({ template });


    }
    // Return a paginated list of all templates, 5 at a time. Query based on title, explanation, and tags, page
    else if (req.method === "GET") {
        // https://dev.to/huericnan/how-to-implement-pagination-with-javascript-5066
     //   const pageSize = 5;
        var { page, title, explanation, tags } = req.query;
   //     var pageInt = Number(page);
     //   if (pageInt < 1 || isNaN(pageInt)) {
     //       pageInt = 1;
     //   }
    
        var posts = await prisma.template.findMany({
            where: {
                visibility: true,
                //https://stackoverflow.com/questions/71707307/prisma-2-optional-query-parameters
      //          ...(title && { title: { contains: title } }),
       //         ...(explanation && { explanation: { contains: explanation } }),
        //        ...(tags && { tags: { some: { name: tags } } }),
            },
      //      skip: pageSize * (pageInt - 1),
       //     take: pageSize,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                title: true,
                code: true,
                explanation: true,
                id: true,
                tags: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        // if page is 1, return undefined, else return page - 1
    //    var prev = pageInt === 1 ? undefined : pageInt - 1;
     //   var next;
     //   if (posts.length === 0 || posts.length < pageSize ) {
      //      next = undefined;
     //   }
     //   else {
      //      next = pageInt + 1;
      //  }

        return res.status(200).json({ posts });

    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}