import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

    try {
        if (event.node.req.method === 'GET') {
            const categories = await prisma.category.findMany();
            return categories;
        }

        if (event.node.req.method === 'POST') {
            const body = await readBody(event);
            const newCategory = await prisma.category.create({
                data: {
                    name: body.name,
                },
            });
            return newCategory;
        }

        if (event.node.req.method === 'PUT') {
            const body = await readBody(event);
            const updatedCategory = await prisma.category.update({
                where: {
                    id: parseInt(body.id),
                },
                data: {
                    name: body.name,
                },
            });
            if (!updatedCategory) {
                return { error: "カテゴリーの更新に失敗しました。" };
            }
            return updatedCategory;
        }

        if (event.node.req.method === 'DELETE') {
            const body = await readBody(event);
            const deletedCategory = await prisma.category.delete({
                where: {
                    id: parseInt(body.id),
                },
            });
            if (!deletedCategory) {
                return { error: "カテゴリーの削除に失敗しました。" };
            }
            return deletedCategory;
        }
    } catch (error) {
        return { error: "サーバーエラーが発生しました。" };
    }
});