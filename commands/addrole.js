const {
  Client,
  GuildMember,
  Message,
  Constants,
  Permissions,
} = require("discord.js");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  Options,
} = require("discord.js");
const discordjs = require("discord.js");

module.exports = {
  name: "addrole",
  description: "adds a role to the auto role message.",
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,

  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  options: [
    {
      name: "message_link",
      description: "Enter message link",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: "role",
      description: "type a role name to added it on dropdown menu",
      type: Constants.ApplicationCommandOptionTypes.ROLE,
      required: true,
    },
  ],

  async init(client) {
    client.on("interactionCreate", async (Interaction) => {
      if (!Interaction.isSelectMenu()) {
        return;
      }

      const { customId, values, member } = Interaction;

      if (customId === "auto_roles") {
        const component = Interaction.component;
        const removed = component.options.filter((options) => {
          return !values.includes(options.value);
        });

        for (const id of removed) {
          await member.roles.remove(id.value);
        }

        for (const id of values) {
          await member.roles.add(id);
        }

        await Interaction.reply({
          content: "Roles Update!",
          ephemeral: true,
        });
      }
    });
  },

  slash: true,
  async execute({ message, interaction, client }) {
    const link = interaction.options.getString("message_link", true);
    const stuff = link.split("/");
    const messageID = stuff.pop();
    const channelID = stuff.pop();
    const channel = interaction.guild.channels.cache.get(channelID);
    console.log(messageID)

    const role = message
      ? message.mentions.roles.first()
      : interaction.options.getRole("role", true);
    if (!role) {
      return interaction.reply({content : "Unknown role", ephemeral: true})
    }

    const targetMessage = await channel.messages.fetch(messageID, {
      cache: true,
      force: true,
    });

    if (!targetMessage) {
      return interaction.reply({content : "Unknown messages ID.", ephemeral: true});
    }

    if (targetMessage.author.id !== client.user?.id) {
      return interaction.reply ({content : `Please provide a message ID that was sent <@${client.user?.id}>`, ephemeral: true});
    }

    let row = targetMessage.components[0];
    if (!row) {
      row = new MessageActionRow();
    }

    const options = [
      {
        label: role.name,
        value: role.id,
      },
    ];

    let menu = row.components[0];
    if (menu) {
      for (const o of menu.options) {
        if (o.value === options[0].value) {
          return {
            custom: true,
            content: `<@&${o.value}> is already part of this menu.`,
            allowedMentions: {
              roles: [],
            },
            ephemeral: true,
          };
        }
      }

      menu.addOptions(options);
      menu.setMaxValues(menu.options.length);
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId("auto_roles")
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder("select your roles")
          .addOptions(options)
      );
    }

    targetMessage.edit({
      components: [row],
    });

    return {
      custom: true,
      content: `added <@&${role.id}> to the auto roles now.`,
      allowMentions: {
        roles: [],
      },
      ephemeral: true,
    };
  },
};
