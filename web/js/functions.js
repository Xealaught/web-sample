var tabsLoopTimout = null;
var coinData = null;
var completeRequests = 0;

function initPage () {
    fluidLayout();
    parseInputs();

    // begin looping through cryptocoin tabs
    tabsLoopTimout = setTimeout( function () { loopTabs() }, 4000 );

    // for convenience
    document.getElementById('investment_input').onkeypress  = function() { if (event.which == 13) { event.preventDefault(); } };
    var inputs = document.getElementsByClassName('hashpower');
    for(var i = 0; i<inputs.length; i++) {
        var input = inputs[i].querySelectorAll("input");
        input[0].onkeypress  = function() { if (event.which == 13) { event.preventDefault(); } };
    }
}

function fluidLayout() {
    var wrap = document.getElementById('wrap');
    var decoration = document.getElementById('decoration');

    wrap.style.top = '-' + (decoration.clientWidth * 0.119) + 'px';
}

function loopTabs () {
    var panels = document.getElementsByClassName('panel');
    var tabs = document.getElementsByClassName('tab');
    var incomes = document.getElementsByClassName('income');
    var hashpower = document.getElementsByClassName('hashpower');


    for(var i = 0; i < panels.length; i++) {
        if(panels[i].classList.contains('active')) {
            panels[i].classList.remove('active');
            tabs[i].classList.remove('active');
            incomes[i].classList.remove('active');
            hashpower[i].classList.remove('active');

            i = (i+2) > panels.length ? 0 : i+1;

            panels[i].classList.add('active');
            tabs[i].classList.add('active');
            incomes[i].classList.add('active');
            hashpower[i].classList.add('active');

            document.getElementById('contract').value = i;

            break;
        }
    }
    tabsLoopTimout = setTimeout( function () { loopTabs() }, 4000 );
}

function selectTab(elemId) {
    clearTimeout(tabsLoopTimout);

    var panels = document.getElementsByClassName('panel');
    var tabs = document.getElementsByClassName('tab');
    var incomes = document.getElementsByClassName('income');
    var hashpower = document.getElementsByClassName('hashpower');

    for(var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
        incomes[i].classList.remove('active');
        hashpower[i].classList.remove('active');
    }
    panels[elemId].classList.add('active');
    tabs[elemId].classList.add('active');
    incomes[elemId].classList.add('active');
    hashpower[elemId].classList.add('active');

    document.getElementById('contract').value = elemId;

    //tabsLoopTimout = setTimeout( function () { loopTabs() }, 20000 );
}

function calcInvest2Hash() {
    var investment = parseInt(document.getElementById('investment_input').value);
    if(isNaN(investment)) return;
    calcBTCInvestment2GHs(investment);
    calcETHInvestment2GHs(investment);
    calcZECInvestment2GHs(investment);
    calcLTCInvestment2GHs(investment);
}
function calcHash2Invest() {
    var hashRate = parseInt(document.getElementById('btc_hashpower_input').value);
    if(!isNaN(hashRate)) calcBTCGHs2Investment(hashRate);
    hashRate = parseInt(document.getElementById('eth_hashpower_input').value);
    if(!isNaN(hashRate)) calcETHGHs2Investment(hashRate);
    hashRate = parseInt(document.getElementById('zec_hashpower_input').value);
    if(!isNaN(hashRate)) calcZECGHs2Investment(hashRate);
    hashRate = parseInt(document.getElementById('ltc_hashpower_input').value);
    if(!isNaN(hashRate)) calcLTCGHs2Investment(hashRate);
}

