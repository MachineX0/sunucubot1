const Discord = require('discord.js');
const ayarlar = require('./ayarlar.json');

const client = new Discord.Client();

require('./eventHandler.js')(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.permHesapla = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === "sahipID") permlvl = 4;
  return permlvl;
};


module.exports = {
  client: client
};

client.login(ayarlar.token);