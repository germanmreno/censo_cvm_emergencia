import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@cvm.com.ve';
  const defaultPassword = 'CVM-Emerg-2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', active: true },
    create: {
      email,
      passwordHash,
      fullName: 'Administrador CVM',
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('=================================');
  console.log(' Usuario administrador creado:');
  console.log(`   Email:    ${user.email}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log(' ¡Rotar la contraseña en el primer ingreso!');
  console.log('=================================');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
