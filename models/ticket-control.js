import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import db from "./../db/data.json" assert { type: 'json' };
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Ticket {
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos_cuatro = [];

        this.init();
    }

    // Serializar para guardar en bd
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos_cuatro: this.ultimos_cuatro
        }
    }

    // Inicializar 
    init() {
        const { hoy, ultimo, ultimos_cuatro, tickets } = db;

        if( hoy === this.hoy ) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos_cuatro = ultimos_cuatro;
        } else {
            this.guardarDB();           // Otro día
        }
    }

    guardarDB() {
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify(this.toJson) );
    }

    siguienteTicket() {
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ) {
        // Si no hay tickets
        if( this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift();        // Quitar el primer elemento
        ticket.escritorio = escritorio;

        this.ultimos_cuatro.unshift( ticket );

        if( this.ultimos_cuatro.length > 4 ) {
            this.ultimos_cuatro.splice(-1, 1);
        }

        this.guardarDB();

        return ticket;
    }
}

export { TicketControl }