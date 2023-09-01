export const IFaucetAbi = [
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "creditAmount",
        type: "uint256",
      },
    ],
    name: "creditUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
