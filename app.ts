import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User | undefined {
        return this.users.find(user => { return user.email === email})
    }

    registerUser(user: User): void {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        user.id = crypto.randomUUID()
        this.users.push(user)
    }

    registerBike(bike: Bike): void {
        for (const rBike of this.bikes) {
            if(rBike.id === bike.id) {
                throw new Error('Duplicate Bike.')
            }
        }
        bike.id = crypto.randomUUID()
        this.bikes.push(bike)
    }

    removeUser(user: User): void {
        const index = this.users.findIndex(rUser => rUser.id === user.id);
        
        if (index !== -1) {
            this.users.splice(index, 1);
        } else {
            throw new Error('User not found.');
        }
    }

    rentBike(user: User, bike: Bike, startDate: Date, endDate: Date): void {
        const userIndex = this.users.findIndex(rUser => rUser.id === user.id);
        const bikeIndex = this.bikes.findIndex(rBike => rBike.id === bike.id);
    
        // caso nao ache o user ou a bike 
        if (userIndex === -1) {
            throw new Error('User not found.');
        }
    
        if (bikeIndex === -1) {
            throw new Error('Bike not found.');
        }
    
        const bikeToRent = this.bikes[bikeIndex];
        const overlappingRent = this.rents.find(
            rent => startDate <= rent.dateTo && endDate >= rent.dateFrom
            );
    
        if (overlappingRent) {
            throw new Error('Overlapping rental dates.');
        }
    
        const rent = Rent.create(this.rents, bikeToRent, user, startDate, endDate);
        this.rents.push(rent);
    }

    returnBike(user: User, bike: Bike, returnDate: Date): void {
        const userIndex = this.users.findIndex(rUser => rUser.id === user.id);
        const bikeIndex = this.bikes.findIndex(rBike => rBike.id === bike.id);
    
        // Verifique se o usuário e a bicicleta existem
        if (userIndex === -1) {
            throw new Error('User not found.');
        }
    
        if (bikeIndex === -1) {
            throw new Error('Bike not found.');
        }
    
        // Verifique se há um aluguel correspondente em andamento
        const existingRent = this.rents.find(
            rent => rent.user.id === user.id && rent.bike.id === bike.id && !rent.dateReturned
        );
    
        if (!existingRent) {
            throw new Error('No active rental found for this user and bike.');
        }
    
        // Atualize a data de retorno no aluguel
        existingRent.dateReturned = returnDate;
    }
    
}
    
   
   
