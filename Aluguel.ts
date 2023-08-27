import {bicicleta} from './Bike'
import {cliente} from './Cliente'

export class aluguel {
    locador: cliente
    bicicleta: bicicleta
    dias: number
    preço_final: number = 0.0

    constructor(locador: cliente, bicicleta: bicicleta, dias: number, preço_final: number) {
        this.locador = locador
        this.bicicleta = bicicleta
        this.dias = dias
        this.preço_final = preço_final
    }

    preço_aluguel(dias: number): void {
        this.preço_final = this.preço_final + (dias * this.bicicleta.preço_dia)
        this.dias += dias
    }
}

