import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { sizeId: string } }) {
    try {
        if (!params.sizeId) return new NextResponse("Size ID is required", { status: 400 });
        const size = await prisma.size.findUnique({ where: { id: params.sizeId } });
        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(request: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { name, value } = await request.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("Value is required", { status: 400 });
        if (!params.sizeId) return new NextResponse("Color ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const size = await prisma.size.updateMany({ where: { id: params.sizeId }, data: { name, value } });
        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.sizeId) return new NextResponse("Size ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const size = await prisma.size.deleteMany({ where: { id: params.sizeId } });
        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};