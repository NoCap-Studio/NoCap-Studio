"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAssets(userId: string) {
    try {
        return await prisma.asset.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch assets:", error);
        return [];
    }
}

export async function createAsset(data: { userId: string; url: string; name?: string; size?: number; type?: string }) {
    try {
        const asset = await prisma.asset.create({
            data,
        });
        revalidatePath("/editor");
        return asset;
    } catch (error) {
        console.error("Failed to create asset:", error);
        throw new Error("Failed to create asset");
    }
}

export async function deleteAsset(id: string) {
    try {
        await prisma.asset.delete({
            where: { id },
        });
        revalidatePath("/editor");
    } catch (error) {
        console.error("Failed to delete asset:", error);
        throw new Error("Failed to delete asset");
    }
}
