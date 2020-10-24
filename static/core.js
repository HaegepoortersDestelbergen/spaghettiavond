import {
    node,
    Element,
    Api,
    getFormData
} from 'https://unpkg.com/cutleryjs/dist/js/index.js'

const url = new URL(window.location.href);
const email = url.searchParams.get('email') || 'Geen emailadres opgegeven';

const getOrderData = async () => {
    return await new Api(`${window.location.origin}/api${window.location.search}`).JSON();
}

node('[data-label="formInput"]').addEventListener("submit", (e) => {
    e.preventDefault()
    const data = getFormData(e.target);
    window.location.search = `email=${data.get('email')}`;
})

let orderIdNote = [];
const renderOrders = (data) => {
    data.forEach((o, index) => {
        const price = calculatePrices({...o.order, method: o.method});
        const { toppings, drinks } = o.order
        orderIdNote.push(o.orderNo);
        
        const item = new Element('article');
        item.class(['card', 'order', 'animate__animated', 'animate__fadeInUp', 'animate__fast']);
        item.attributes([
            ['style', `animation-delay: ${index != 0 ? index/10 : 0}s`]
        ])
        item.inner(`
            <div class="card__header d-flex flex-row justify-content-between">
                <div class="d-flex">
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
                <div>
                    <h3 class="mb-0 text-right">€${price._ORDER_TOTAL}</h3>
                    <h5 class="mb-0 text--modern text-right">Totaal</h5>
                </div>
            </div>
            <hr>
            <div class="card__body mb-0">
                <div class="row mb-3">
                    <div class="col-12 col-md-6 mb-4 mb-md-0">
                        <h5 class="mb-3">Met vlees</h5>
                        <h5 class="text--modern">Klaargemaakte porties (${prices.portions.kids}€ — ${prices.portions.adult}€ / portie)</h5>
                        <p class="mb-3">Kinder <span class="text--var">${o.order.readyToEat.kids} porties</span> &nbsp – &nbsp Volwassen <span class="text--var">${o.order.readyToEat.adult} porties</span></p>
                        
                        <h5 class="text--modern">Saus (${prices.sauce.small}€ — ${prices.sauce.bigg}€ / pot)</h5>
                        <p class="mb-0">0,5 kilo <span class="text--var">${o.order.sauce.small} pot${o.order.sauce.small == 1 ? '' : 'ten'}</span> &nbsp – &nbsp 1 kilo <span class="text--var">${o.order.sauce.bigg} pot${o.order.sauce.bigg == 1 ? '' : 'ten'}</span></p>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5 class="mb-3">Vegitarisch</h5>
                        <h5 class="text--modern">Klaargemaakte porties (${prices.portions.kids}€ — ${prices.portions.adult}€ / portie)</h5>
                        <p class="mb-3">Kinder <span class="text--var">${o.order.readyToEatVegi.kids} porties</span> &nbsp – &nbsp Volwassen <span class="text--var">${o.order.readyToEatVegi.adult} porties</span></p>
                        
                        <h5 class="text--modern">Saus (${prices.sauce.small}€ — ${prices.sauce.bigg}€ / pot)</h5>
                        <p class="mb-0">0,5 kilo <span class="text--var">${o.order.sauceVegi.small} pot${o.order.sauceVegi.small == 1 ? '' : 'ten'}</span> &nbsp – &nbsp 1 kilo <span class="text--var">${o.order.sauceVegi.bigg} pot${o.order.sauceVegi.bigg == 1 ? '' : 'ten'}</span></p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <h5 class="text--modern">Toppings (${prices.topping}€ / topping)</h5>
                        <p class="mb-0">
                            Kaas <span class="text--var">${toppings.cheese} porties</span> &nbsp – &nbsp 
                            Parmezaan <span class="text--var">${toppings.parmezan} porties</span> &nbsp – &nbsp 
                            Spekjes <span class="text--var">${toppings.bacon} porties</span>
                        </p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3 mb-md-0">
                        <h5 class="text--modern">Wijn (${prices.wine}€ / fles)</h5>
                        <p class="mb-0">
                            Wit <span class="text--var">${drinks.wineWhite} flessen</span> &nbsp – &nbsp 
                            Rood <span class="text--var">${drinks.wineRed} flessen</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5 class="text--modern">Sappen (${prices.juice}€ / fles)</h5>
                        <p class="mb-0">
                            Sinaas <span class="text--var">${drinks.juiceOrange} flessen</span> &nbsp – &nbsp 
                            Worldshake <span class="text--var">${drinks.juiceWorldmix} flessen</span>
                        </p>
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

const intToPrice = (int, price = 0) => {
    const c = int*price
    prices._TOTAL += c;
    prices._ORDER_TOTAL += c;
    return c;
}

const stringToPrice = (str, priceObj) => {
    const c = priceObj[str];
    prices._TOTAL += c;
    prices._ORDER_TOTAL += c;
    return c;
}

const prices = {
    _TOTAL: 0,
    _ORDER_TOTAL: 0,
    topping: 1, 
    portions: {
        kids: 8,
        adult: 10
    },
    method: {
        'Ophalen': 0,
        'Bezorging': 2.5
    },
    sauce: {
        small: 12,
        bigg: 20
    },
    juice: 4,
    wine: 10
}

const calculatePrices = ({readyToEat, readyToEatVegi, sauce, sauceVegi, toppings, method, drinks: {wineWhite, wineRed, juiceOrange, juiceWorldmix}}) => {
    prices._ORDER_TOTAL = 0;
  
    const p = {
        method: stringToPrice(method, prices.method),
        portions: {
            kids: intToPrice(readyToEat.kids, prices.portions.kids),
            adult: intToPrice(readyToEat.adult, prices.portions.adult)
        },
        portionsVegi: {
            kids: intToPrice(readyToEatVegi.kids, prices.portions.kids),
            adult: intToPrice(readyToEatVegi.adult, prices.portions.adult)
        },
        sauce: {
            small: intToPrice(sauce.small, prices.sauce.small),
            bigg: intToPrice(sauce.bigg, prices.sauce.bigg)
        },
        sauceVegi: {
            small: intToPrice(sauceVegi.small, prices.sauce.small),
            bigg: intToPrice(sauceVegi.bigg, prices.sauce.bigg)
        },
        toppings: {
            cheese: intToPrice(toppings.cheese, prices.topping),
            parmezan: intToPrice(toppings.parmezan, prices.topping),
            bacon: intToPrice(toppings.bacon, prices.topping)
        }, 
        juice: intToPrice(juiceOrange, prices.juice) + intToPrice(juiceWorldmix, prices.juice),
        wine: intToPrice(wineWhite, prices.wine) + intToPrice(wineRed, prices.wine),
        _ORDER_TOTAL: prices._ORDER_TOTAL
    }
    console.log(p)
    return p;
}

getOrderData().then(data => {
    node('[data-label="orderList"]').innerHTML = '';
    renderOrders(data);
    feather.replace();
    node('[data-label="total_price"]').innerHTML = `€${prices._TOTAL}`;
    node('[data-label="cart"]').classList.remove('d-none');
    node('[data-label="cart-note"]').innerHTML = `overschrijven naar <span>BE18 7360 3138 9365</span><br>
    mededeling <span>spaghetti bestelling ${orderIdNote.join('-')}</span>`
    node('[data-label="userEmail"]').classList.remove('d-none');
});

node('[data-label="userEmail"]').innerHTML = email;

Mousetrap.bind(['command+f', 'ctrl+f'], (event) => {
    const form = node('[data-label="formInput"]').classList;
    event.preventDefault();
    if (form.contains('d-none')) {
        form.remove('d-none');
        form.add('d-block');
    } else {
        form.add('d-none');
        form.remove('d-block');
    }
});