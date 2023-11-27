export const MetaSchedulerAbi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_credit",
        type: "address",
      },
      {
        internalType: "contract Constants",
        name: "_constants",
        type: "address",
      },
      {
        internalType: "contract IProviderManager",
        name: "_providerManager",
        type: "address",
      },
      {
        internalType: "contract IProviderJobQueues",
        name: "_providerJobQueues",
        type: "address",
      },
      {
        internalType: "contract IJobRepository",
        name: "_jobs",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CustomerMetaSchedulerProviderOnly",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "current",
        type: "address",
      },
      {
        internalType: "address",
        name: "expected",
        type: "address",
      },
    ],
    name: "CustomerOnly",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
    ],
    name: "InsufficientFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidJobDefinition",
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
    inputs: [
      {
        internalType: "address",
        name: "current",
        type: "address",
      },
      {
        internalType: "address",
        name: "expected",
        type: "address",
      },
    ],
    name: "JobProviderOnly",
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
    name: "MetaScheduledScheduledStatusOnly",
    type: "error",
  },
  {
    inputs: [],
    name: "NewJobRequestDisabled",
    type: "error",
  },
  {
    inputs: [],
    name: "NoSpendingAuthority",
    type: "error",
  },
  {
    inputs: [],
    name: "ProviderNotJoined",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "remaining",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "RemainingTimeAboveLimit",
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
    name: "RunningColdStatusOnly",
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
    name: "RunningScheduledStatusOnly",
    type: "error",
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
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_billingAmount",
        type: "uint256",
      },
    ],
    name: "BilledTooMuchEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "customerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxDurationMinute",
        type: "uint64",
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
        indexed: false,
        internalType: "struct JobDefinition",
        name: "jobDefinition",
        type: "tuple",
      },
    ],
    name: "ClaimJobEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "customerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
    ],
    name: "ClaimNextCancellingJobEvent",
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
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxDurationMinute",
        type: "uint64",
      },
    ],
    name: "ClaimNextTopUpJobEvent",
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
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_customerAddr",
        type: "address",
      },
    ],
    name: "JobRefusedEvent",
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
        internalType: "address",
        name: "_customerAddr",
        type: "address",
      },
    ],
    name: "NewJobRequestEvent",
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
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "cancelJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimNextCancellingJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimNextJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimNextTopUpJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "constants",
    outputs: [
      {
        internalType: "contract Constants",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "credit",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "enableRequestNewJob",
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
    inputs: [],
    name: "jobs",
    outputs: [
      {
        internalType: "contract IJobRepository",
        name: "",
        type: "address",
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
        internalType: "address",
        name: "_providerAddr",
        type: "address",
      },
    ],
    name: "metaSchedule",
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
        name: "_lastError",
        type: "string",
      },
    ],
    name: "panicJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "providerJobQueues",
    outputs: [
      {
        internalType: "contract IProviderJobQueues",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "providerManager",
    outputs: [
      {
        internalType: "contract IProviderManager",
        name: "",
        type: "address",
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
        internalType: "enum JobStatus",
        name: "_nextJobStatus",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "_jobDurationMinute",
        type: "uint64",
      },
      {
        internalType: "string",
        name: "_lastError",
        type: "string",
      },
      {
        internalType: "int64",
        name: "_exitCode",
        type: "int64",
      },
    ],
    name: "providerSetJobStatus",
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
    ],
    name: "refuseJob",
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
    name: "renounceRole",
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
      {
        internalType: "uint256",
        name: "_lockedCredits",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_jobName",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "_delegateSpendingAuthority",
        type: "bool",
      },
    ],
    name: "requestNewJob",
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
        internalType: "bool",
        name: "_delegateSpendingAuthority",
        type: "bool",
      },
    ],
    name: "setDelegateSpendingAuthority",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_enable",
        type: "bool",
      },
    ],
    name: "setEnableRequestNewJob",
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
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "timeoutJob",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "topUpJob",
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
    ],
    name: "topUpJobDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