function calProfit() {
    var timeSpan = 1;
    switch (parseInt(document.getElementById('period').value)) {
        case 0:
            timeSpan = 1;
            break;
        case 1:
            timeSpan = 7;
            break;
        case 2:
            timeSpan = 30;
            break;
        case 3:
            timeSpan = 90;
            break;
        case 4:
            timeSpan = 180;
            break;
        case 5:
            timeSpan = 365;
            break;
    }

    var hashRate = parseInt(document.getElementById('btc_hashpower_input').value);
    if(!isNaN(hashRate)) calcBitcoinProfit(coinData.btc.usd_price, coinData.btc.difficulty, hashRate, timeSpan);
    hashRate = parseInt(document.getElementById('eth_hashpower_input').value);
    if(!isNaN(hashRate)) calcEthereumProfit(coinData.eth.usd_price, coinData.eth.difficulty, hashRate, timeSpan);
    hashRate = parseInt(document.getElementById('zec_hashpower_input').value);
    if(!isNaN(hashRate)) calcZCashProfit(coinData.zec.usd_price, coinData.zec.difficulty, hashRate, timeSpan);
    hashRate = parseInt(document.getElementById('ltc_hashpower_input').value);
    if(!isNaN(hashRate)) calcLiteCoinProfit(coinData.ltc.usd_price, coinData.ltc.difficulty, hashRate, timeSpan);
}

function calcBTCInvestment2GHs(investment) {
    document.getElementById('btc_hashpower_input').value = Math.round(investment / coinData.btc.price_per_hash);
}
function calcBTCGHs2Investment(hashRate) {
    document.getElementById('investment_input').value = Math.round(hashRate * coinData.btc.price_per_hash);
}
function calcBitcoinProfit(fiatPrice, difficulty, hashRate, timeSpan) {
    // Mining servers hashpower (in GH/s)
    var gigaHashesPerSecond = hashRate * 1000 * 1000;
    var blockCoins = coinData.btc.block_reward; // won't halve for a year or so
    // Difficulty in TH/s
    var hashTime = (parseFloat(difficulty)) * (Math.pow(2.0, 32) / (gigaHashesPerSecond * 1000.0)) ;
    var blocksPerTime = (timeSpan * 24.0 * 3600.0) / hashTime;
    var coinsPerTime = blockCoins * blocksPerTime;
    var profit = coinsPerTime * fiatPrice;

    var resultLow = profit + ( profit * 0.05);
    resultLow = resultLow.toFixed(2);
    var resultHigh = profit + (profit * 0.35);
    resultHigh = resultHigh.toFixed(2);

    document.getElementById('btc-income').querySelectorAll("h1")[0].innerText = resultLow.toString() + ' - ' + resultHigh.toString() + "$";

    var btcResultLow = (profit + ( profit * 0.05)) / coinData.btc.usd_price;
    btcResultLow = btcResultLow.toFixed(2);
    var btcResultHigh = (profit + (profit * 0.35)) / coinData.btc.usd_price;
    btcResultHigh = btcResultHigh.toFixed(2);

    document.getElementById('btc-income').querySelectorAll("p")[0].innerText = btcResultLow.toString() + ' - ' + btcResultHigh.toString() + "BTC";

    document.getElementById('btc-price').innerText = coinData.btc.usd_price;
}

function calcETHInvestment2GHs(investment) {
    document.getElementById('eth_hashpower_input').value = Math.round(investment / coinData.eth.price_per_hash);
}
function calcETHGHs2Investment(hashRate) {
    document.getElementById('investment_input').value = Math.round(hashRate * coinData.eth.price_per_hash);
}
function calcEthereumProfit(fiatPrice, difficulty, hashRate, timeSpan) {
    var BlockTimeSec = 15; //in seconds
    var BlockReward = coinData.eth.block_reward; // number of ETH per block mined (5 currently)
    // Mining servers hashpower (in MH/s)
    hashRate /= 1000;
    // Difficulty in TH/s
    netHashGH = (difficulty / BlockTimeSec) / 1e9;
    var userRatio = hashRate * 1e6 / (netHashGH * 1e9);
    var blocksPerMin = 60.0 / BlockTimeSec;
    var ethPerMin = blocksPerMin * BlockReward;
    var min = userRatio * ethPerMin * fiatPrice;
    var hour = min * 60;
    var profit = hour * 24 * timeSpan;

    var resultLow = profit - (profit * 0.05);
    resultLow = resultLow.toFixed(2);
    var resultHigh = profit + (profit * 0.15);
    resultHigh = resultHigh.toFixed(2);

    document.getElementById('eth-income').querySelectorAll("h1")[0].innerText = resultLow.toString() + ' - ' + resultHigh.toString() + "$";

    var btcResultLow = (profit - ( profit * 0.05)) / coinData.btc.usd_price;
    btcResultLow = btcResultLow.toFixed(2);
    var btcResultHigh = (profit + (profit * 0.15)) / coinData.btc.usd_price;
    btcResultHigh = btcResultHigh.toFixed(2);

    document.getElementById('eth-income').querySelectorAll("p")[0].innerText = btcResultLow.toString() + ' - ' + btcResultHigh.toString() + "BTC";

    document.getElementById('eth-price').innerText = coinData.eth.usd_price;
}

