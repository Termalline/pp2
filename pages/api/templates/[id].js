import prisma from "@/utils/db";

export default async function handler(req, res) {
    // Return the template from the given id
    if (req.method === "GET") {
        const { id, userId} = req.query;
        var idCheck = Number(id);
        var userIdNum = Number(userId);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(403).json({ error: "id not found" });
        }
        var template = await prisma.template.findUnique({
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
      
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                }

            }
        });

        var template2 = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
        
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                }

            }
        });
        if (userIdNum == template2.user.id){
            var template = await prisma.template.findUnique({
                where: {
                    id: idCheck,
                },
                include: {
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
    
                }
            });
            return res.status(200).json({template});
        }
        if (!template) {
            return res.status(400).json({ error: "template hidden" });
        }
        return res.status(200).json({template});



    // Update the template from the given id
    } else if (req.method === "PUT") {
        const { id } = req.query;
        var { title, code, explanation, tags } = req.body;
        if (!title || !code || !explanation) {
            return res.status(400).json({ error: "Title, Code, Explanation fields cannot be left blank." });
        }
        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }

        // checks if tags are properly formatted
        if (tags) {
            tags = tags.split(',')
        }


        // Gets the old array (used to update tags)
        var getOldArray = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
            include: {
                tags: true,
            },

        });

        // Updates the template
        var updateTemplate = await prisma.template.update({
            where: {
                id: idCheck,
            },
            data: { // https://stackoverflow.com/questions/69526209/prisma-how-can-i-update-only-some-of-the-models-fields-in-update/69529379
                title: title || undefined,
                code: code || undefined,
                explanation: explanation || undefined,
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


            },
        });
        // Deletes tags that are not connected to any template 
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



        return res.status(200).json({ message: "Template updated" });

    // Delete a code template from the given id
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
        var deleteTemplate = await prisma.template.delete({
            where: {
                id: idCheck,
            },
        });
        // Deletes tags that are not connected to any template
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

        return res.status(200).json({ message: "Template deleted" });



    // Fork a code template from the given id
    } else if (req.method === "POST") {
        const { id } = req.query;
        var { userId } = req.body;


        var idCheck = Number(id);
        var userIdCheck = Number(userId);
        if (!idCheck) {
            return res.status(400).json({ error: "Please sign in to fork this template" });
        }
        if (!userIdCheck) {
            return res.status(400).json({ error: "Please sign in to fork this template" });
        }
        var doesIdExist = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "Please sign in to fork this template" });
        }
        var doesUserIdExist = await prisma.user.findUnique({
            where: {
                id: userIdCheck,
            },
        });
        if (!doesUserIdExist) {
            return res.status(404).json({ error: "Please sign in to fork this template" });
        }
        // Gets the original template
        var originalTemplate = await prisma.template.findUnique({
            where: {
                id: idCheck,
            },
            include: {
                tags: true,
            },
        });
        // Forks the template
        var forkedTemplate = await prisma.template.create({
            data: {
                title: originalTemplate.title,
                code: originalTemplate.code,
                explanation: originalTemplate.explanation,
                userId: userIdCheck,
                tags: {
                    connectOrCreate: originalTemplate.tags.map((tag) => {
                        return {
                            where: { name: tag.name },
                            create: { name: tag.name },
                        };
                    }),
                },
            },
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
                visibility: false,
            }
        });

        return res.status(200).json({ forkedTemplate });



    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}