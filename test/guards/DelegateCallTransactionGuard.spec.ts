import { expect } from "chai";
import hre from "hardhat";
import { AddressZero } from "@ethersproject/constants";
import { getContractFactoryByName, getSafeWithOwners, getWallets } from "../utils/setup";
import { buildContractCall, executeContractCallWithSigners } from "../../src/utils/execution";
import { AddressOne } from "../../src/utils/constants";
import { DelegateCallTransactionGuard__factory } from "../../typechain-types";

describe("DelegateCallTransactionGuard", () => {
    const setupTests = hre.deployments.createFixture(async ({ deployments }) => {
        await deployments.fixture();
        const signers = await getWallets();
        const [user1] = signers;
        const safe = await getSafeWithOwners([user1.address]);
        const guardFactory = (await getContractFactoryByName("DelegateCallTransactionGuard")) as DelegateCallTransactionGuard__factory;
        const guard = await guardFactory.deploy(AddressZero);
        const guardAddress = await guard.getAddress();
        await (await executeContractCallWithSigners(safe, safe, "setGuard", [guardAddress], [user1])).wait();
        return {
            safe,
            guardFactory,
            guard,
            signers,
        };
    });

    describe("fallback", () => {
        it("must NOT revert on fallback without value", async () => {
            const {
                guard,
                signers: [user1],
            } = await setupTests();
            const guardAddress = await guard.getAddress();
            await user1.sendTransaction({
                to: guardAddress,
                data: "0xbaddad",
            });
        });
        it("should revert on fallback with value", async () => {
            const {
                guard,
                signers: [user1],
            } = await setupTests();
            const guardAddress = await guard.getAddress();
            await expect(
                user1.sendTransaction({
                    to: guardAddress,
                    data: "0xbaddad",
                    value: 1,
                }),
            ).to.be.reverted;
        });
    });

    describe("checkTransaction", () => {
        it("should revert delegate call", async () => {
            const {
                safe,
                guard,
                signers: [user1],
            } = await setupTests();
            const tx = await buildContractCall(safe, "setGuard", [AddressZero], 0, true);
            await expect(
                guard.checkTransaction(
                    tx.to,
                    tx.value,
                    tx.data,
                    tx.operation,
                    tx.safeTxGas,
                    tx.baseGas,
                    tx.gasPrice,
                    tx.gasToken,
                    tx.refundReceiver,
                    "0x",
                    user1.address,
                ),
            ).to.be.revertedWith("This call is restricted");
        });

        it("must NOT revert normal call", async () => {
            const {
                safe,
                guard,
                signers: [user1],
            } = await setupTests();
            const tx = await buildContractCall(safe, "setGuard", [AddressZero], 0);
            await guard.checkTransaction(
                tx.to,
                tx.value,
                tx.data,
                tx.operation,
                tx.safeTxGas,
                tx.baseGas,
                tx.gasPrice,
                tx.gasToken,
                tx.refundReceiver,
                "0x",
                user1.address,
            );
        });

        it("should revert on delegate call via Safe", async () => {
            const {
                safe,
                signers: [user1],
            } = await setupTests();
            await expect(executeContractCallWithSigners(safe, safe, "setGuard", [AddressZero], [user1], true)).to.be.revertedWith(
                "This call is restricted",
            );

            await executeContractCallWithSigners(safe, safe, "setGuard", [AddressZero], [user1]);
        });

        it("can set allowed target via Safe", async () => {
            const {
                safe,
                guardFactory,
                signers: [user1],
            } = await setupTests();
            const guard = await guardFactory.deploy(AddressOne);
            const guardAddress = await guard.getAddress();
            await (await executeContractCallWithSigners(safe, safe, "setGuard", [guardAddress], [user1])).wait();

            expect(await guard.ALLOWED_TARGET()).to.be.eq(AddressOne);
            const allowedTarget = safe.attach(AddressOne);
            await expect(executeContractCallWithSigners(safe, safe, "setFallbackHandler", [AddressZero], [user1], true)).to.be.revertedWith(
                "This call is restricted",
            );

            await executeContractCallWithSigners(safe, allowedTarget, "setFallbackHandler", [AddressZero], [user1], true);
        });
    });
});
