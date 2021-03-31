import "./built-in/run";
// import "./built-in/test";
import "./type-extensions";
import "@nomiclabs/hardhat-ethers";

import path from "path";
import { lazyObject } from "hardhat/plugins";
import { proxyBuilder } from "./proxy-builder";
import { defaultReefNetworkConfig } from "./utils";
import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types/config";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userPath = userConfig.paths?.newPath;

    let newPath: string;
    if (userPath === undefined) {
      newPath = path.join(config.paths.root, "newPath");
    } else {
      if (path.isAbsolute(userPath)) {
        newPath = userPath;
      } else {
        newPath = path.normalize(path.join(config.paths.root, userPath));
      }
    }
    config.paths.newPath = newPath;
  }
);

// Configure Reef Network Parameters
extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userReefNetwork = userConfig.networks?.reef;
    const reefNetworkConfig = userReefNetwork
      ? userReefNetwork
      : defaultReefNetworkConfig();

    config.networks.reef = reefNetworkConfig;
  }
);

// Configure selected running network
extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userNetworkName = userConfig.defaultNetwork
      ? userConfig.defaultNetwork
      : "reef";
   
    config.defaultNetwork = userNetworkName;
  }
);

// Extend proxyBuilder on reef object
extendEnvironment((hre) => {
  hre.reef = lazyObject(() => proxyBuilder(hre.config.defaultNetwork, hre));
});
