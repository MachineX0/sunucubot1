const { client } = require('../index');
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

client.on("guildMemberAdd", async member => {
    // Değişken tanımlama
    var kayitsiz1, kayitsiz2, yenihesap, hosgeldinkanali, kayitlog
    // KAYITSIZ ROL KONTROL
    if (ayarlar.kayitsiz_1 != "") {
        try {
            kayitsiz1 = member.guild.roles.cache.get(ayarlar.kayitsiz_1);
            if (kayitsiz1 == undefined) throw kayitsiz1;
        } catch {
            console.log("DIKKAT: " + ayarlar.kayitsiz_1 + "ID'li bir rol yok. (kayitsiz_1)")
        }
    }
    if (ayarlar.kayitsiz_2 != "") {
        try {
            kayitsiz2 = member.guild.roles.cache.get(ayarlar.kayitsiz_2);
            if (kayitsiz2 == undefined) throw kayitsiz2;
        } catch {
            console.log("DIKKAT: " + ayarlar.kayitsiz_2 + "ID'li bir rol yok. (kayitsiz_2)")
        }
    }
    // YENI UYE ROLU KONTROL
    if (ayarlar.yeni_hesap != "") {
        try {
            yenihesap = member.guild.roles.cache.get(ayarlar.yeni_hesap);
            if (yenihesap == undefined) throw yenihesap;
        } catch {
            console.log("DIKKAT: " + ayarlar.yeni_hesap + "ID'li bir rol yok. (yeni_hesap)")
        }
    }
    // KAYIT LOG 
    if (ayarlar.kayit_log_kanali != "") {
        try {
            kayitlog = member.guild.channels.cache.get(ayarlar.kayit_log_kanali);
            if (kayitlog == undefined) throw kayitlog;
        } catch {
            console.log("DIKKAT: " + ayarlar.kayit_log_kanali + "ID'li bir kanal yok. (kayit_log_kanali)")
        }
    }
    // HOŞGELDİN KANALI
    if (ayarlar.hosgeldin_kanali != "") {
        try {
            hosgeldinkanali = member.guild.channels.cache.get(ayarlar.hosgeldin_kanali);
            if (hosgeldinkanali == undefined) throw hosgeldinkanali;
        } catch {
            console.log("DIKKAT: " + ayarlar.hosgeldin_kanali + "ID'li bir kanal yok. (hosgeldin_kanali)")
        }
    }
    await member.setNickname(ayarlar.tag + ' İsim | Yaş');
	member.setNickname(ayarlar.tag + ' İsim | Yaş');

    // UYE SAYISI
    var uye_sayisi = member.guild.members.cache.size.toString().replace(/ /g, "    ")

    // ROL VERME

    await member.roles.add(kayitsiz1)
    member.roles.add(kayitsiz1)


    let user = member.user
    const olustruma = new Date().getTime() - user.createdAt.getTime();

    var durum_mesaji = "";
    // KULLANICI 15 GÜNLÜK MÜ KONTROL
    if (olustruma < 1296000000) {
        durum_mesaji = ' **Hesap güvenli değil! :x: **'
        if (olustruma < 1296000000 / 2) {
            await member.roles.set([yenihesap])
            member.user.send('Selam dostum! Ne yazık ki sana kötü bir haberim var hesabın `1 hafta` gibi kısa bir süre önce açıldığı için `Fake Hesap` katagorisine giriyorsun! Lütfen bir yetkiliyle iletişime geç, onlar sana yardımcı olacaktır.')
        }
    } else {
        durum_mesaji = ' **Hesap güvenli! :green_heart: **'
    }
    var tarih = new Date(member.user.createdAt)
    var gercek_tarih = tarih.getDate() + "/" + tarih.getMonth() + "/" + tarih.getFullYear() + " " + tarih.getHours() + "." + tarih.getMinutes()
    if (ayarlar.hosgeldin_kanali) {
        if (typeof hosgeldinkanali !== "undefined") {
            await hosgeldinkanali.send("・**Cafuné'ye Hoşgeldin! <@" + user.id + "> Seninle birlikte " + uye_sayisi + " kişiyiz.**  \n\n・**Müsait olduğunda kayıt kanallarından birine geçip kaydını yaptırabilirsin.**  \n\n・**<@&777725160765390899> Rolüne sahip kişiler senin kayıt işlemin ile ilgilenecektirler.**\n\n・**Hesabın " + gercek_tarih + " tarihinde açılmış.** \n\n・**Hesap Durumu:** " + durum_mesaji + "   \n\n・**Tagımızı alarak ` ✦ ` Ailemize katılabilirsin, Ayrıca ` tag ` yazarak tagımıza ulaşabilirsin** \n\n", new Discord.MessageAttachment("https://cdn.discordapp.com/attachments/787990688972275763/788084273797136434/uuu.gif"));
        }
    } else {
        console.log("Hosgeldin kanal ID'si girilmemis.")
    }

    // TAG KONTROL
    let tag = ayarlar.tag;
    if (tag == "") tag = "tagyokxsdasdasdas";
    if (member.user.username.includes(tag)) {
        // Değişken ayarlama
        var tagrolu, taglog;
        // TAG ROLU KONTROL
        if (ayarlar.tag_rolu != "") {
            try {
                tagrolu = member.guild.roles.cache.get(ayarlar.tag_rolu);
                if (tagrolu == undefined) throw tagrolu;
            } catch {
                console.log("DIKKAT: " + ayarlar.tag_rolu + "ID'li bir rol yok. (tag_rolu)")
            }
        }
        if (ayarlar.tag_log_kanali != "") {
            try {
                taglog = member.guild.channels.cache.get(ayarlar.tag_log_kanali);
                if (taglog == undefined) throw taglog;
            } catch {
                console.log("DIKKAT: " + ayarlar.tag_log_kanali + "ID'li bir kanal yok. (tag_log_kanali)")
            }
        }
        if (ayarlar.tag_rolu) if (typeof tagrolu !== "undefined") await member.roles.add(tagrolu)
        const mesaj = {
            color: "GREEN",
            description: `<@${member.id}> adlı kişi, sunucumuza **TAGLI olarak** katıldı! ${tag} tagını aldığından dolayı <@&${tagrolu.id}> rolünü kazandı.`,
            timestamp: new Date()
        }
        if (ayarlar.tag_log_kanali) if (typeof taglog !== "undefined") taglog.send({ embed: mesaj })
    }
    // YASAKLI TAG KONTROL
    const yasaklilar = ayarlar.yasakli_taglar
    var yasaklirolu, ylog
    // YASAKLI ROLU VAR MI YOK MU
    if (ayarlar.yasakli_rolu != "") {
        try {
            yasaklirolu = member.guild.roles.cache.get(ayarlar.yasakli_rolu);
            if (yasaklirolu == undefined) throw yasaklirolu;
        } catch {
            console.log("DIKKAT: " + ayarlar.yasakli_rolu + "ID'li bir rol yok. (yasakli_rolu)")
        }
    }
    // YASAKLI LOG
    if (ayarlar.yasakli_tag_log_kanali != "") {
        try {
            ylog = member.guild.channels.cache.get(ayarlar.yasakli_tag_log_kanali);
            if (ylog == undefined) throw ylog;
        } catch {
            console.log("DIKKAT: " + ayarlar.yasakli_tag_log_kanali + "ID'li bir kanal yok. (yasakli_tag_log_kanali)")
        }
    }
    yasaklilar.forEach(tag => {
        if (member.user.username.includes(tag)) {
            if (typeof yasaklirolu !== undefined) {
                member.roles.set([yasaklirolu])
            } else {
                member.roles.set([])
            }
            member.send("Sunucumuzda yasaklı olan bir tagda bulunuyorsunuz! :black_heart: (\`" + tag + "\`)")
            if (typeof ylog !== "undefined") ylog.send(`Cafune Yasaklı Rol Koruması\n<@${member.id}> adlı kullanıcı \`${tag}\` tagında yakalandı, tüm yetkileri alındı.`)
        }
    })
});

module.exports = {
    name: "Otomatik Rol",
    description: "Otomatik rol atama.",
    enabled: true
}
