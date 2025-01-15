import { ExecutorOptionType } from "@layerzerolabs/lz-v2-utilities";
import { OAppEdgeConfig, OAppEnforcedOption, OmniEdgeHardhat, OmniPointHardhat } from "@layerzerolabs/toolbox-hardhat";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { generateConnectionsConfig } from "@layerzerolabs/metadata-tools";
import { ETH_SAFE_ADDRESS, ARB_SAFE_ADDRESS } from "./hardhat.config";

///////////////////////////////////////////////////////
/// SPELL
///////////////////////////////////////////////////////
const spellEthereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'SpellOFT',
}

const spellArbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'SpellOFT',
}

///////////////////////////////////////////////////////
/// BOUNDSPELL
///////////////////////////////////////////////////////

const bSpellArbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'BoundSpellOFT',
}

const bSpellEthereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'BoundSpellOFT',
}

///////////////////////////////////////////////////////
/// MIM
///////////////////////////////////////////////////////
const mimEthereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'MIMOFT',
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 80000,
        value: 0,
    },
];

export default async function () {
    // [srcContract, dstContract, [requiredDVNs, [optionalDVNs, threshold]], [srcToDstConfirmations, dstToSrcConfirmations]], [enforcedOptionsSrcToDst, enforcedOptionsDstToSrc]
    const connections = await generateConnectionsConfig([
        [spellEthereumContract, spellArbitrumContract, [['LayerZero Labs', 'MIM'], []], [15, 20], [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS]],
        [bSpellEthereumContract, bSpellArbitrumContract, [['LayerZero Labs', 'MIM'], []], [15, 20], [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS]],
    ]) as OmniEdgeHardhat<OAppEdgeConfig>[];

    // Prints generated connections
    //console.log(JSON.stringify(connections, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));

    return {
        contracts: [
            {
                contract: spellEthereumContract,
                config: {
                    owner: ETH_SAFE_ADDRESS,
                    delegate: ETH_SAFE_ADDRESS,
                },
            },
            {
                contract: spellArbitrumContract,
                config: {
                    owner: ARB_SAFE_ADDRESS,
                    delegate: ARB_SAFE_ADDRESS,
                },
            },
            {
                contract: bSpellEthereumContract,
                config: {
                    owner: ETH_SAFE_ADDRESS,
                    delegate: ETH_SAFE_ADDRESS,
                },
            },
            {
                contract: bSpellArbitrumContract,
                config: {
                    owner: ARB_SAFE_ADDRESS,
                    delegate: ARB_SAFE_ADDRESS,
                },
            },
           /* {
                contract: mimEthereumContract,
                config: {
                    owner: ETH_SAFE_ADDRESS,
                    delegate: ETH_SAFE_ADDRESS,
                },
            },*/
        ],
        connections
    }
}