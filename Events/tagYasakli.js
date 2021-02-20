const { client } = require('../index');
const ayarlar = require("../ayarlar.json");

client.on('userUpdate', async (oldUser, newUser) => {
    oldMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(oldUser.id)
    newMember = client.guilds.cache.get(ayarlar.sunucu_id).members.cache.get(newUser.id)
    if (!oldMember || !newMember) return;
    // TAG KONTROL
    const yasaklilar = ayarlar.yasakli_taglar
    var yasaklirolu, ylog
    // YASAKLI ROLU VAR MI YOK MU
    if (ayarlar.yasakli_rolu != "") {
        try {
            yasaklirolu = newMember.guild.roles.cache.get(ayarlar.yasakli_rolu);
            if (yasaklirolu == undefined) throw yasaklirolu;
        } catch {
            console.log("DIKKAT: " + ayarlar.yasakli_rolu + "ID'li bir rol yok. (yasakli_rolu)")
        }
    }
    // YASAKLI LOG
    if (ayarlar.yasakli_tag_log_kanali != "") {
        try {
            ylog = newMember.guild.channels.cache.get(ayarlar.yasakli_tag_log_kanali);
            if (ylog == undefined) throw ylog;
        } catch {
            console.log("DIKKAT: " + ayarlar.yasakli_tag_log_kanali + "ID'li bir kanal yok. (yasakli_tag_log_kanali)")
        }
    }
    yasaklilar.forEach(tag => {
        if (newMember.user.username.includes(tag) && !oldMember.user.username.includes(tag)) {
            if (typeof yasaklirolu !== undefined) {
                newMember.roles.set([yasaklirolu])
            } else {
                newMember.roles.set([])
            }
            newMember.send("Sunucumuzda yasaklı olan bir tagda bulunuyorsunuz! :black_heart: (\`" + tag + "\`)")
            if (typeof ylog !== "undefined") ylog.send(`Cafune Yasaklı Rol Koruması\n<@${newMember.user.id}> adlı kullanıcı \`${tag}\` tagında yakalandı, tüm yetkileri alındı.`)
        }
    })
})

module.exports = {
    name: "tagYasakli",
    description: "Yasaklı tagı kontrol",
    enabled: true
}
