const Discord = require("discord.js");
const { client } = require('../index');
const ayarlar = require("../ayarlar.json");

client.on("message", async message => {
	if(message.content == "tag" || message.content == "!tag" || message.content == ".tag" || message.content == "c!tag") return message.channel.send(ayarlar.tag)
	if (message.author.bot) return;
	var logkanali;
	if (ayarlar.dm_log_kanali != "") {
		try {
			logkanali = client.guilds.cache.get(ayarlar.sunucu_id).channels.cache.get(ayarlar.dm_log_kanali);
			if (logkanali == undefined) throw logkanali;
		} catch {
			console.log("DIKKAT: " + ayarlar.dm_log_kanali + " ID'li bir kanal yok. (dm_log_kanali)")
		}
	}
	if (message.channel.type === "dm" && typeof logkanali !== "undefined") {
		const clientdm = new Discord.MessageEmbed()
			.setTitle(`${client.user.username} DM`)
			.setTimestamp()
			.setColor("RANDOM")
			.setThumbnail(message.author.avatarURL())
			.addField("Gönderen Kişi", message.author.tag)
			.addField("Gönderen ID", message.author.id)
			.addField("Gönderilen Mesaj", message.content);
			logkanali.send(clientdm);
	}
	if (message.channel.type === 'dm') return;
	var prefix = ayarlar.prefix
	if (message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		let perms = client.permHesapla(message);
		if (client.commands.has(command)) {
			cmd = client.commands.get(command)
		} else {
			cmd = client.commands.get(client.aliases.get(command));
		}

		if (cmd) {
			if (cmd.enabled === false) {
				if (!ayarlar.sahip.includes(message.author.id) && !ayarlar.sahip.includes(message.author.id)) {
					message.channel.send(`:x: **${cmd.name}** isimli komut şuanda geçici olarak kullanıma kapalıdır!`)
					return
				}
			}

			if (cmd.permLevel === 1) {
				if (!message.member.hasPermission("MANAGE_MESSAGES")) {
					const embed = new Discord.MessageEmbed()
						.setDescription(`Bu komutu kullanabilmek için **Mesajları Yönet** iznine sahip olmalısın!`)
						.setColor("RED")
					message.channel.send({ embed })
					return
				}
			}
			if (cmd.permLevel === 2) {
				if (!message.member.hasPermission("KICK_MEMBERS")) {
					const embed = new Discord.MessageEmbed()
						.setDescription(`Bu komutu kullanabilmek için **Üyeleri At** iznine sahip olmalısın!`)
						.setColor("RED")
					message.channel.send({ embed })
					return
				}
			}
			if (cmd.permLevel === 3) {
				if (!message.member.hasPermission("BAN_MEMBERS")) {
					const embed = new Discord.MessageEmbed()
						.setDescription(`Bu komutu kullanabilmek için **Üyeleri Yasakla** iznine sahip olmalısın!`)
						.setColor("RED")
					message.channel.send({ embed })
					return
				}
			}
			if (cmd.permLevel === 4) {
				if (!message.member.hasPermission("ADMINISTRATOR")) {
					const embed = new Discord.MessageEmbed()
						.setDescription(`Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`)
						.setColor("RED")
					message.channel.send({ embed })
					return
				}
			}
			if (cmd.permLevel === 5) {
				if (!ayarlar.sahip.includes(message.author.id)) {
					const embed = new Discord.MessageEmbed()
						.setDescription(`Bu komutu sadece **sahibim** kullanabilir!`)
						.setColor("RED")
					message.channel.send({ embed })
					return
				}
			}
			if (perms < cmd.permLevel) return;
			try {
				cmd.run(client, message, args);
			} catch {

			}
		}
	}
})

module.exports = {
	name: "onCommand",
	description: "Komut girildiginde.",
	enabled: true
}