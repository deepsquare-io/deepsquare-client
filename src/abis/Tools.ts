export const ToolsAbi = [
  {
    inputs: [
      {
        internalType: "enum JobStatus",
        name: "from",
        type: "uint8",
      },
      {
        internalType: "enum JobStatus",
        name: "to",
        type: "uint8",
      },
    ],
    name: "InvalidTransition",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum JobStatus",
        name: "current",
        type: "uint8",
      },
    ],
    name: "JobHotStatusOnly",
    type: "error",
  },
  {
    inputs: [],
    name: "SameStatusError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum JobStatus",
        name: "_currentJobStatus",
        type: "JobStatus",
      },
      {
        internalType: "enum JobStatus",
        name: "_nextJobStatus",
        type: "JobStatus",
      },
    ],
    name: "checkNewJobStatus",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
            type: "StorageType",
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
        name: "jobDefinition",
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
        internalType: "uint256",
        name: "amountLocked",
        type: "uint256",
      },
    ],
    name: "convertCreditToDuration",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
            type: "StorageType",
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
        name: "jobDefinition",
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
        internalType: "uint64",
        name: "durationMinute",
        type: "uint64",
      },
    ],
    name: "convertDurationToCredit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
            type: "JobStatus",
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
                type: "StorageType",
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
        name: "job",
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
    ],
    name: "getRemainingTime",
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
        internalType: "enum JobStatus",
        name: "_jobStatus",
        type: "JobStatus",
      },
    ],
    name: "isDelegateTopable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum JobStatus",
        name: "_jobStatus",
        type: "JobStatus",
      },
    ],
    name: "isJobCold",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
            type: "StorageType",
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
        name: "_jobDefinition",
        type: "tuple",
      },
    ],
    name: "isJobDefinitionValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum JobStatus",
        name: "_jobStatus",
        type: "JobStatus",
      },
    ],
    name: "isJobHot",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;
