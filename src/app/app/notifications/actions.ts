"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function exigerSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  return session;
}

export async function marquerNotificationLue(id: string): Promise<void> {
  const session = await exigerSession();
  await prisma.notification.updateMany({
    where: { id, destinataireId: session.user.id },
    data: { lue: true },
  });
  revalidatePath("/app/notifications");
  revalidatePath("/app");
  revalidatePath("/entreprise");
  revalidatePath("/mentor");
  revalidatePath("/admin");
}

export async function marquerToutesNotificationsLues(): Promise<void> {
  const session = await exigerSession();
  await prisma.notification.updateMany({
    where: { destinataireId: session.user.id, lue: false },
    data: { lue: true },
  });
  revalidatePath("/app/notifications");
  revalidatePath("/app");
  revalidatePath("/entreprise");
  revalidatePath("/mentor");
  revalidatePath("/admin");
}
