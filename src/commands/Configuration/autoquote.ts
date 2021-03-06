import { FireMessage } from "@fire/lib/extensions/message";
import { Language } from "@fire/lib/util/language";
import { Command } from "@fire/lib/util/command";

export default class AutoQuote extends Command {
  constructor() {
    super("autoquote", {
      description: (language: Language) =>
        language.get("AUTOQUOTE_COMMAND_DESCRIPTION"),
      userPermissions: ["MANAGE_MESSAGES"],
      enableSlashCommand: true,
      restrictTo: "guild",
    });
  }

  async exec(message: FireMessage) {
    const current: boolean = message.guild.settings.get(
      "utils.autoquote",
      false
    );
    message.guild.settings.set("utils.autoquote", !current);
    return await message.success(
      !current ? "AUTOQUOTE_ENABLED" : "AUTOQUOTE_DISABLED"
    );
  }
}
