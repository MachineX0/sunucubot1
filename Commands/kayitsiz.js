const Discord = require("discord.js");
const db = require('quick.db');
const ayarlar = require("../ayarlar.json")

var kl = new db.table("KayitLog");
var kb = new db.table("KayitBilgi");

module.exports = {
  enabled: true,
  aliases: [],
  name: "kayıtsız",
  description: "Kayıtsıza atma.",

  async run(client, message, args) {
    if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")

    let member = message.mentions.users.first() || message.guild.users.cache.get(args[0])
    if (!member) return message.channel.send("Lütfen, bir kullanıcı giriniz.")

    const kullanici = message.guild.member(member)
    // Değişken tanımlama
    var kayitsiz1, kayitsiz2, register, kayitlog, onay
    // KAYITSIZ ROL KONTROL
    if (ayarlar.kayitsiz_1 != "") {
      try {
        kayitsiz1 = message.guild.roles.cache.get(ayarlar.kayitsiz_1);
        if (kayitsiz1 == undefined) throw kayitsiz1;
      } catch {
        console.log("DIKKAT: " + ayarlar.kayitsiz_1 + "ID'li bir rol yok. (kayitsiz_1)")
      }
    }
    if (ayarlar.kayitsiz_2 != "") {
      try {
        kayitsiz2 = message.guild.roles.cache.get(ayarlar.kayitsiz_2);
        if (kayitsiz2 == undefined) throw kayitsiz2;
      } catch {
        console.log("DIKKAT: " + ayarlar.kayitsiz_2 + "ID'li bir rol yok. (kayitsiz_2)")
      }
    }
    if (ayarlar.tag_rolu != "") {
      try {
        tagrolu = message.guild.roles.cache.get(ayarlar.tag_rolu);
        if (tagrolu == undefined) throw tagrolu;
      } catch {
        console.log("DIKKAT: " + ayarlar.tag_rolu + "ID'li bir rol yok. (tag_rolu)")
      }
    }

    // MESAJ GÖNDERİLECEK KANALLAR KONTROL
    if (ayarlar.register_kanali != "") {
      try {
        register = message.guild.channels.cache.get(ayarlar.register_kanali);
        if (register == undefined) throw register;
      } catch {
        console.log("DIKKAT: " + ayarlar.register_kanali + "ID'li bir kanal yok. (register_kanali)")
      }
    }
    if (ayarlar.kayit_log_kanali != "") {
      try {
        kayitlog = message.guild.channels.cache.get(ayarlar.kayit_log_kanali);
        if (kayitlog == undefined) throw kayitlog;
      } catch {
        console.log("DIKKAT: " + ayarlar.kayit_log_kanali + "ID'li bir kanal yok. (kayit_log_kanali)")
      }
    }
    // EMOJI KONTROL
    if (ayarlar.onay_emojisi != "") {
      try {
        onay = message.guild.emojis.cache.find(emoji => emoji.name === ayarlar.onay_emojisi);
        if (onay == undefined) throw onay;
      } catch {
        console.log("DIKKAT: " + ayarlar.onay_emojisi + "ID'li bir emoji yok. (onay_emojisi)")
      }
    }
    try {
      await kullanici.setNickname(`${ayarlar.tag} İsim | Yaş`)
    } catch {
      console.log("Bir yoneticinin ismini degistirmeye calistim.")
    }


    const mesaj = {
      author: {
        name: message.author.username,
        icon_url: message.author.avatarURL()
      },
      color: 0x2f3136,
      description: `• <@${kullanici.user.id}> adlı kullanıcının kaydı alındı. \n • Yeni ismi \`${ayarlar.tag} İsim | Yaş\` olarak güncellendi. `,
    }
    if (typeof register !== undefined) register.send({ embed: mesaj })
    if (typeof onay !== undefined) message.react(onay)

    try {
      // ROL VERME
      await kullanici.roles.set([])
      if (typeof kayitsiz1 !== "undefined") await kullanici.roles.add(kayitsiz1)
      if (typeof kayitsiz2 !== "undefined") await kullanici.roles.add(kayitsiz2)
      if (typeof tagrolu !== "undefined") if (kullanici.user.username.includes(ayarlar.tag)) await kullanici.roles.add(tagrolu)
      kb.set(kullanici.user.id + ".cinsiyet", "YOK")
      kb.set(kullanici.user.id + ".yetkili", message.author.id)
      kb.set(kullanici.user.id + ".isim", "YOK")
      kb.set(kullanici.user.id + ".yas", "YOK")
      var tarih = new Date();
      var gercek_tarih = tarih.getDate() + "/" + tarih.getMonth() + "/" + tarih.getFullYear() + " " + tarih.getHours() + "." + tarih.getMinutes()
      kb.set(kullanici.user.id + ".tarih", gercek_tarih)
    } catch { }
    // LOG
    const logmesaji = {
      thumbnail: {
        url: message.author.avatarURL(),
      },
      color: 0x2f3136,
      title: "Cafune Kayıt",
      description: `• Kayıtsıza Atan: <@${message.author.id}>
      • Kayıtsıza Atılan: <@${kullanici.user.id}>
      • Yeni İsim: \`${ayarlar.tag} İsim | Yaş\` 
      • Kaydın Silindiği Kanal: ${message.channel.name}`
    }
    if (typeof kayitlog !== undefined) kayitlog.send({ embed: logmesaji })
  }
}
