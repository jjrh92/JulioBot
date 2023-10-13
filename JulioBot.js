const express = require('express')
const app = express()

app.get('/', (req, res) => {

    res.send('Hello World!');
    
});

const port = 3001

const { Telegraf, Input } = require ("telegraf");
require ("dotenv").config ();
const bot = new Telegraf (process.env.TELEGRAM_TOKEN);

bot.help ((ctx) => {

    ctx.sendChatAction ("typing");
    ctx.replyWithHTML (`<code>🎒🤖 BultoBot V-1.1.0\nComandos Disponibles:</code>\n<code>/metar "icao"</code>\n<code>/clima "ciudad"</code>\n<code>/gpt "consulta"</code>`);

});

bot.command (["metar", "METAR", "Metar"], (ctx) => {

    let userMessage = ctx.message.text.slice(7,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, recuerda que el codigo ICAO contiene 4 digitos. Ejemplo "/metar SVMI"</code>`);

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

bot.command (["clima", "CLIMA", "Clima"], (ctx) => {

    ctx.sendChatAction ("typing");
    let userMessage = ctx.message.text.slice(7,11).toUpperCase();

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, por favor ingresa el nombre de la ciudad a consultar. Ejemplo "/clima maracay"</code>`);

    }

    else {

        let url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${userMessage}&aqi=no&lang=es`;


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

                ctx.replyWithHTML (`<code>🤖Tu solicitud de Clima ${ctx.from.first_name} ☁️✈️:</code>\n<code>La fecha y hora local en ${location} ${region} son las ${time}.Hacen ${temp}°C, y el estado actual es ${text} con vientos de ${wind} km/h en dirección ${windDir}.Presión Barometrica de ${pressure} milibares con ${humidity}% de humedad.Sensación termica de ${feelslike}°C y visibilidad de ${visibility}KM.</code>`);
    
            })

    }


});

bot.command (["gpt", "GPT", "Gpt"], (ctx) => {

    ctx.sendChatAction ("typing");
    let userMessage = ctx.message.text.slice(5,10000);

    if (userMessage.length < 4) {

        ctx.replyWithHTML (`<code>🎒 Tu solicitud no pudo ser procesada, por favor ingresa Una consulta valida. Ejemplo "/gpt consulta"</code>`);

    }

    else {

        const OpenAI = require("openai");
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
            ctx.replyWithHTML (`<code>${reply}</code>`);
        }

        AskGPT ();

    }

});

// bot.command (["cmd"], (ctx) => {

//     ctx.replyWithMarkdownV2 ('||texto||');
//     ctx.sendChatAction ("record_voice");
//     ctx.sendVoice(Input.fromLocalFile("./audio.ogg"));

// });

bot.launch();

app.listen(port, () => {
  console.log(`BultoBot listening on port ${port}`)
})