import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email_id: 'admin@hcl.com' },
        update: {},
        create: {
            name: 'Admin User',
            email_id: 'admin@hcl.com',
            phone_no: '0000000000',
            dob: new Date('1990-01-01'),
            password: password,
            stat: 'active',
            role: 'admin',
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
