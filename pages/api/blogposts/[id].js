import prisma from "@/utils/db";
import { get } from "http";
import { title } from "process";

export default async function handler(req, res) {
    // Return a blog post from the given id
    if (req.method === "GET") {
        const { id, userId } = req.query;
        var idCheck = Number(id);
        var userIdNum = Number(userId);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }

        var blogPost = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
                visibility: true
            },
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
                links: {
                    select: {
                        id: true,
                        title: true,
                        code: true,
                        explanation: true,
                        userId: true,
                    },
                },
                user:{
                    select: {
                        name: true,
                        id: true
                    },
                },

            }
        });

        var blogPost2 = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
            },
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
                links: {
                    select: {
                        id: true,
                        title: true,
                        code: true,
                        explanation: true,
                        userId: true,
                    },
                },
                user:{
                    select: {
                        name: true,
                        id: true
                    },
                },

            }
        });
        if (userIdNum == blogPost2.user.id){
            var blogPost = await prisma.blogPost.findUnique({
                where: {
                    id: idCheck,
                },
                include: {
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    links: {
                        select: {
                            id: true,
                            title: true,
                            code: true,
                            explanation: true,
                            userId: true,
                        },
                    },
                    user:{
                        select: {
                            name: true,
                            id: true
                        },
                    },
    
                }
            });
            return res.status(200).json({blogPost});
        }
        if (!blogPost) {
            return res.status(400).json({ error: "blog hidden" });
        }
        return res.status(200).json({ blogPost });


    // Update a blog post from the given id.
    } else if (req.method === "PUT") {
        const { id } = req.query;
        var { title, content, tags, links } = req.body;
        if (!title || !content ) {
            return res.status(400).json({ error: "Title, and Description cannot be left blank" });
        }
        // check if tags is valid
        if (tags) {
            tags = tags.split(',')
        }

        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
        // check if links are valid
        if (links) {
        /*    try {
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
        // old array used to update tags and links
        var getOldArray = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
            },
            include: {
                tags: true,
                links: {
                    select: {
                        id: true,
                    },
                },
            },

        });
        // update blog post
        var updateBlogPost = await prisma.blogPost.update({
            where: {
                id: idCheck,
            },
            data: {
                title: title || undefined,
                content: content || undefined,
                ...(tags && {
                    tags: {
                        disconnect: getOldArray.tags,
                        connectOrCreate: tags.map((tag) => {
                            return {
                                where: { name: tag },
                                create: { name: tag },
                            };
                        }),
                    },
                }),
                ...(links && {
                    links: {
                        disconnect: getOldArray.links, 
                        connect: links.map((link) => {
                            return {
                                id: Number(link),
                            };
                        }),
                        
                    }
                })

            }, // select what to return
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
                links: {
                    select: {
                        id: true,
                    },
                },
                visibility: false,
            }

        });
        // delete tags that are not connected to any blog post or template
        const deleteTags = await prisma.tag.deleteMany({
            where: {
                AND: [
                    {
                        template: {
                            none: {},
                        },
                    }, {
                        blogPost: {
                            none: {},
                        },
                    },
                ],
            }
        });


    return res.status(200).json({ updateBlogPost });




    // Delete a blog post from the given id
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.blogPost.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
        var deleteComments = await prisma.comment.deleteMany({
            where: {
                blogId: idCheck,
            },
        });
        var deleteBlog = await prisma.blogPost.delete({
            where: {
                id: idCheck,
            },
        });
        // delete tags that are not connected to any blog post or template
        const deleteTags = await prisma.tag.deleteMany({
            where: {
                AND: [
                    {
                        template: {
                            none: {},
                        },
                    }, {
                        blogPost: {
                            none: {},
                        },
                    },
                ],
            }
        });

        return res.status(200).json({ message: "Blog Post deleted" });


    // Upvote or downvote a blog post from the given id
    } else if (req.method === "POST") {
        var {id, rating} = req.body;
        if (!id || !rating) {
            return res.status(400).json({ error: "blog post id and rating are required, -1 for downvote, 1 for upvote" });
        }
        var idNum = Number(id);
        var ratingNum = Number(rating);
        var idCheck = await prisma.blogPost.findUnique({
            where: {
                id: idNum,
            },
        });
        if (!idCheck) {
            return res.status(400).json({ error: "id not found" });
        }
        if (ratingNum !== 1 && ratingNum !== -1) { // check if rating is valid
            return res.status(400).json({ error: "rating must be 1 or -1" });
        }
        var updateRating = await prisma.blogPost.update({
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
        return res.status(200).json({ updateRating });



    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}