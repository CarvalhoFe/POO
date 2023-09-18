import { Bike } from "./bike";
import { User } from "./user";
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class App {
    users: User[] = [];
    bikes: Bike[] = [];

    findUser(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
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
            return false;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        return passwordMatch;
    }

    listUsers(): User[] {
        return this.users;
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

    rentBike(bikeId: string, userEmail: string): void {
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!bike) {
            throw new Error('Bike not found.');
        }
        const user = this.findUser(userEmail);
        if (!user) {
            throw new Error('User not found.');
        }

        if (!bike.available) {
            throw new Error('Bike is not available for rent.');
        }

        bike.available = false; // Definir a bicicleta como indisponível para aluguel
    }

    returnBike(bikeId: string, userEmail: string): void {
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!bike) {
            throw new Error('Bike not found.');
        }
        const user = this.findUser(userEmail);
        if (!user) {
            throw new Error('User not found.');
        }

        if (bike.available) {
            throw new Error('Bike is already available.');
        }

        bike.available = true; // Definir a bicicleta como disponível
    }

    updateBikeLocation(bikeId: string, newLocation: string): void {
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!bike) {
            throw new Error('Bike not found.');
        }

        bike.location = newLocation; // Atualizar a localização da bicicleta
    }
}
