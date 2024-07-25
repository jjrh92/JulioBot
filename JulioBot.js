const express = require ('express');
const app = express ();
const cron = require('node-cron');

app.get('/', (req, res) => {

    res.send('Hello World!');
    
});

const port = 3000;

const { Telegraf, Input } = require ("telegraf");

require ("dotenv").config ();

const bot = new Telegraf (process.env.TELEGRAM_TOKEN);

bot.start ((ctx) => {

    ctx.sendChatAction ("typing");
    ctx.replyWithHTML (`<code>🎒🤖 BultoBot V-1.4.0\nComandos Disponibles:</code>\n<code>/metar "icao"</code>\n<code>/taf "icao"</code>\n<code>/clima "ciudad"</code>\n<code>/gpt "consulta"</code>`);

});

bot.help ((ctx) => {

    ctx.sendChatAction ("typing");
    ctx.replyWithHTML (`<code>🎒🤖 BultoBot V-1.4.0\nComandos Disponibles:</code>\n<code>/metar "icao"</code>\n<code>/taf "icao"</code>\n<code>/clima "ciudad"</code>\n<code>/gpt "consulta"</code>`);

});

bot.command (["metar", "METAR", "Metar"], (ctx) => {
    
    ctx.sendChatAction ("typing");
    let userMessage = ctx.message.text.slice(7,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, recuerda que el codigo ICAO contiene 4 digitos. Ejemplo "/metar SVBS"</code>`);

    }

    else {

        let url = `https://api.checkwx.com/bot/metar/${userMessage}?x-api-key=${process.env.METAR_TOKEN}`;

        fetch (url) 
            .then((response) => response.text())
            
            .then (response => {
    
                ctx.replyWithHTML (`<code>🤖Tu solicitud de METAR ${ctx.from.first_name} ☁️✈️:</code><code>\n${response}</code>`);
    
            })

    }

});

bot.command (["taf", "TAF", "Taf"], (ctx) => {
    
    ctx.sendChatAction ("typing");
    let userMessage = ctx.message.text.slice(4,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, recuerda que el codigo ICAO contiene 4 digitos. Ejemplo "/taf SVBS"</code>`);

    }

    else {

        let url = `https://api.checkwx.com/taf/${userMessage}/?x-api-key=${process.env.METAR_TOKEN}`;

        fetch (url) 
            .then((response) => response.json ())
            .then (response => {

                let rawData = (response.data);

                ctx.replyWithHTML (`<code>🤖Tu solicitud de TAF ${ctx.from.first_name} ☁️✈️:</code><code>\n${rawData}</code>`);
        
            })

    }

});

bot.command (["clima", "CLIMA", "Clima"], (ctx) => {

    ctx.sendChatAction ("typing");
    let userMessage = ctx.message.text.slice(7,11).toUpperCase ();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, por favor ingresa el nombre de la ciudad a consultar. Ejemplo "/clima Caracas"</code>`);

    }

    else {

        let url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${userMessage}&aqi=no&lang=es`;


        fetch (url) 

        .then((response) => response.json ())
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

            ctx.replyWithHTML (`<code>🤖Tu solicitud de Clima ${ctx.from.first_name} ☁️✈️:</code>\n<code>La fecha y hora local en ${location} ${region} son las ${time}.Hacen ${temp}°C, y el estado actual es ${text} con vientos de ${wind} km/h en dirección ${windDir}.Presión Barometrica de ${pressure} milibares con ${humidity}% de humedad.Sensación termica de ${feelslike}°C y visibilidad de ${visibility}KM.</code>`);
    
        })

    }

});

bot.command (["gpt", "GPT", "Gpt"], async ctx => {

    await ctx.persistentChatAction ("typing", async () => {

        let userMessage = ctx.message.text.slice (5,10000);

        if (userMessage.length < 4) {

            ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, por favor ingresa Una consulta valida. Ejemplo "/gpt consulta"</code>`);

        }

        else {

            const OpenAI = require ("openai");
            const openai = new OpenAI ({

                apiKey: process.env.GPT_TOKEN,

            });

            const AskGPT = async () => {

                const chatCompletion = await openai.chat.completions.create ({

                    model: "gpt-3.5-turbo",
                    messages: [{"role": "user", "content": userMessage,}],
                    max_tokens:2048

                });

                let reply = chatCompletion.choices[0].message.content;
                ctx.replyWithHTML (`<code>🎒🤖Respuesta para ${ctx.from.first_name}:</code>\n<code>${reply}</code>`);

            }

            await AskGPT ();

        }

    })

});

// bot.command (["cmd"], (ctx) => {

//     ctx.replyWithMarkdownV2 ('||texto||');
//     ctx.sendChatAction ("record_voice");
//     ctx.sendVoice(Input.fromLocalFile("./audio.ogg"));

// });



// Schedule NASA APOD execution at 11 PM every day (04:00 zulu time)

cron.schedule('0 4 * * *', () => {
    const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}`;
    fetch(nasaURL)
        .then((response) => response.text())
        .then((response) => {
            let parsedResponse = JSON.parse(response);
            let imageTitle = parsedResponse.title;
            let imageURL = parsedResponse.url;
            let date = parsedResponse.date;
            let dateParts = date.split("-");
            let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            let author = parsedResponse.copyright;

            bot.telegram.sendPhoto(-1001212168810, imageURL, {
                caption: `<code>🎒📷🔭🚀🪐🛰️🌌☄️🛸🌕📡🪐👽\nLa Imagen de hoy ${formattedDate}.\n"${imageTitle}" de ${author}.\nBuenas Noches</code>`,
                parse_mode: 'HTML',
            });
        });
});

// Schedule Chuck's Joke execution at 7 AM every day (11:00 zulu time)

cron.schedule('0 11 * * *', () => {
    const jokesURL = `https://api.chucknorris.io/jokes/random`;
    fetch(jokesURL)
        .then((response) => response.text())
        .then((response) => {
            let parsedResponse = JSON.parse(response);
            let joke = parsedResponse.value;
            bot.telegram.sendMessage(-1001212168810, `<code>☀️Buenos Dias Bultos🎒\n\n🧔${joke}😹\n\nQue el dia de hoy sea mejor que ayer.</code>`, { parse_mode: 'HTML' });
        });
});

// cron.schedule('*/4 * * * * *', () => { 
// Test every 4 seconds

bot.launch();

app.listen (port, () => {

  console.log(`BultoBot V-1.4.0 listening on port ${port}`)

})
