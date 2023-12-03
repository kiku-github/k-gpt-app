import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

    try {
        if (event.node.req.method === 'GET') {
            const blogs = await prisma.blog.findMany();
            return blogs;
        }

        if (event.node.req.method === 'POST') {
            const body = await readBody(event);

            const newBlog = await prisma.blog.create({
                data: {
                    title: body.title,
                    generateText: body.generateText,
                    img: body.img,
                    userEmail: body.userEmail,
                    published: body.published,
                    category: body.categoryId
                      ? {
                          connect: { id: body.categoryId },
                        }
                      : undefined,
                },
            });
            return newBlog;
        }

        if (event.node.req.method === 'PUT') {
            const body = await readBody(event);
            const updatedBlog = await prisma.blog.update({
                where: {
                    id: parseInt(body.id),
                },
                data: {
                    title: body.title,
                    generateText: body.generateText,
                    img: body.img,
                    userEmail: body.userEmail,
                    published: body.published,
                    category: body.categoryId
                      ? {
                          connect: { id: body.categoryId },
                        }
                      : undefined,
                },
            });
            if (!updatedBlog) {
                return { error: "ブログの更新に失敗しました。" };
            }
            return updatedBlog;
        }

        if (event.node.req.method === 'DELETE') {
            const body = await readBody(event);
            const deletedBlog = await prisma.blog.delete({
                where: {
                    id: parseInt(body.id),
                },
            });
            if (!deletedBlog) {
                return { error: "ブログの削除に失敗しました。" };
            }
            return deletedBlog;
        }
    } catch (error) {
        return { error: "サーバーエラーが発生しました。" };
    }
});