const { client } = require('../index');
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

client.on('userUpdate', async (oldUser, newUser) => {
    oldMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(oldUser.id)
    newMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(newUser.id)
    if(!oldMember || !newMember) return;
    var tag = ayarlar.tag
    var alinacak_roller = ayarlar.tag_salinca_alinacaklar
    var taglog;
    // TAG LOG KANALI
    if (ayarlar.tag_log_kanali != "") {
        try {
            taglog = newMember.guild.channels.cache.get(ayarlar.tag_log_kanali);
            if (taglog == undefined) throw taglog;
        } catch {
            console.log("DIKKAT: " + ayarlar.tag_log_kanali + "ID'li bir kanal yok. (tag_log_kanali)")
        }
    }
    if (!tag) return console.log("TAG BELIRLENMEMIS!")

    // TAG SILINDIYSE
    if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
        var alinanlar = 0
        alinacak_roller.forEach(async rol => {
            if (newMember.roles.cache.get(rol)) {
                alinanlar += 1
                newMember.roles.remove(rol)
            }
        })
        const mesaj = {
            color: "RED",
            description: `<@${newMember.user.id}> adlı kişi, ${tag} tagını sildiğinden dolayı tag özel rolünü ve ${alinanlar} tane yetkili rolünü aldım.`,
            timestamp: new Date()
        }
        if (ayarlar.tag_log_kanali) if (typeof taglog !== "undefined") return taglog.send({ embed: mesaj })
    }
});

module.exports = {
    name: "Tag Salma",
    description: "Tag salma kontrol.",
    enabled: true
}
