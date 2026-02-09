"use server";

import prisma from "@/lib/prisma";

const DEFAULT_USER_EMAIL = "test@nocap.studio";

export async function getOrCreateDefaultUser() {
    try {
        let user = await prisma.user.findUnique({
            where: { email: DEFAULT_USER_EMAIL },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: DEFAULT_USER_EMAIL,
                    name: "John Doe",
                },
            });
            console.log("Created default test user.");
        }

        return user;
    } catch (error) {
        console.error("Failed to get/create default user:", error);
        return null;
    }
}
