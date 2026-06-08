import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: {
      email: session.user.email,
    },
    update: {
      name: session.user.name,
      image: session.user.image,
    },
    create: {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
}