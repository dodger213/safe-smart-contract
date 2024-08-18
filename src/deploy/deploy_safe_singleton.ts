import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy } = deployments;

    const safeBytecode = await deploy("SafeBytecode", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: true,
    })

    await deploy("Safe", {
        from: deployer,
        args: [safeBytecode.address],
        log: true,
        deterministicDeployment: true,
    });
};

deploy.tags = ["singleton", "main-suite"];
export default deploy;
