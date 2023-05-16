import { ethers } from "ethers";
import { describe, it } from "vitest";
import DeepSquareClient from ".";

describe("DeepSquareClient", () => {
  it("should initialize", async () => {
    const wallet = ethers.Wallet.createRandom();
    await DeepSquareClient.build(
      wallet._signingKey().privateKey,
      "0x77ae38244e0be7cFfB84da4e5dff077C6449C922"
    );
  });
});
