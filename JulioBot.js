const { Telegraf } = require ("telegraf");
import fetch from 'node-fetch';

const bot = new Telegraf ("6065874551:AAFpVTDm6c5xD-5mJzjfEqFVa0OVM4GnANo");

bot.start ((ctx) => {

    ctx.replyWithHTML (`<code>🤖 BultoBot V-1.0.1 🤖</code>\n<code>Iniciando 1%............</code>\n<code>.........Terminando 100%</code>\n<code>🛸🇻🇪🇨🇱🇦🇷🇵🇦🇨🇴👽</code>\n<code>Usa /help</code>`);

});

bot.help ((ctx) => {

    ctx.replyWithHTML (`<code>Comandos Disponibles:</code>\n<code>/metar "icao"</code>\n<code>/clima "ciudad"</code>`);

});

bot.hears ("🏹", ctx => {

    ctx.replyWithHTML (`<code>"No es la flecha sino el indio" — ${ctx.from.username+ "."}</code>`);

});

bot.mention ("BultoBot", ctx => {

    ctx.replyWithHTML (`<code>Debes ejecutar "/help" para ver los comandos disponibles.\nNo seas 🎒 ${ctx.from.first_name}.</code>`);

});

bot.command (["metar", "METAR", "Metar"], (ctx) => {

    let userMessage = ctx.message.text.slice(7,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, recuerda que el codigo ICAO contiene 4 digitos. Ejemplo "/metar SVMI"</code>`);

    }

    else {

        let url = `https://api.checkwx.com/bot/metar/${userMessage}?x-api-key=a7691d10f1fb4c06b710633924`;

    
        fetch (url) 
            .then((response) => response.text())
            
            .then (response => {
    
                ctx.replyWithHTML (`<code>🤖Gracias por tu solicitud ${ctx.from.first_name} ☁️✈️:</code><code>\n${response}</code>`);
    
            })

    }





});

bot.command (["clima", "CLIMA", "Clima"], (ctx) => {

    let userMessage = ctx.message.text.slice(7,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, por favor ingresa el nombre de la ciudad a consultar. Ejemplo "/clima maracay"</code>`);

    }

    else {

        let url = `https://api.weatherapi.com/v1/current.json?key=96d2149d358e43d8a82220554231110&q=${userMessage}&aqi=no&lang=es`;


        fetch (url) 
            .then((response) => response.json())

            .then (response => {

                let location = response.location.name;
                let region = response.location.region;
                let time = response.location.localtime;
                let temp = response.current.temp_c;
                let text = response.current.condition.text;
                let wind = response.current.wind_kph;
                let windDir = response.current.wind_dir;
                let pressure = response.current.pressure_mb;
                let humidity = response.current.humidity;
                let feelslike = response.current.feelslike_c;
                let visibility = response.current.vis_km;



                ctx.replyWithHTML (`<code>☁️🌀 Aca tienes el reporte solicitado: ${ctx.from.first_name+ ":"}\n\nLa fecha y hora local en ${location} ${region} son las ${time}.\nHacen ${temp}°C, y el estado actual es ${text} con vientos de ${wind} km/h en dirección ${windDir}.\nPresión Barometrica de ${pressure} milibares con ${humidity}% de humedad.Sensación termica de ${feelslike}°C y visibilidad de ${visibility}KM.</code>`);
    
            })

    }


});

bot.launch();