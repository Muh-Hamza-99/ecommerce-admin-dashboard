import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { colorId: string } }) {
    try {
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });
        const color = await prisma.color.findUnique({ where: { id: params.colorId } });
        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(request: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { name, value } = await request.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("Value is required", { status: 400 });
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const color = await prisma.color.updateMany({ where: { id: params.colorId }, data: { name, value } });
        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const color = await prisma.color.deleteMany({ where: { id: params.colorId } });
        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};