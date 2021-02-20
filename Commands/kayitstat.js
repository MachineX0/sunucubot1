const Discord = require("discord.js");
const db = require('quick.db');
const ayarlar = require("../ayarlar.json")

var kl = new db.table("KayitLog");

module.exports = {
  enabled: true,
  aliases: ["kayıtstat", "kyetkili"],
  name: "yetkilik",
  description: "Kayıt Stat",

  async run(client, message, args) {
    if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")
    let member = message.mentions.users.first() || client.users.cache.get(args[0])
    var kullanici = message.guild.member(member)
    if (!args[0]) {
      // KENDI STATI
      if (!kl.has(message.author.id)) kl.set(message.author.id, { erkek: 0, kadin: 0 })
      const erkek = Number(kl.get(message.author.id + ".erkek"))
      const kadin = Number(kl.get(message.author.id + ".kadin"))
      const toplam = (erkek + kadin)
      const mesaj = {
        thumbnail: {
          url: message.author.avatarURL(),
        },
        color: 0x2f3136,
        title: "Cafune Kayıt İstatistikleri",
        description: `• Toplam Kayıtların: \`${toplam}\`
        • Toplam Erkek Kayıtların: \`${erkek}\`
        • Toplam Kadın Kayıtların: \`${kadin}\``
      }
      message.channel.send({ embed: mesaj })
    } else if (typeof kullanici !== "undefined") {
      // KULLANICININ STATI
      if (!kl.has(kullanici.id)) kl.set(kullanici.id, { erkek: 0, kadin: 0 })
      const erkek = kl.get(kullanici.user.id + ".erkek")
      const kadin = kl.get(kullanici.user.id + ".kadin")
      const toplam = erkek + kadin
      const mesaj = {
        thumbnail: {
          url: kullanici.user.avatarURL(),
        },
        color: 0x2f3136,
        title: "Cafune Kayıt İstatistikleri",
        description: `• Toplam Kayıtların: \`${toplam}\`
        • Toplam Erkek Kayıtların: \`${erkek}\`
        • Toplam Kadın Kayıtların: \`${kadin}\``
      }
      message.channel.send({ embed: mesaj })
    } else {
      // KULLANICI YOK
      message.channel.send("**Böyle bir kullanıcı yok!**")
    }
  }
}
