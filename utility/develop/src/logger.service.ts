import { Configurator } from "fock-logger"

const { config } = new Configurator({ dir: "../../../" });

import Logger, { Colors } from "fock-logger";

export { Colors, Configurator, config };
export default Logger;