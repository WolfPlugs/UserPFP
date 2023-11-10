import { Injector, Logger, webpack } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("UerPFP");

export async function start(): Promise<void> {

}

export function stop(): void {
  inject.uninjectAll();
}
