import { DalleEvents } from "../type";
import { Events, Guild, WebhookClient, EmbedBuilder, ActivityType } from 'discord.js';
import { client } from '../index';
import { formatNumbers } from '../utils/numbers';
import axios from 'axios';

const event: DalleEvents = {
  name: Events.GuildDelete,
  once: false,
  async execute(guild: Guild) {
    console.log(`❌ Removed ${guild.name}`);

    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL});
    const embed = new EmbedBuilder()
      .setDescription("``❌`` **Dall·E** has been removed from **" + guild.name + '** (' + guild.memberCount + ' members)')
      .setFooter({ text: guild.id + ' | Now ' + client.guilds.cache.size})
      .setColor('#ED4245')
      .setTimestamp();
      await axios.post(webhookClient.url, {
        embeds: [embed.toJSON()],
      });
    
    webhookClient.destroy();

    let userCount = 0;
    
    client.guilds.cache.forEach((guild) => {
      userCount += guild.memberCount;
    });

    client.user.setPresence({
        activities: [{ name: client.guilds.cache.size.toString() + " servers | " + formatNumbers(userCount) + " users", type: ActivityType.Watching }],
    });
  }
};

export default event;
