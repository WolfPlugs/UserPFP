import { Injector, Logger, common, webpack } from "replugged";
import { Module, ProfileCache } from "./types";

const { users } = common;
const inject = new Injector();
const logger = Logger.plugin("UserPFP");

let cache: ProfileCache = {
  avatars: {},
  badges: {},
};

const getAvatar = webpack.getByProps<Module>("getUserAvatarSource");

export async function start(): Promise<void> {
  const data = await fetch(`https://userpfp.github.io/UserPFP/source/data.json`);
  if (data.ok) cache = await data.json();

  inject.after(users, "getUser", (_, res) => {
    const profiles = cache.avatars[res?.id];

    const avatar = res?.avatar ?? "0";
    if (profiles) {
      res.avatar = profiles ?? avatar;
    }
  });

  inject.after(getAvatar!, "getUserAvatarURL", ([{ id }], res) => {
    const user = addAvatar(id);
    if (!user) return;

    return user || res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

function addAvatar(id: string): string | undefined {
  if (!cache.avatars[id]) return;

  const avatars = cache.avatars[id];

  const url = new URL(avatars);
  return url.toString();
}
