import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });
        const product = await prisma.product.findUnique({ where: { id: params.productId }, include: { images: true, category: true, size: true, color: true } });
        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(request: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = await request.json();
        if (!name) return new NextResponse("Name is required!", { status: 400 });
        if (!price) return new NextResponse("Price is required!", { status: 400 });
        if (!categoryId) return new NextResponse("Category ID is required!", { status: 400 });
        if (!sizeId) return new NextResponse("Size ID is required!", { status: 400 });
        if (!colorId) return new NextResponse("Color ID is required!", { status: 400 });
        if (!images || !images.length) return new NextResponse("Image(s) is required!", { status: 400 });
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        await prisma.product.update({ where: { id: params.productId }, data: { name, price, categoryId, colorId, sizeId, images: { deleteMany: {} }, isFeatured, isArchived } });
        const product = await prisma.product.update({ where: { id: params.productId }, data: { images: { createMany: { data: [...images.map((image: { url: string }) => image )]}  } } })
        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const product = await prisma.product.deleteMany({ where: { id: params.productId } });
        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};