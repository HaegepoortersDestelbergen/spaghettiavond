import { node, Element, Api } from 'https://unpkg.com/cutleryjs/dist/js/index.js'

/**
 * TODO: if email defined, get by email, by method defined, get by method, ...
 */

const url = new URL(window.location.href);
const email = url.searchParams.get('email') || 'Geen emailadres opgegeven';

const getOrderData = async (userEmail = email) => {
    return await new Api(`https://spaghetti.haegepoorters.be/api?email=${userEmail}`).JSON();
}

const renderOrders = (data) => {
    data.forEach((o, index) => {
        const { toppings, drinks } = o.order
        const item = new Element('article');
        item.class(['card', 'order', 'animate__animated', 'animate__fadeInUp', 'animate__fast']);
        item.attributes([
            ['style', `animation-delay: ${index != 0 ? index/10 : 0}s`]
        ])
        item.inner(`
            <div class="card__header d-flex">
                <div class="order__no mr-3">
                    ${o.orderNo}
                </div>
                <div>
                    <h4 class="mb-0">Bestelling </h4>
                    ${o.method == 'Ophalen' ? 
                        `<small class="text--modern order__method">${o.method} van ${o.timeslot}</small>` :  
                        `<small class="text--modern order__method"><i data-feather="truck" class="mr-2"></i> bezorging tussen 18u en 20u</small>`
                    }
                </div>
            </div>
            <hr>
            <div class="card__body mb-0">
                <div class="row mb-3">
                    <div class="col-12 col-md-6">
                        <div class="mb-3">
                            <h5 class="text--modern">Klaargemaakte porties</h5>
                            <p class="mb-0">Kinder <span class="text--var">${o.order.readyToEat.kids} porties</span> &nbsp – &nbsp Volwassen <span class="text--var">${o.order.readyToEat.adult} porties</span></p>
                        </div>
                        <div class="mb-3">
                            <h5 class="text--modern">Saus</h5>
                            <p class="mb-0">0,5 kilo <span class="text--var">${o.order.sauce.small} pot${o.order.sauce.small == 1 ? '' : 'ten'}</span> &nbsp – &nbsp 1 kilo <span class="text--var">${o.order.sauce.bigg} pot${o.order.sauce.bigg == 1 ? '' : 'ten'}</span></p>
                            <p class="mb-0"></p>
                        </div>
                        <div class="mb-3">
                            <p class="mb-0">
                            <h5 class="text--modern">Toppings</h5>
                                Kaas <span class="text--var">${toppings.cheese}</span> &nbsp – &nbsp 
                                Parmezaan <span class="text--var">${toppings.parmezan}</span> &nbsp – &nbsp 
                                Spekjes <span class="text--var">${toppings.bacon}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="mb-0">
                            <p class="mb-0">
                            <h5 class="text--modern">Wijn</h5>
                                Wit <span class="text--var">${drinks.wineWhite} flessen</span> &nbsp – &nbsp 
                                Rood <span class="text--var">${drinks.wineRed} flessen</span>
                            </p>
                        </div>
                        <div class="mb-0">
                            <p class="mb-0">
                            <h5 class="text--modern">Sappen</h5>
                                Sinaas <span class="text--var">${drinks.juiceOrange} flessen</span> &nbsp – &nbsp 
                                Worldmix <span class="text--var">${drinks.juiceWorldmix} flessen</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <h5 class="text--modern">Totaal</h5>
                        <h3>€53</h3>
                    </div>
                </div>
            </div>
            <hr>
            <div class="card__footer d-flex justify-content-between">
                <p class="mb-0 text--modern">${o.timestamp}</p>
                <p class="mb-0 text--modern order__pay-status" data-status="${o.payStatus}">${o.payStatus == true ? 'betaald' : 'niet betaald'}</p>
            </div>
        `);
        item.append('[data-label="orderList"]');
    });
}

getOrderData().then(data => {
    node('[data-label="orderList"]').innerHTML = '';
    renderOrders(data);
    feather.replace();
});


node('[data-label="userEmail"]').innerHTML = email;
