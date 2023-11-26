import { Injector, Logger, common, webpack } from "replugged";
import { Module, ProfileCache } from "./types";

const { users } = common;
const inject = new Injector();
const logger = Logger.plugin("UserPFP");
const staticGif = (url: string): string => `https://static-gif.nexpid.workers.dev/convert.gif?url=${encodeURIComponent(url)}`;

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
      res.avatar = avatar;
    }
  });

  inject.after(getAvatar!, "getUserAvatarURL", (args, res) => {
    const user = addAvatar(args[0]?.id, !args[1]);
    if (!user) return;

    return user || res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

function addAvatar(id: string, isStatic?: boolean): string | undefined {
  if (!cache.avatars[id]) return;

  const avatars = cache.avatars[id];
  if (isStatic) return staticGif(avatars);

  const url = new URL(avatars);
  return url.toString();
}
