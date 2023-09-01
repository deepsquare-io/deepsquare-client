export const IProviderManagerAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "HardwareUpdatedEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ProviderStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "ProviderStatusChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "approve",
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
    ],
    name: "ban",
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
    ],
    name: "getJobCount",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
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
    name: "getLabels",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "key",
            type: "string",
          },
          {
            internalType: "string",
            name: "value",
            type: "string",
          },
        ],
        internalType: "struct Label[]",
        name: "",
        type: "tuple[]",
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
    name: "getProvider",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "walletAddr",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "nodes",
                type: "uint64",
              },
              {
                internalType: "uint64[]",
                name: "gpusPerNode",
                type: "uint64[]",
              },
              {
                internalType: "uint64[]",
                name: "cpusPerNode",
                type: "uint64[]",
              },
              {
                internalType: "uint64[]",
                name: "memPerNode",
                type: "uint64[]",
              },
            ],
            internalType: "struct ProviderHardware",
            name: "providerHardware",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "gpuPricePerMin",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cpuPricePerMin",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "memPricePerMin",
                type: "uint256",
              },
            ],
            internalType: "struct ProviderPrices",
            name: "providerPrices",
            type: "tuple",
          },
          {
            internalType: "enum ProviderStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint64",
            name: "jobCount",
            type: "uint64",
          },
          {
            components: [
              {
                internalType: "string",
                name: "key",
                type: "string",
              },
              {
                internalType: "string",
                name: "value",
                type: "string",
              },
            ],
            internalType: "struct Label[]",
            name: "labels",
            type: "tuple[]",
          },
          {
            internalType: "bool",
            name: "linkListed",
            type: "bool",
          },
        ],
        internalType: "struct Provider",
        name: "",
        type: "tuple",
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
    name: "getProviderHardware",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "nodes",
            type: "uint64",
          },
          {
            internalType: "uint64[]",
            name: "gpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "cpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "memPerNode",
            type: "uint64[]",
          },
        ],
        internalType: "struct ProviderHardware",
        name: "",
        type: "tuple",
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
    name: "getProviderPrices",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "gpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memPricePerMin",
            type: "uint256",
          },
        ],
        internalType: "struct ProviderPrices",
        name: "",
        type: "tuple",
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
    name: "getProviderStatus",
    outputs: [
      {
        internalType: "enum ProviderStatus",
        name: "_status",
        type: "uint8",
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
    name: "hasJoined",
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
    name: "incJobCount",
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
    ],
    name: "kick",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "nodes",
            type: "uint64",
          },
          {
            internalType: "uint64[]",
            name: "gpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "cpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "memPerNode",
            type: "uint64[]",
          },
        ],
        internalType: "struct ProviderHardware",
        name: "_hardware",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "gpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memPricePerMin",
            type: "uint256",
          },
        ],
        internalType: "struct ProviderPrices",
        name: "_prices",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "key",
            type: "string",
          },
          {
            internalType: "string",
            name: "value",
            type: "string",
          },
        ],
        internalType: "struct Label[]",
        name: "_labels",
        type: "tuple[]",
      },
    ],
    name: "register",
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
        components: [
          {
            internalType: "uint64",
            name: "nodes",
            type: "uint64",
          },
          {
            internalType: "uint64[]",
            name: "gpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "cpusPerNode",
            type: "uint64[]",
          },
          {
            internalType: "uint64[]",
            name: "memPerNode",
            type: "uint64[]",
          },
        ],
        internalType: "struct ProviderHardware",
        name: "_hardware",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "gpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cpuPricePerMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memPricePerMin",
            type: "uint256",
          },
        ],
        internalType: "struct ProviderPrices",
        name: "_prices",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "key",
            type: "string",
          },
          {
            internalType: "string",
            name: "value",
            type: "string",
          },
        ],
        internalType: "struct Label[]",
        name: "_labels",
        type: "tuple[]",
      },
    ],
    name: "registerProvider",
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
    ],
    name: "reinstate",
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
    ],
    name: "removeProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
