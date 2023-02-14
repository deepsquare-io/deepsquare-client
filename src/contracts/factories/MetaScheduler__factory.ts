/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { MetaScheduler, MetaSchedulerInterface } from "../MetaScheduler";

const _abi = [
  {
    inputs: [],
    name: "Empty",
    type: "error",
  },
  {
    inputs: [],
    name: "OutOfBounds",
    type: "error",
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
            name: "gpuPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "memPerCpu",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "cpuPerTask",
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
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
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
    name: "BILL_DURATION_DELTA_MINUTE",
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
    inputs: [],
    name: "BILL_TIME_CONTROL_DELTA_S",
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
    inputs: [],
    name: "CANCELLATION_FEE_MINUTE",
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
    inputs: [],
    name: "MINIMUM_AMOUNT",
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
    inputs: [],
    name: "TOP_UP_SLICE_DURATION_MIN",
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
    name: "claimJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimJobTimeout",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
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
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getUnlockBalance",
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
    name: "hasNextJob",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hotJobList",
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
        internalType: "contract IERC20",
        name: "_credit",
        type: "address",
      },
      {
        internalType: "contract IProviderManager",
        name: "_providerManager",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
            name: "gpuPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "memPerCpu",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "cpuPerTask",
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
        ],
        internalType: "struct JobDefinition",
        name: "definition",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
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
            internalType: "bool",
            name: "autoTopUp",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "providerCancellingJobsQueues",
    outputs: [
      {
        internalType: "int128",
        name: "_begin",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "_end",
        type: "int128",
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
    ],
    name: "providerClaimableJobsQueues",
    outputs: [
      {
        internalType: "int128",
        name: "_begin",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "_end",
        type: "int128",
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
        name: "_jobStatus",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "_jobDurationMinute",
        type: "uint64",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "providerTimeoutJobsQueues",
    outputs: [
      {
        internalType: "int128",
        name: "_begin",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "_end",
        type: "int128",
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
            name: "gpuPerTask",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "memPerCpu",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "cpuPerTask",
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
        ],
        internalType: "struct JobDefinition",
        name: "_definition",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_maxCost",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_jobName",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "_autoTopUp",
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
        name: "_autoTopUp",
        type: "bool",
      },
    ],
    name: "setAutoTopUpJob",
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
    name: "topUpJobSlice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateJobsStatus",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "wallet2JobId",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wallet2LockedBalance",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wallet2TotalBalance",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
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

export class MetaScheduler__factory {
  static readonly abi = _abi;
  static createInterface(): MetaSchedulerInterface {
    return new utils.Interface(_abi) as MetaSchedulerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MetaScheduler {
    return new Contract(address, _abi, signerOrProvider) as MetaScheduler;
  }
}
