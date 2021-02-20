const { client } = require('../index');
const ayarlar = require("../ayarlar.json");


client.on("ready", async () => {
    dat = new Date();
    date = dat.getDate() + "/" + dat.getMonth() + "/" + dat.getFullYear() + " " + dat.getHours() + "." + dat.getMinutes()
    console.log("====[ REGISTER ]====".blue)
    console.log("Logged in as: ".gray + client.user.tag.green);
    console.log("Login date: ".gray + date.green)
    console.log("CebeciSoft gururla sunar!")
    console.log("====================".blue)
    client.user.setPresence({ activity: { name: "Cafune 💖" }, status: 'dnd' })
    setInterval(() => {
        client.user.setPresence({ activity: { name: "Cafune 💖" }, status: 'dnd' })
    }, 300 * 1000) // her 5dkda bir pingle
});

module.exports = {
    name: "onReady",
    description: "Bot hazırlanınca.",
    enabled: true
}
