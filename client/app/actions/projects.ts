"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects(userId: string) {
    try {
        return await prisma.project.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function getProjectById(id: string) {
    try {
        return await prisma.project.findUnique({
            where: { id },
        });
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
}

export async function createProject(userId: string, name: string) {
    try {
        const project = await prisma.project.create({
            data: {
                userId,
                name,
                content: JSON.stringify({ version: "5.3.0", objects: [] }), // Default empty canvas
            },
        });
        revalidatePath("/");
        return project;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw new Error("Failed to create project");
    }
}

export async function updateProject(id: string, data: { name?: string; content?: string; thumbnail?: string }) {
    try {
        const project = await prisma.project.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        revalidatePath(`/editor?id=${id}`);
        return project;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw new Error("Failed to update project");
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({
            where: { id },
        });
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw new Error("Failed to delete project");
    }
}
