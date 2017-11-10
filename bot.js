// Load up the discord.js library
const Discord = require("discord.js");

// Load and config logger
const logger = require('winston');

logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {colorize: true});

logger.level = 'debug';

// Load bot
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./auth.json");

// Bot ready status
client.on("ready", () => {
  logger.info('Bot has started');
  // This event will run if the bot starts, and logs in, successfully.
  logger.info(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  //client.user.setGame(`on ${client.guilds.size} servers`);
  client.user.setGame('v0.1');
});

// Bot message listener
client.on("message", async message => {
  
  // This ignores the message if sender is a bot
  if(message.author.bot) return;
  
  // Check for prefix
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  switch(command){
      case 'ping':
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
      break;
      case 'credits':
        message.channel.send('This bot was created by kassarin#2441');
      break;
      case 'exit':
        message.channel.send('Sending bye bye... :wave:');
        client.destroy();
        logger.info('Disconnected');
      break;
      case 'uptime':
        var timeUp = (client.uptime/60)/60;
        var timeUpD = timeUp%1;
        timeUp -= timeUpD;
        message.channel.send('Wondershard has been up for '+timeUp+' second(s)');
      break;
      default:
        message.channel.send('Error, please enter a keyword');
        
  }
  
});

client.login(config.token);