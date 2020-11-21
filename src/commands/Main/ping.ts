import { MessageEmbed } from "discord.js";
import { FireMessage } from "../../../lib/extensions/message";
import { Language } from "../../../lib/util/language";
import { Command } from "../../../lib/util/command";

export default class Ping extends Command {
  constructor() {
    super("ping", {
      description: (language: Language) =>
        language.get("PING_COMMAND_DESCRIPTION"),
      clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
      restrictTo: "all",
    });
  }

  async exec(message: FireMessage) {
    let pingMessage: FireMessage;
    if (!message.author.hasExperiment("MYT-k7UJ-XDwqH99A9yw6", 2))
      pingMessage = (await message.send("PING_INITIAL_MESSAGE")) as FireMessage;
    const embed = new MessageEmbed()
      .setTitle(
        `:ping_pong: ${
          pingMessage.createdTimestamp -
          (message.editedAt
            ? message.editedTimestamp || 0
            : message.createdTimestamp)
        }ms.\n:heartpulse: ${
          this.client.ws.shards.get(message.guild ? message.guild.shardID : 0)
            .ping
        }ms.`
      )
      .setColor(message.member?.displayColor || "#ffffff")
      .setFooter(
        message.language.get(
          "PING_FOOTER",
          message.guild ? message.guild.shardID : 0,
          this.client.manager.id
        )
      )
      .setTimestamp(new Date());

    message.author.hasExperiment("MYT-k7UJ-XDwqH99A9yw6", 2)
      ? await this.replyEmbedPing(message, embed)
      : await pingMessage.edit(
          message.language.get("PING_FINAL_MESSAGE"),
          embed
        );
  }

  async replyEmbedPing(message: FireMessage, embed: MessageEmbed) {
    return (
      // @ts-ignore
      this.client.api
        // @ts-ignore
        .channels(message.channel.id)
        .messages.post({
          data: {
            embed: embed.toJSON(),
            message_reference: { message_id: message.id },
            allowed_mentions: this.client.options.allowedMentions,
          },
        })
        .then(
          // @ts-ignore
          (m: object) => this.client.actions.MessageCreate.handle(m).message
        )
        .catch(() => {
          return message.channel.send(embed);
        })
    );
  }
}
