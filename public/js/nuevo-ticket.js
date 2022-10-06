// Referencias de HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

// Socket del cliente
const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false
});

socket.on('disconnect', () => {
    btnCrear.disabled = true
});

socket.on('tickets-pendientes', ( ticket ) => {
    lblNuevoTicket.innerText = 'Ticket ' + ticket;
});

btnCrear.addEventListener( 'click', () => {
    socket.emit('siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket
    })
})


console.log('Nuevo Ticket HTML');