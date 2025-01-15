import { Contract } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'
import { getDeploymentAddressAndAbi } from '@layerzerolabs/lz-evm-sdk-v2'

const deploymentName = 'MIMOFT'
const salt = "mim-oft-1734968493"

const configurations = {
    'ethereum-mainnet': {
        contractName: 'AbraOFTAdapterUpgradeable',
        args: (endpointAddress: string) => ['0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3', endpointAddress], // MIM address
        initializeArgs: (signer: string) => [signer],
        feeHandler: '0xE66BE95FE4E3889a66925d996AF3E4dC173754a2'
    },
    //'berachain': {
    //    contractName: 'AbraOFTUpgradeable',
    //    args: (endpointAddress: string) => [endpointAddress],
    //    initializeArgs: (signer: string) => ['Magic Internet Money', 'MIM', signer],
    //    //feeHandler: '0xe4aec83Cba57E2B0b9ED8bc9801123F44f393037'
    //}
}

const deploy: DeployFunction = async (hre) => {
    const { deploy } = hre.deployments
    const signer = (await hre.ethers.getSigners())[0]
    console.log(`deploying ${deploymentName} on network: ${hre.network.name} with ${signer.address}`)

    const { address, abi } = getDeploymentAddressAndAbi(hre.network.name, 'EndpointV2')
    const endpointV2Deployment = new Contract(address, abi, signer)

    const config = configurations[hre.network.name as keyof typeof configurations]

    const deployment = await deploy(deploymentName, {
        deterministicDeployment: "0x" + Buffer.from(salt).toString('hex'),
        from: signer.address,
        args: config.args(endpointV2Deployment.address),
        log: true,
        waitConfirmations: 1,
        skipIfAlreadyDeployed: false,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
            owner: signer.address,
            execute: {
                init: {
                    methodName: 'initialize',
                    args: config.initializeArgs(signer.address),
                },
            },
        },
        contract: config.contractName
    })

    const oft = await hre.ethers.getContractAt('SenderWithFees', deployment.address)
    await (await oft.setFeeHandler(config.feeHandler)).wait()
}

deploy.tags = [deploymentName]

export default deploy
