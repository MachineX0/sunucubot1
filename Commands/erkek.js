const Discord = require("discord.js");
const db = require('quick.db');
const ayarlar = require("../ayarlar.json")

var kl = new db.table("KayitLog");
var kb = new db.table("KayitBilgi");

module.exports = {
  enabled: true,
  aliases: ["e", "boy", "man"],
  name: "erkek",
  description: "Erkek kaydetme.",

  async run(client, message, args) {
    if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")

    let member = message.mentions.users.first() || client.users.cache.get(args[0])
    if (!member) return message.channel.send("Lütgen, bir kullanıcı giriniz.")

    const kullanici = message.guild.member(member)

    const tag = ayarlar.tag
    args = args.slice(1)
    const yas = args[args.length - 1];
    const isim = args.slice(0, args.length - 1).join(" ");
    if (isim.length > 26) return message.channel.send("Lütfen, daha kısa bir isim tercih ediniz.")
    if (!isim) return message.channel.send("Lütfen, bir isim giriniz.")
    if (!yas) return message.channel.send("Lütfen, bir yaş giriniz.")
    if (!Number(yas)) return message.channel.send("Lütfen, geçerli bir yaş giriniz.")
    // Değişken tanımlama
    var e1, e2, e3, k1, k2, k3, kayitsiz1, kayitsiz2, yenihesap, register, sohbet, kayitlog, onay
    // ERKEK ROL KONTROL
    if (ayarlar.erkek_1 != "") {
      try {
        e1 = message.guild.roles.cache.get(ayarlar.erkek_1);
        if (e1 == undefined) throw e1;
      } catch {
        console.log("DIKKAT: " + ayarlar.erkek_1 + "ID'li bir rol yok. (erkek_1)")
      }
    }
    if (ayarlar.erkek_2 != "") {
      try {
        e2 = message.guild.roles.cache.get(ayarlar.erkek_2);
        if (e2 == undefined) throw e2;
      } catch {
        console.log("DIKKAT: " + ayarlar.erkek_2 + "ID'li bir rol yok. (erkek_2)")
      }
    }
    if (ayarlar.erkek_3 != "") {
      try {
        e3 = message.guild.roles.cache.get(ayarlar.erkek_3);
        if (e3 == undefined) throw e3;
      } catch {
        console.log("DIKKAT: " + ayarlar.erkek_3 + "ID'li bir rol yok. (erkek_3)")
      }
    }

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

    // KIZ ROL KONTROL
    if (ayarlar.kadin_1 != "") {
      try {
        k1 = message.guild.roles.cache.get(ayarlar.kadin_1);
        if (k1 == undefined) throw k1;
      } catch {
        console.log("DIKKAT: " + ayarlar.kadin_1 + "ID'li bir rol yok. (kadin_1)")
      }
    }
    if (ayarlar.kadin_2 != "") {
      try {
        k2 = message.guild.roles.cache.get(ayarlar.kadin_2);
        if (k2 == undefined) throw k2;
      } catch {
        console.log("DIKKAT: " + ayarlar.kadin_2 + "ID'li bir rol yok. (kadin_2)")
      }
    }
    if (ayarlar.kadin_3 != "") {
      try {
        k3 = message.guild.roles.cache.get(ayarlar.kadin_3);
        if (k3 == undefined) throw k3;
      } catch {
        console.log("DIKKAT: " + ayarlar.kadin_3 + "ID'li bir rol yok. (kadin_3)")
      }
    }
    // YENI UYE ROLU KONTROL
    if (ayarlar.yeni_hesap != "") {
      try {
        yenihesap = message.guild.roles.cache.get(ayarlar.yeni_hesap);
        if (yenihesap == undefined) throw yenihesap;
      } catch {
        console.log("DIKKAT: " + ayarlar.yeni_hesap + "ID'li bir rol yok. (yeni_hesap)")
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
    if (ayarlar.sohbet_kanali != "") {
      try {
        sohbet = message.guild.channels.cache.get(ayarlar.sohbet_kanali);
        if (sohbet == undefined) throw sohbet;
      } catch {
        console.log("DIKKAT: " + ayarlar.sohbet_kanali + "ID'li bir kanal yok. (sohbet_kanali)")
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
      kullanici.setNickname(`${tag} ${isim} | ${yas}`)
    } catch {
      console.log("Bir yoneticinin ismini degistirmeye calistim.")
    }
    if (!kl.has(message.author.id)) await kl.set(message.author.id, { erkek: 0, kadin: 0 })
    kl.add(message.author.id + ".erkek", 1)
    kb.set(kullanici.user.id + ".cinsiyet", "Erkek")
    kb.set(kullanici.user.id + ".yetkili", message.author.id)
    kb.set(kullanici.user.id + ".isim", isim)
    kb.set(kullanici.user.id + ".yas", yas)
    if (!kb.has(kullanici.user.id + ".kayitlar")) kb.set(kullanici.user.id + ".kayitlar", [])
    kb.push(kullanici.user.id + ".kayitlar", { isim: isim, yas: yas, cinsiyet: "Erkek" })
    var tarih = new Date();
    var gercek_tarih = tarih.getDate() + "/" + tarih.getMonth() + "/" + tarih.getFullYear() + " " + tarih.getHours() + "." + tarih.getMinutes()
    kb.set(kullanici.user.id + ".tarih", gercek_tarih)

    let toplam_kayit = (Number(kl.get(message.author.id + ".erkek")) + Number(kl.get(message.author.id + ".kadin")))

    var rol_mesaji = ""
    if (typeof e1 !== "undefined") rol_mesaji += `<@&${e1.id}>, `
    if (typeof e2 !== "undefined") rol_mesaji += `<@&${e2.id}>, `
    if (typeof e3 !== "undefined") rol_mesaji += `<@&${e3.id}>, `
    var mesaj;
    var isimler = kb.get(kullanici.user.id + ".kayitlar")
    if (isimler.length > 1) {
      var kullanici_isimleri = ""
      isimler.forEach(ism => {
        kullanici_isimleri += `\`${ism["isim"]} ${ism["yas"]}, ${ism["cinsiyet"]}\`\n`
      })
      mesaj = {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL()
        },
        color: 0x183fa1,
        description: `• <@${kullanici.user.id}> adlı kullanıcıya **${rol_mesaji}**rolleri verildi. \n • Yeni ismi \`${tag} ${isim} | ${yas}\` olarak güncellendi. \n\nKullanıcının veritabanında \`${isimler.length}\` adet kayıt bulunuyor. Bunlar: \n${kullanici_isimleri}`,
        footer: {
          text: `Toplam ${toplam_kayit} kaydın var!`
        }
      };
    } else {
      mesaj = {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL()
        },
        color: 0x183fa1,
        description: `• <@${kullanici.user.id}> adlı kullanıcıya **${rol_mesaji}**rolleri verildi. \n • Yeni ismi \`${tag} ${isim} | ${yas}\` olarak güncellendi. `,
        footer: {
          text: `Toplam ${toplam_kayit} kaydın var!`
        }
      };
    }
    if (typeof register !== "undefined") register.send({ embed: mesaj })
    if (typeof onay !== "undefined") message.react(onay)

    const sohbet_mesaji = `<@${kullanici.user.id}> Aramıza hoş geldin! Umarım iyi vakit geçirirsin.`
    if (typeof sohbet !== "undefined") sohbet.send(sohbet_mesaji)

    try {
      if (typeof e1 !== "undefined") if (!kullanici.roles.cache.get(ayarlar.erkek_1)) await kullanici.roles.add(e1)

      if (typeof kayitsiz1 !== "undefined") if (kullanici.roles.cache.get(ayarlar.kayitsiz_1)) kullanici.roles.remove(kayitsiz1)

      if (typeof yenihesap !== "undefined") if (kullanici.roles.cache.get(ayarlar.yeni_hesap)) kullanici.roles.remove(yenihesap)

      if (typeof k1 !== "undefined") if (kullanici.roles.cache.get(ayarlar.kadin_1)) kullanici.roles.remove(k1)
      if (typeof e1 !== "undefined") if (!kullanici.roles.cache.get(ayarlar.erkek_1)) kullanici.roles.add(e1)

      if (typeof kayitsiz1 !== "undefined") if (kullanici.roles.cache.get(ayarlar.kayitsiz_1)) kullanici.roles.remove(kayitsiz1)

      if (typeof yenihesap !== "undefined") if (kullanici.roles.cache.get(ayarlar.yeni_hesap)) kullanici.roles.remove(yenihesap)

      if (typeof k1 !== "undefined") if (kullanici.roles.cache.get(ayarlar.kadin_1)) kullanici.roles.remove(k1)
    } catch { }
    // LOG
    const logmesaji = {
      thumbnail: {
        url: message.author.avatarURL(),
      },
      color: 0x2f3136,
      title: "Cafune Kayıt",
      description: `• Kayıt Eden: <@${message.author.id}>
      • Kayıt Edilen: <@${kullanici.user.id}>
      • Verilen Roller: ${rol_mesaji}
      • Yeni İsim: \`${tag} ${isim} | ${yas}\` 
      • Kayıt Edilen Kanal: ${message.channel.name}`,
      footer: {
        text: "Cafune 💖"
      }
    }
    if (typeof kayitlog !== "undefined") kayitlog.send({ embed: logmesaji })
  }
}
