import { AppDataSource } from '../infrastructure/database';
import { User } from '../adapters/models/User';

async function checkUser() {
    try {
        await AppDataSource.initialize();
        const userRepository = AppDataSource.getRepository(User);
        const email = 'ameen@gmail.com';
        const user = await userRepository.findOne({ where: { email } });
        
        if (user) {
            console.log('--- USER FOUND ---');
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log(`--- USER ${email} NOT FOUND ---`);
        }
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error checking user:', error);
    }
}

checkUser();
