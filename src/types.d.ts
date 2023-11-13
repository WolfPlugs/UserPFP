import { types as DefaultTypes } from "replugged";

export interface ProfileCache {
  avatars: Record<string, string>;
  badges: Record<string, string>;
}

export interface Module extends Record<string, DefaultTypes.AnyFunction> {}
