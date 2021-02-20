const Discord = require("discord.js");
const db = require('quick.db');
const ayarlar = require("../ayarlar.json")

var kb = new db.table("KayitBilgi");

module.exports = {
    enabled: true,
    aliases: ["kayitlar"],
    name: "kayıtlar",
    description: "Kişi kayıtları.",

    async run(client, message, args) {
        if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")

        let member = message.mentions.users.first() || message.guild.users.cache.get(args[0])
        if (!member) return message.channel.send("Lütgen, bir kullanıcı giriniz.")
        var kullanici = message.guild.member(member)

        if (kb.has(kullanici.user.id + ".kayitlar")) {
            var kullanici_isimleri = ""
            var isimler = kb.get(kullanici.user.id + ".kayitlar")
            isimler.forEach(ism => {
                kullanici_isimleri += `\`${ism["isim"]} ${ism["yas"]}, ${ism["cinsiyet"]}\`\n`
            })
            mesaj = {
                color: "GREEN",
                description: `<@${kullanici.user.id}>, kullanıcısına ait kayıtlar:\n\n${kullanici_isimleri}\n\nToplam: ${isimler.length}`
            }
            return message.channel.send({embed: mesaj})
        } else {
            return message.channel.send("**Maalesef bu kişiye ait bir veri bulamadım :(**");
        }
    }
}
