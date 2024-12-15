import prisma from "@/utils/db";
import { hashPassword } from "@/utils/auth";

export default async function handler(req, res) {


    // get user information, my code templates, blog posts, comments. Based on flags.
    if (req.method === "GET") {
 //       const pageSize = 5;
        var { id, code_templates, blog_post, comments} = req.query;
        var idCheck = Number(id);
        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.user.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
 //       var pageInt = Number(page);
  //      if (pageInt < 1 || isNaN(pageInt)) {
   //         pageInt = 1;
  //      }
        // if code_templates flag is specified, return user's code templates

        BigInt.prototype.toJSON = function () {
            const int = Number.parseInt(this.toString());
            return int ?? this.toString();
          };
        if(code_templates){
            var posts = await prisma.template.findMany({
                where: {
                    userId: idCheck,
                },
   //             skip: pageSize * (pageInt - 1),
    //            take: pageSize,
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

            
        } // if blog_post flag is specified, return user's blog posts
        else if(blog_post){
            var posts = await prisma.blogPost.findMany({
                where: {
                    userId: idCheck,
                },
   //             skip: pageSize * (pageInt - 1),
    //            take: pageSize,
                orderBy: {
                   createdAt: "desc",
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

        }

        else if(comments){ // if comments flag is specified, return user's comments
            var posts = await prisma.comment.findMany({
                where: {
                    userId: idCheck,
                },
   //             skip: pageSize * (pageInt - 1),
    //            take: pageSize,
                orderBy: {
                   createdAt: "desc",
                },

            });

        }
        else{ // otherwise return user information
            var posts = await prisma.user.findUnique({
                where: {
                    id: idCheck,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    picture:true,
                    darkMode: true,
                    role: true,
                    createdAt: true,
                    number:true

                },
            });
            return res.status(200).json(posts);
        }
          
        // if page is 1, return undefined, else return page - 1
    //    var prev = pageInt === 1 ? undefined : pageInt - 1;
     //   var next;
    //    if (posts.length === 0 || posts.length < pageSize) {
     //          next = undefined;
     //       }
     //       else {
    //           next = pageInt + 1;
    //        }
        
        
        return res.status(200).json({ posts});
                

    }

    // update user information
    else if (req.method === "PUT") {
        const { id } = req.query;
        var {name, picture, number, darkMode, password, email} = req.body;
        var idCheck = Number(id);
        if (number && number.length > 15) {
            return res.status(401).json({ error: "Invalid number entered" });
        }
        var number = Number(number)
        //checks validity 
        BigInt.prototype.toJSON = function () {
            const int = Number.parseInt(this.toString());
            return int ?? this.toString();
          };

        if (!idCheck) {
            return res.status(400).json({ error: "Missing id" });
        }
        var doesIdExist = await prisma.user.findUnique({
            where: {
                id: idCheck,
            },
        });
        if (!doesIdExist) {
            return res.status(404).json({ error: "id not found" });
        }
        if (!name && !picture && !number && !darkMode) {
            return res.status(400).json({ error: "Missing name, picture, number, darkMode fields to update" });
        }
        // updates the given user information
        
        if (email){
            var checkUser = await prisma.user.findUnique({ where: { email }})
            if (checkUser && checkUser.id != id) {
                return res.status(402).json({ error: "Email has already been used" });
            }
            else{

                var updateUser = await prisma.user.update({
                    where: {
                        id: idCheck,
                    },
                    data: {
                        email: email
                    },
                });

            }
        }
            
        var updateUser = await prisma.user.update({
            where: {
                id: idCheck,
            },
            data: {
                name: name || undefined,
                picture: picture || undefined,
                number: parseInt(number) || undefined,
                darkMode: darkMode || undefined,
            },
        });
        if (password){
            var updateUser = await prisma.user.update({
                where: {
                    id: idCheck,
                },
                data: {
                    password: await hashPassword(password) || undefined,
                },
        })}
        return res.status(200).json({ message: "User info updated" });

    }

    
    else {
        res.status(405).json({ message: "Method not allowed" });
    }

}
    

