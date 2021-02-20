const Discord = require("discord.js");
const db = require('quick.db');
const ayarlar = require("../ayarlar.json")

var kb = new db.table("KayitBilgi");


module.exports = {
    enabled: true,
    aliases: ["kayıtbilgi", "kayıtinfo", "kayıti", "kayıtb"],
    name: "whois",
    description: "Kayıt Bilgisi",

    async run(client, message, args) {
        if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")
	    let member = message.mentions.users.first() || message.guild.users.cache.get(args[0])
  	  	if (!member){
			const mesaj = {
                color: "RED",
                description: "Lütfen bir kullanıcı etiketleyiniz veya ID'sini giriniz."
            }
             return message.channel.send({ embed: mesaj })
	  }
 	   const kullanici = message.guild.member(member)

	if (typeof kullanici !== "undefined") {
            // KULLANICININ STATI
            if (!kb.has(kullanici.id)) return message.channel.send("**Maalesef bu kişiye ait bir veri bulamadım :(**");
            var kbilgi = kb.get(kullanici.id)
            var kisim = kbilgi["isim"]
            var kyas = kbilgi["yas"]
            var kyetkili = kbilgi["yetkili"]
            var ktarih = kbilgi["tarih"]
            var kcinsiyet = kbilgi["cinsiyet"]
            const mesaj = {
                thumbnail: {
                    url: kullanici.user.avatarURL(),
                },
                color: 0x2f3136,
                title: "Cafune Kayıt Bilgi",
                description: `• Kişi: <@${kullanici.id}>
        • Kaydeden Yetkili: <@${kyetkili}>
        • İsim, Yaş: \`${kisim}, ${kyas}\`
        • Cinsiyet: \`${kcinsiyet}\`
        • Tarih: \`${ktarih}\``
            }
            message.channel.send({ embed: mesaj })
        } else {
            // KULLANICI YOK
            message.channel.send("**Böyle bir kullanıcı yok!**")
        }
    }
}
