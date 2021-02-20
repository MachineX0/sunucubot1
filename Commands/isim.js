const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json")

module.exports = {
  enabled: true,
  aliases: ["nick", "nickdeğiş", "isimdeğiştir"],
  name: "isim",
  description: "",

  async run(client, message, args) {
    if (!message.member.roles.cache.some(r => ayarlar.yetkili_id.includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("Bu Komutu Kullanmak İçin Yeterli Yetkin Bulunmamakta !")

    let member = message.mentions.users.first() || client.users.cache.get(args[0])
    if (!member) return message.channel.send("Bir kullanıcı girin.")
    const kullanici = message.guild.member(member)
    args = args.slice(1)
    const yas = args[args.length - 1];
    const isim = args.slice(0,args.length-1).join(" ");
    if(isim.length > 26) return message.channel.send("Lütfen, daha kısa bir isim tercih ediniz.")
    if (!isim) return message.channel.send("Lütfen, bir isim giriniz.")
    if (!yas) return message.channel.send("Lütfen, bir yaş giriniz.")
    if (!Number(yas)) return message.channel.send("Lütfen, geçerli bir yaş giriniz.")

    try {
      kullanici.setNickname(`${ayarlar.tag} ${isim} | ${yas}`)
    } catch {
      console.log("Bir yoneticinin ismini degistirmeye calistim.")
    }
    

    message.channel.send(`• <@${kullanici.user.id}> adlı kullanıcının ismi \`${ayarlar.tag} ${isim} | ${yas}\` olarak değiştirildi.`)

  }
}
