import { expect } from "chai";
import hre from "hardhat";
import { AddressZero } from "@ethersproject/constants";
import { getContractFactoryByName, getSafeTemplate, getWallets } from "../utils/setup";

describe("HandlerContext", () => {
    const setup = hre.deployments.createFixture(async ({ deployments }) => {
        await deployments.fixture();
        const TestHandler = await getContractFactoryByName("TestHandler");
        const handler = await TestHandler.deploy();
        const signers = await getWallets();
        return {
            safe: await getSafeTemplate(),
            handler,
            signers,
        };
    });

    it("parses information correctly", async () => {
        const {
            handler,
            signers: [user1, user2],
        } = await setup();
        const handlerAddress = await handler.getAddress();

        const response = await user1.call({
            to: handlerAddress,
            data: handler.interface.encodeFunctionData("dudududu") + user2.address.slice(2),
        });
        expect(handler.interface.decodeFunctionResult("dudududu", response)).to.be.deep.eq([user2.address, user1.address]);
    });

    it("works with the Safe", async () => {
        const {
            safe,
            handler,
            signers: [user1, user2],
        } = await setup();
        const handlerAddress = await handler.getAddress();
        const safeAddress = await safe.getAddress();
        await (await safe.setup([user1.address, user2.address], 1, AddressZero, "0x", handlerAddress, AddressZero, 0, AddressZero)).wait();

        const response = await user1.call({
            to: safeAddress,
            data: handler.interface.encodeFunctionData("dudududu"),
        });

        expect(handler.interface.decodeFunctionResult("dudududu", response)).to.be.deep.eq([user1.address, safeAddress]);
    });
});
