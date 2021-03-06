import { Listener } from "@fire/lib/util/listener";

export default class RateLimit extends Listener {
  constructor() {
    super("rateLimit", {
      emitter: "client",
      event: "rateLimit",
    });
  }

  async exec(rateLimit: {
    timeout: number;
    limit: number;
    method: string;
    path: string;
    route: string;
  }) {
    if (rateLimit.route.includes("/messages/:id/reactions")) return;
    this.client.console.warn(
      `[Rest] Limited on route ${
        rateLimit.route
      } while trying to ${rateLimit.method?.toUpperCase()} with limit ${
        rateLimit.limit
      }, waiting for timeout of ${rateLimit.timeout}ms`
    );
  }
}
