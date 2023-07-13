import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const { name } = await request.json();
        if (!userId) return new NextResponse("Unauthorised!", { status: 401 });
        if (!name) return new NextResponse("Name is required!", { status: 400 });
        const store = await prisma.store.create({ data: { name, userId } });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORES_POST]", error);
        return new NextResponse("Interal Error", { status: 500 })
    };
};