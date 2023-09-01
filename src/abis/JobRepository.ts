export const JobRepositoryAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidJob",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "METASCHEDULER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "jobId",
            type: "bytes32",
          },
          {
            internalType: "enum JobStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "customerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "providerAddr",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "gpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "memPerCpu",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "ntasks",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "batchLocationHash",
                type: "string",
              },
              {
                internalType: "enum StorageType",
                name: "storageType",
                type: "uint8",
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
                name: "uses",
                type: "tuple[]",
              },
              {
                components: [
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
                    internalType: "struct Label",
                    name: "label",
                    type: "tuple",
                  },
                  {
                    internalType: "bytes2",
                    name: "op",
                    type: "bytes2",
                  },
                ],
                internalType: "struct Affinity[]",
                name: "affinity",
                type: "tuple[]",
              },
            ],
            internalType: "struct JobDefinition",
            name: "definition",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "maxCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "finalCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "pendingTopUp",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "delegateSpendingAuthority",
                type: "bool",
              },
            ],
            internalType: "struct JobCost",
            name: "cost",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "start",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "end",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cancelRequestTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "blockNumberStateChange",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "panicTimestamp",
                type: "uint256",
              },
            ],
            internalType: "struct JobTime",
            name: "time",
            type: "tuple",
          },
          {
            internalType: "bytes32",
            name: "jobName",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "hasCancelRequest",
            type: "bool",
          },
          {
            internalType: "string",
            name: "lastError",
            type: "string",
          },
        ],
        internalType: "struct Job",
        name: "_job",
        type: "tuple",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "get",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "jobId",
            type: "bytes32",
          },
          {
            internalType: "enum JobStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "customerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "providerAddr",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "gpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "memPerCpu",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "ntasks",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "batchLocationHash",
                type: "string",
              },
              {
                internalType: "enum StorageType",
                name: "storageType",
                type: "uint8",
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
                name: "uses",
                type: "tuple[]",
              },
              {
                components: [
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
                    internalType: "struct Label",
                    name: "label",
                    type: "tuple",
                  },
                  {
                    internalType: "bytes2",
                    name: "op",
                    type: "bytes2",
                  },
                ],
                internalType: "struct Affinity[]",
                name: "affinity",
                type: "tuple[]",
              },
            ],
            internalType: "struct JobDefinition",
            name: "definition",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "maxCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "finalCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "pendingTopUp",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "delegateSpendingAuthority",
                type: "bool",
              },
            ],
            internalType: "struct JobCost",
            name: "cost",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "start",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "end",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cancelRequestTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "blockNumberStateChange",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "panicTimestamp",
                type: "uint256",
              },
            ],
            internalType: "struct JobTime",
            name: "time",
            type: "tuple",
          },
          {
            internalType: "bytes32",
            name: "jobName",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "hasCancelRequest",
            type: "bool",
          },
          {
            internalType: "string",
            name: "lastError",
            type: "string",
          },
        ],
        internalType: "struct Job",
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
        name: "customerAddr",
        type: "address",
      },
    ],
    name: "getByCustomer",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "jobIdByCustomer",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "jobIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "jobs",
    outputs: [
      {
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
      {
        internalType: "enum JobStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "customerAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "providerAddr",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "gpusPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "memPerCpu",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "cpusPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "ntasks",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "batchLocationHash",
            type: "string",
          },
          {
            internalType: "enum StorageType",
            name: "storageType",
            type: "uint8",
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
            name: "uses",
            type: "tuple[]",
          },
          {
            components: [
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
                internalType: "struct Label",
                name: "label",
                type: "tuple",
              },
              {
                internalType: "bytes2",
                name: "op",
                type: "bytes2",
              },
            ],
            internalType: "struct Affinity[]",
            name: "affinity",
            type: "tuple[]",
          },
        ],
        internalType: "struct JobDefinition",
        name: "definition",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "maxCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingTopUp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "delegateSpendingAuthority",
            type: "bool",
          },
        ],
        internalType: "struct JobCost",
        name: "cost",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cancelRequestTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "blockNumberStateChange",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "panicTimestamp",
            type: "uint256",
          },
        ],
        internalType: "struct JobTime",
        name: "time",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "jobName",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "hasCancelRequest",
        type: "bool",
      },
      {
        internalType: "string",
        name: "lastError",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "maxCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingTopUp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "delegateSpendingAuthority",
            type: "bool",
          },
        ],
        internalType: "struct JobCost",
        name: "_cost",
        type: "tuple",
      },
    ],
    name: "setCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_customerAddr",
        type: "address",
      },
    ],
    name: "setCustomerAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "gpusPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "memPerCpu",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "cpusPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "ntasks",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "batchLocationHash",
            type: "string",
          },
          {
            internalType: "enum StorageType",
            name: "storageType",
            type: "uint8",
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
            name: "uses",
            type: "tuple[]",
          },
          {
            components: [
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
                internalType: "struct Label",
                name: "label",
                type: "tuple",
              },
              {
                internalType: "bytes2",
                name: "op",
                type: "bytes2",
              },
            ],
            internalType: "struct Affinity[]",
            name: "affinity",
            type: "tuple[]",
          },
        ],
        internalType: "struct JobDefinition",
        name: "_definition",
        type: "tuple",
      },
    ],
    name: "setDefinition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "_hasCancelRequest",
        type: "bool",
      },
    ],
    name: "setHasCancelRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_jobName",
        type: "bytes32",
      },
    ],
    name: "setJobName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "enum JobStatus",
        name: "_newStatus",
        type: "uint8",
      },
    ],
    name: "setJobStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_error",
        type: "string",
      },
    ],
    name: "setLastError",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "setProviderAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cancelRequestTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "blockNumberStateChange",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "panicTimestamp",
            type: "uint256",
          },
        ],
        internalType: "struct JobTime",
        name: "_time",
        type: "tuple",
      },
    ],
    name: "setTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        components: [
          {
            internalType: "bytes32",
            name: "jobId",
            type: "bytes32",
          },
          {
            internalType: "enum JobStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "customerAddr",
            type: "address",
          },
          {
            internalType: "address",
            name: "providerAddr",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "gpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "memPerCpu",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cpusPerTask",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "ntasks",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "batchLocationHash",
                type: "string",
              },
              {
                internalType: "enum StorageType",
                name: "storageType",
                type: "uint8",
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
                name: "uses",
                type: "tuple[]",
              },
              {
                components: [
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
                    internalType: "struct Label",
                    name: "label",
                    type: "tuple",
                  },
                  {
                    internalType: "bytes2",
                    name: "op",
                    type: "bytes2",
                  },
                ],
                internalType: "struct Affinity[]",
                name: "affinity",
                type: "tuple[]",
              },
            ],
            internalType: "struct JobDefinition",
            name: "definition",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "maxCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "finalCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "pendingTopUp",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "delegateSpendingAuthority",
                type: "bool",
              },
            ],
            internalType: "struct JobCost",
            name: "cost",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "start",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "end",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cancelRequestTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "blockNumberStateChange",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "panicTimestamp",
                type: "uint256",
              },
            ],
            internalType: "struct JobTime",
            name: "time",
            type: "tuple",
          },
          {
            internalType: "bytes32",
            name: "jobName",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "hasCancelRequest",
            type: "bool",
          },
          {
            internalType: "string",
            name: "lastError",
            type: "string",
          },
        ],
        internalType: "struct Job",
        name: "_job",
        type: "tuple",
      },
    ],
    name: "update",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
