export const IProviderJobQueuesAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "getCancellingJobQueueSize",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "getClaimableJobQueueSize",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "getTopUpJobQueueSize",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "hasCancellingJob",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "hasNextClaimableJob",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "hasTopUpJob",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "popNextCancellingJob",
    outputs: [
      {
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "popNextClaimableJob",
    outputs: [
      {
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "popNextTopUpJob",
    outputs: [
      {
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "pushCancellingJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "pushClaimableJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "pushTopUpJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
