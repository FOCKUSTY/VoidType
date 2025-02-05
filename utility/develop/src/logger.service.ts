import Logger, { Colors, Configurator } from "fock-logger";
import { join } from "path";

const { config } = new Configurator({ dir: join("../../../") });

export { Colors, Configurator, config };

export default Logger;
