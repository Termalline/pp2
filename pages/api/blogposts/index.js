import prisma from "@/utils/db";


export default async function handler(req, res) {
    // Create a new blog post
    if (req.method === "POST") {
        var { title, content, userId, tags, links } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).json({ error: "Title, and Description cannot be left blank" });
        }
        if (tags) { // checks if tags are valid
            tags = tags.split(',')
        }
        // checks if links are valid
        if (links) {
      /*      try {
                links = JSON.parse(links)
            } catch (e) {
                return res.status(400).json({ error: "links must be an array and each element must be an integer without quotes" });
            }
            if (typeof links[0] === "string") {
                {
                    return res.status(400).json({ error: "links must be an array and each element must be an integer without quotes" });
                }
            }
                */

            links = links.split(',')
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

        // check if all links matches to a code template
        if (links) {
            for (let i = 0; i < links.length; i++) {
                var linkId = Number(links[i]);
                if (!linkId) {
                    return res.status(400).json({ error: "One or more of your code template links is invalid" });
                }
                var linkCheck = await prisma.template.findUnique({
                    where: {
                        id: linkId,
                        visibility: true
                    },
                });
                if (!linkCheck) {
                    return res.status(400).json({ error: "One or more of your code template links is invalid" });
                }
            }
        }

        var blogPost = await prisma.blogPost.create({
            data: {
                title,
                content,
                userId: userIdNum,
                ...(tags && {
                    tags: {
                        connectOrCreate: tags.map((tag) => {
                            return {
                                where: { name: tag },
                                create: { name: tag },
                            };
                        }),
                    }
                }),
                ...(links && {
                    links: {
                        connect: links.map((link) => { 
                            return { id: Number(link) ,
                            };
                        }),
                    }
                }),

            }
        });

        return res.status(201).json(blogPost);

    // Get a paginated list of all blog posts, 5 at a time. Filter by title, content, tags, and links
    } else if (req.method === "GET") {

  //      const pageSize = 5;
        var { page, title, content, tags, links } = req.query;
        var links = Number(links);
   //     var pageInt = Number(page);
    //    if (pageInt < 1 || isNaN(pageInt)) {
     //       pageInt = 1;
      //  }

        var posts = await prisma.blogPost.findMany({
            where: {
                visibility: true,
  //              ...(title && { title: { contains: title } }),
   //             ...(content && { content: { contains: content } }),
    //            ...(tags && { tags: { some: { name: tags } } }),
     //           ...(links && { links: { some: { id: links } } }),
            },
   //         skip: pageSize * (pageInt - 1),
    //        take: pageSize,
            orderBy: { // order by rating
                rating: "desc",
            },
            
            select: {
                id: true,
                title: true,
                content: true,
                rating: true,
                tags: {
                    select: {
                        name: true,
                    }
                },
                links: {
                    select: {
                        id: true,
                }
                },
                createdAt: true,
                user: {
                    select: {
                        name: true,
                }
            }
            }
            
        });

        // if page is 1, return undefined, else return page - 1
   //     var prev = pageInt === 1 ? undefined : pageInt - 1;
    //    var next;
     //   if (posts.length === 0 || posts.length < pageSize ) {
      //      next = undefined;
      //  }
      //  else {
       //     next = pageInt + 1;
       // }


        return res.status(200).json({ posts });


    } else {
        res.status(405).json({ message: "Method not allowed" });
    }

}
