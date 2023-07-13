import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { billboardId: string } }) {
    try {
        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
        const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId } });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function PATCH(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { label, imageUrl } = await request.json();
        if (!label) return new NextResponse("Label is required", { status: 400 });
        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });
        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const billboard = await prisma.billboard.updateMany({ where: { id: params.billboardId }, data: { label, imageUrl } });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
        const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorised", { status: 403 }); 
        const billboard = await prisma.billboard.deleteMany({ where: { id: params.billboardId } });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};