import { Injector, Logger, common, webpack } from "replugged";

const { users } = common;
const inject = new Injector();
const logger = Logger.plugin("UerPFP");

let cache = {
  avatars: {},
  badges: {},
};

const getAvatar = webpack.getByProps("getUserAvatarSource");

export async function start(): Promise<void> {
  const data = await fetch(`https://userpfp.github.io/UserPFP/source/data.json`);
  if (data.ok) cache = await data.json();

  inject.after(users, "getUser", (args, res) => {
    const profiles = cache.avatars[res?.id];

    const avatar = res?.avatar ?? "0";
    if (profiles) {
      res.avatar = profiles ?? avatar;
    }
  });

  inject.after(getAvatar, "getUserAvatarURL", ([{ id }], res) => {    
    addAvatar(id);
  });

  inject.after(getAvatar, "getUserAvatarSource", ([{ id }], res) => {
    const custom = addAvatar(id);
    if (!custom) return;

    return custom ? { uri : custom } : res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

function addAvatar(id: string) {
  if (!cache.avatars[id]) return;

  const avatars = cache.avatars[id];

  const url = new URL(avatars);
  return url.toString();
}
