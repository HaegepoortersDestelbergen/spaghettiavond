import { node, Element, Api } from 'https://unpkg.com/cutleryjs/dist/js/index.js'

const url = new URL(window.location.href);
const email = url.searchParams.get('email');

const getOrderData = async (userEmail = email) => {
    return await new Api(`http://spaghetti.haegepoorters.be/api?email=${userEmail}`).JSON();
}

const renderOrders = (data) => {
    data.forEach((order, index) => {
        console.log(order);
        const item = new Element('article');
        item.class(['card', 'animate__animated', 'animate__fadeInUp', 'animate__fast']);
        item.attributes([
            ['style', `animation-delay: ${index != 0 ? index/10 : 0}s`]
        ])
        item.inner(`
            <div class="card__header mb-4">
                <h4 class="mb-0">Bestelling ${order.orderNo}</h4>
                ${order.method == 'Ophalen' ? 
                    `<small class="text--modern">${order.method} van ${order.timeslot}</small>` :  
                    `<small class="text--modern">${order.method} tussen 18u en 20u</small>`
                }
            </div>
            <div class="card__body mb-4">
                <h5 class="text--modern">Details</h5>
                <p>Orderdetails</p>
            </div>
            <div class="card__footer">
                <p class="mb-0">orderdate & status</p>
            </div>
        `);
        item.append('[data-label="orderList"]');
    });
}

getOrderData().then(data => {
    node('[data-label="orderList"]').innerHTML = '';
    renderOrders(data);
});


node('[data-label="userEmail"]').innerHTML = email;
