import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        const { name } = await request.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });
        const store = await prisma.store.updateMany({ where: { id: params.storeId, userId}, data: { name } });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};

export async function DELETE(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthenaticated", { status: 401 });
        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });
        const store = await prisma.store.deleteMany({ where: { id: params.storeId, userId} });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    };
};