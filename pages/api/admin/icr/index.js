import prisma from "@/utils/db";
import { report } from "process";

export default async function handler(req, res) {

    // if no id is provided, return all reports
    // if blog, comment, or template flag is specified, return reports for that type sorted by reports count
    if (req.method === "GET") {
    //    const pageSize = 5;
        var { blog, comment, template } = req.query;
    //    var pageInt = Number(page);
    //    if (pageInt < 1 || isNaN(pageInt)) {
     //       pageInt = 1;
    //    }
        // if template flag is specified, return reports for templates
        if (template) {
            var posts = await prisma.template.findMany({
                where: {
                    visibility: true,
                    reports: { gt: 0 },

                },
    //            skip: pageSize * (pageInt - 1),
      //          take: pageSize,
                orderBy: {
                    reports: "desc",
                },

                select: {
                    id: true,
                    reports: true,
                    icr: true,

                }

            });
         // if comment flag is specified, return reports for comments      
        } else if (comment) {
            var posts = await prisma.comment.findMany({
                where: {
                    visibility: true,
                    reports: { gt: 0 },

                },
         //       skip: pageSize * (pageInt - 1),
         //       take: pageSize,
                orderBy: {
                    reports: "desc",
                },

                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            id:true,
                        }
                    },
                    content: true,
                    rating: true,
                    reports: true,
                    icr: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                }
                            },
                            id: true,
                            report: true

                        }
                    },

                }

            });
            // if blog flag is specified, return reports for blog posts
        } else if (blog) {
            var posts = await prisma.blogPost.findMany({
                where: {
                    visibility: true,
                    reports: { gt: 0 },

                },
     //           skip: pageSize * (pageInt - 1),
       //         take: pageSize,
                orderBy: {
                    reports: "desc",
                },

                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            id:true,
                        }
                    },
                    reports: true,
                    content: true, 
                    title: true,
                    rating: true,
                    icr: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                }
                            },
                            id: true,
                            report: true

                        }
                    },
                    tags: true,
                }

            });

        }
        else { // if no flag is specified, return all reports
            var posts = await prisma.ICR.findMany({

        //        skip: pageSize * (pageInt - 1),
          //      take: pageSize,
                orderBy: {
                    createdAt: "desc",
                },


            })
        }
        // if page is 1, return undefined, else return page - 1
   //     var prev = pageInt === 1 ? undefined : pageInt - 1;
     //   var next;
      //  if (posts.length === 0 || posts.length < pageSize) {
      //      next = undefined;
      //  }
      //  else {
     //       next = pageInt + 1;
      //  }


        return res.status(200).json({ posts });

    }
    
    else if (req.method === "PUT") { // hide a post, comment, or template

        var { id_blog, id_template, id_comment } = req.body;
        var id_blogInt = Number(id_blog);
        var id_templateInt = Number(id_template);
        var id_commentInt = Number(id_comment);

        try { 
            if (!id_blogInt && !id_templateInt && !id_commentInt) {
                return res.status(400).json({ message: "id is required" });
            }
            if (id_blogInt) { // if blog id is provided, hide the blog post
                var updateBlog = await prisma.blogPost.update({
                    where: {
                        id: id_blogInt,
                    },
                    data: {
                        visibility: false,
                    },
                });
                await prisma.ICR.deleteMany({ // delete ICR entries for that blog post
                    where: {
                        blogPostId: id_blogInt,
                    },

                });
            }


            if (id_commentInt) { // if comment id is provided, hide the comment
                var updateComment = await prisma.comment.update({
                    where: {
                        id: id_commentInt,
                    },
                    data: {
                        visibility: false,
                    },
                });
                await prisma.ICR.deleteMany({ // delete ICR entries for that comment
                    where: {
                        commentId: id_commentInt,
                    },

                });
            }
            if (id_templateInt) { // if template id is provided, hide the template
                var updateTemplate = await prisma.template.update({
                    where: {
                        id: id_templateInt,
                    },
                    data: {
                        visibility: false,
                    },
                });
                await prisma.ICR.deleteMany({ // delete ICR entries for that template
                    where: {
                        templateId: id_templateInt,
                    },

                });
            }

            return res.status(200).json({ message: "post hidden successfully" });
        } catch (error) {
            return res.status(400).json({ message: "invalid entry" });
        }



    }



    else {
        res.status(405).json({ message: "Method not allowed" });
    }


}
    