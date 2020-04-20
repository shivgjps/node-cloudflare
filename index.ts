import { Merge } from 'type-fest';
import got, { Got, GotReturn, Options, BeforeRequestHook } from 'got';

const authenticationHeadersFromContext: BeforeRequestHook = options => {
  options.headers.Authentication = `Bearer ${options.context.auth.token}`
}

export default class Client {
  private client: Got;

  // TODO: create types for different authentication methods
  constructor(auth: Record<string, any>) {
    this.client = got.extend({
      prefixUrl: 'https://api.cloudflare.com/client/v4/',
      headers: {
        'user-agent': `cloudflare/3.0.0-dev node/${process.versions.node}`
      },
      timeout: 10*1000,
      retry: 2,
      // TODO: context isn't merged by got.mergeOptions, so this can be annoying for users.
      context: {
        auth: auth,
      },
      hooks: {
        beforeRequest: [
          authenticationHeadersFromContext,
        ],
      },
    })
  }

  // TODO: Allow the correct types for stream/responseTypes? Or is that too complex?
  IPs(options?: Merge<Options, {isStream?: false; resolveBodyOnly?: false; responseType?: 'default'}>) : GotReturn {
    return this.client.get('ips', options)
  }
}
