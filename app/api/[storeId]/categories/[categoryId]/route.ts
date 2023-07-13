import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
    try {
        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });
        const category = await prisma.category.findUnique({ where: { id: params.categoryId } });
        return NextResponse.json(category);
    } catch (error) {
        console.log("[CATEGORY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(request: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { name, billboardId } = await request.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!billboardId) return new NextResponse("Billboard ID URL is required", { status: 400 });
        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const category = await prisma.category.updateMany({ where: { id: params.categoryId }, data: { name, billboardId } });
        return NextResponse.json(category);
    } catch (error) {
        console.log("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const category = await prisma.category.deleteMany({ where: { id: params.categoryId } });
        return NextResponse.json(category);
    } catch (error) {
        console.log("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};