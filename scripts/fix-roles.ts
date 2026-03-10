import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Searching for members and requests with missing/empty roles...");

  const members = await prisma.members.findMany({
    where: {
      OR: [{ role: "" }, { role: null }],
    },
  });

  console.log(`Found ${members.length} members with invalid roles.`);

  for (const member of members) {
    await prisma.members.update({
      where: { wcaid: member.wcaid },
      data: { role: "member" },
    });
    console.log(`Updated member ${member.name} (${member.wcaid}) to role "member".`);
  }

  const requests = await prisma.requests.findMany({
    where: {
      OR: [{ role: "" }, { role: null }],
    },
  });

  console.log(`Found ${requests.length} requests with invalid roles.`);

  for (const request of requests) {
    await prisma.requests.update({
      where: { wcaid: request.wcaid },
      data: { role: "member" },
    });
    console.log(`Updated request ${request.name} (${request.wcaid}) to role "member".`);
  }

  console.log("Done database cleanup execution.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
