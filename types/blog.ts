export interface Blog {
    id: number;
    title: string;
    generateText: string;
    img: string;
    userEmail: string;
    published: boolean;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: number;
    name: string;
}