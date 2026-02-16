import { User } from '../models/User';
import { connectDB } from '../config/database';

const migrate = async () => {
    try {
        await connectDB();
        const users = await User.findAll({ where: { address: '0x0' } });
        console.log(`Found ${users.length} users with 0x0 address.`);

        for (const user of users) {
            await user.update({
                address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f9a2b8e390c58e6d89b8e390c'
            });
            console.log(`Updated user: ${user.email}`);
        }
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit(0);
    }
};

migrate();
