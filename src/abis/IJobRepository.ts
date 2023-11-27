export const IJobRepositoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "JobCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum JobStatus",
        name: "_from",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum JobStatus",
        name: "_to",
        type: "uint8",
      },
    ],
    name: "JobTransitionEvent",
    type: "event",
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
                name: "gpus",
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
                name: "submit",
                type: "uint256",
              },
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
          {
            internalType: "int64",
            name: "exitCode",
            type: "int64",
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
                name: "gpus",
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
                name: "submit",
                type: "uint256",
              },
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
          {
            internalType: "int64",
            name: "exitCode",
            type: "int64",
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
            name: "gpus",
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
        internalType: "int64",
        name: "_exitCode",
        type: "int64",
      },
    ],
    name: "setExitCode",
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
            name: "submit",
            type: "uint256",
          },
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
                name: "gpus",
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
                name: "submit",
                type: "uint256",
              },
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
          {
            internalType: "int64",
            name: "exitCode",
            type: "int64",
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