function calcZECInvestment2GHs(investment) {
    document.getElementById('zec_hashpower_input').value = Math.round(investment / coinData.zec.price_per_hash);
}
function calcZECGHs2Investment(hashRate) {
    document.getElementById('investment_input').value = Math.round(hashRate * coinData.zec.price_per_hash);
}
function calcZCashProfit(fiatPrice, difficulty, hashRate, timeSpan) {
    var pool_fee = 0;
    var BlockReward = coinData.zec.block_reward; // number of ZEC per block mined
    var pool_fee = 0;
    hashRate /= 1000 * 1000 * 1000 * 100;
    var profit = (((hashRate * BlockReward) / difficulty * Math.pow(2.0, 13)) * (1 - pool_fee) * (3600 * 24 * timeSpan) ) * fiatPrice;

    var resultLow = profit + (profit * 0.15);
    resultLow = resultLow.toFixed(2);
    var resultHigh = profit + (profit * 0.45);
    resultHigh = resultHigh.toFixed(2);

    document.getElementById('zec-income').querySelectorAll("h1")[0].innerText = resultLow.toString() + ' - ' + resultHigh.toString() + "$";

    var btcResultLow = (profit + ( profit * 0.15)) / coinData.btc.usd_price;
    btcResultLow = btcResultLow.toFixed(2);
    var btcResultHigh = (profit + (profit * 0.45)) / coinData.btc.usd_price;
    btcResultHigh = btcResultHigh.toFixed(2);

    document.getElementById('zec-income').querySelectorAll("p")[0].innerText = btcResultLow.toString() + ' - ' + btcResultHigh.toString() + "BTC";

    document.getElementById('zec-price').innerText = coinData.zec.usd_price;
}

function calcLTCInvestment2GHs(investment) {
    document.getElementById('ltc_hashpower_input').value = Math.round(investment / coinData.ltc.price_per_hash);
}
function calcLTCGHs2Investment(hashRate) {
    document.getElementById('investment_input').value = Math.round(hashRate * coinData.ltc.price_per_hash);
}
function calcLiteCoinProfit(fiatPrice, difficulty, hashRate, timeSpan) {
    var BlockReward = coinData.ltc.block_reward; // number of LTC per block mined
    hashRate *= 1000 * 1000;
    var profit = BlockReward/(difficulty*Math.pow(2.0, 32)/hashRate/3600/(24 * timeSpan)) * fiatPrice;

    var resultLow = profit + (profit * 0.0);
    resultLow = resultLow.toFixed(2);
    var resultHigh = profit + (profit * 0.3);
    resultHigh = resultHigh.toFixed(2);

    document.getElementById('ltc-income').querySelectorAll("h1")[0].innerText = resultLow.toString() + ' - ' + resultHigh.toString() + "$";

    var btcResultLow = (profit + ( profit * 0.0)) / coinData.btc.usd_price;
    btcResultLow = btcResultLow.toFixed(2);
    var btcResultHigh = (profit + (profit * 0.3)) / coinData.btc.usd_price;
    btcResultHigh = btcResultHigh.toFixed(2);

    document.getElementById('ltc-income').querySelectorAll("p")[0].innerText = btcResultLow.toString() + ' - ' + btcResultHigh.toString() + "BTC";

    document.getElementById('ltc-price').innerText = coinData.ltc.usd_price;
}

