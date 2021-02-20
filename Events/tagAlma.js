const { client } = require('../index');
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

client.on('userUpdate', async (oldUser, newUser) => {
    // TAG KONTROL
    let tag = ayarlar.tag;
    if (!tag) return;
    oldMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(oldUser.id)
    newMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(newUser.id)
    if(!oldMember || !newMember) return;
    if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
        // Değişken ayarlama
        var tagrolu, taglog;
        // TAG ROLU KONTROL
        if (ayarlar.tag_rolu != "") {
            try {
                tagrolu = newMember.guild.roles.cache.get(ayarlar.tag_rolu);
                if (tagrolu == undefined) throw tagrolu;
            } catch {
                console.log("DIKKAT: " + ayarlar.tag_rolu + "ID'li bir rol yok. (tag_rolu)")
            }
        }
        if (ayarlar.tag_log_kanali != "") {
            try {
                taglog = newMember.guild.channels.cache.get(ayarlar.tag_log_kanali);
                if (taglog == undefined) throw taglog;
            } catch {
                console.log("DIKKAT: " + ayarlar.tag_log_kanali + "ID'li bir kanal yok. (tag_log_kanali)")
            }
        }
        if (ayarlar.tag_rolu) if (typeof tagrolu !== "undefined") await newMember.roles.add(tagrolu)
        const mesaj = {
            color: "GREEN",
            description: `<@${newMember.id}> adlı kişi, ${tag} tagını aldığından dolayı <@&${tagrolu.id}> rolünü kazandı.`,
            timestamp: new Date()
        }
        if (ayarlar.tag_log_kanali) if (typeof taglog !== "undefined") return taglog.send({ embed: mesaj })
    }
})

module.exports = {
    name: "Tag Alma",
    description: "Tag alma kontrol.",
    enabled: true
}
