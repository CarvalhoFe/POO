import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        return this.users.find(user => user.email === email);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10; // Aumente isso para mais segurança, se desejar
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }

    async registerUser(user: User, password: string): Promise<string> {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.');
            }
        }

        const hashedPassword = await this.hashPassword(password);
        user.password = hashedPassword;

        const newId = crypto.randomUUID();
        user.id = newId;
        this.users.push(user);
        return newId;
    }

    async authenticateUser(userId: string, password: string): Promise<boolean> {
        const user = this.users.find((u) => u.id === userId);
        if (!user) {
            return false; // Usuário não encontrado
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        return passwordMatch;
    }

    listUsers(): User[] {
        return this.users;
    }

    listRents(): Rent[] {
        return this.rents;
    }

    listBikes(): Bike[] {
        return this.bikes;
    }

    registerBike(bike: Bike): string {
        const newId = crypto.randomUUID();
        bike.id = newId;
        this.bikes.push(bike);
        return newId;
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return;
        }
        throw new Error('User does not exist.');
    }

    rentBike(bikeId: string, userEmail: string, startDate: Date, endDate: Date): void {
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!bike) {
            throw new Error('Bike not found.');
        }
        const user = this.findUser(userEmail);
        if (!user) {
            throw new Error('User not found.');
        }
        const bikeRents = this.rents.filter(rent =>
            rent.bike.id === bikeId && !rent.dateReturned
        );
        const newRent = Rent.create(bikeRents, bike, user, startDate, endDate);
        this.rents.push(newRent);
    }

    returnBike(bikeId: string, userEmail: string) {
        const today = new Date();
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            rent.dateReturned === undefined &&
            rent.dateFrom <= today
        );
        if (rent) {
            rent.dateReturned = today;
            return;
        }
        throw new Error('Rent not found.');
    }
}