// call ajax and retrieve current coin data from xml doc
function parseInputs() {
    jQuery.ajax({
        url: "coindata.json",
        dataType: "json",
        success: function(jsonData){
            coinData = jsonData;
            calcInvest2Hash();
            calProfit();
            requestCoinData();
        }
    });
}

// retrieve current snapshot of the cryptocurrencies, used as input into the javascript calculator
function requestCoinData() {
    //bitcoin
    jQuery.ajax({
        url: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
        headers: {"CB-VERSION": "2017-08-07\r\n"},
        dataType: 'json',
        success: function (jsonData) {
            coinData.btc.usd_price = parseFloat(jsonData.data.amount); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    jQuery.ajax({
        url: "https://blockexplorer.com/api/status?q=getDifficulty",
        dataType: 'json',
        success: function (jsonData) {
            coinData.btc.difficulty = parseFloat(jsonData.difficulty); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    coinData.btc.block_reward = 12.5;// $jsonData !== null ? 50 / floor($jsonData->block_height / 210000) : 0;

    // ethereum
    jQuery.ajax({
        url: "https://api.coinbase.com/v2/prices/ETH-USD/spot",
        headers: {"CB-VERSION": "2017-08-07\r\n"},
        dataType: 'json',
        success: function (jsonData) {
            coinData.eth.usd_price = parseFloat(jsonData.data.amount); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    jQuery.ajax({
        url: "https://www.etherchain.org/api/difficulty",
        dataType: 'json',
        success: function (jsonData) {
            coinData.eth.difficulty = parseFloat(jsonData[0].difficulty); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    coinData.eth.block_reward = 3;

    // zcash
    jQuery.ajax({
        url: "https://min-api.cryptocompare.com/data/price?fsym=ZEC&tsyms=USD",
        dataType: 'json',
        success: function (jsonData) {
            coinData.zec.usd_price = parseFloat(jsonData.USD); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function (errorResponse) {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    jQuery.ajax({
        url: "https://zcash.blockexplorer.com/api/status?q=getDifficulty",
        dataType: 'json',
        success: function (jsonData) {
            coinData.zec.difficulty = parseFloat(jsonData.difficulty); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    coinData.zec.block_reward = 12.5;

    // litecoin
    jQuery.ajax({
        url: "https://api.coinbase.com/v2/prices/LTC-USD/spot",
        dataType: 'json',
        success: function (jsonData) {
            coinData.ltc.usd_price = parseFloat(jsonData.data.amount); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    jQuery.ajax({
        url: "https://chain.so/api/v2/get_info/LiteCoin",
        dataType: 'json',
        success: function (jsonData) {
            coinData.ltc.difficulty = parseFloat(jsonData.data.mining_difficulty); // update old coin data with latest results
            //mark complete
            completeRequests++;
        },
        error: function () {
            //mark complete
            completeRequests++;
        },
        timeout: 1000 // sets timeout to 1 second
    });

    coinData.ltc.block_reward = 25;

    updateCoinData();
}

function updateCoinData () {
    if(completeRequests < 8) // poll until complete
        setTimeout(function () { updateCoinData() }, 14);
    else { // all done

        // save new coin data
        jQuery.ajax({
            url: "save-coin-data.php",
            type: "POST",
            data: {'data': JSON.stringify(coinData)}
        });
    }
}
jQuery( function ($) {
    if (navigator.userAgent.search("Firefox") > -1) {
        $('.circuits').css({ 'bottom': '65px', 'left': '-17px' });
    }
    if (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
        // This is internet explorer
        document.getElementById('path1').style.fill = '#ffffff';
        document.getElementById('path2').style.fill = '#ffffff';
    }
})