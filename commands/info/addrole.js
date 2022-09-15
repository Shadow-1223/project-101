const { Constants, Permissions, MessageActionRow, MessageSelectMenu, } = require("discord.js");

module.exports = {
  name : "addrole",
  description : "adds a role to the auto role message.",
  type : Constants.ApplicationCommandTypes.CHAT_INPUT,
  requiredRoles : ['985756703087788062' , '986179620640550952'],
  permissions : [Permissions.FLAGS.ADMINISTRATOR],
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
    client.on("interactionCreate", async (interaction) => {
      if (!Interaction.isSelectMenu()) {
        return;
      }

      const { customId, values, member } = interaction;

      if (customId === "auto_roles") {
        const component = interaction.component;
        const removed = component.options.filter((options) => {
          return !values.includes(options.value);
        });

        for (const id of removed) {
          await member.roles.remove(id.value);
        }

        for (const id of values) {
          await member.roles.add(id);
        }

        await interaction.reply({
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
    
    const role = interaction.options.getRole("role", true);
    if (!role) {
      return interaction.deferReply({
          content : "Unknown role", 
          ephemeral: true
      })
    }

    const targetMessage = await channel.messages.fetch(messageID, {
      cache: true,
      force: true,
    });

    if (!targetMessage) {
      return interaction.deferReply({content : "Unknown messages ID.", ephemeral: true});
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
          return interaction.reply({
            content: `<@&${o.value}> is already part of this menu.`,
            allowMentions: {
              roles: [],
            },
            ephemeral: true
          })
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
      components: [row]
    });

    if(interaction) {
        interaction.reply({
          content: `added <@&${role.id}> to the auto roles now.`,
          allowMentions: {
             roles: [],
          },
         ephemeral: true
      })
    }
  },
};
