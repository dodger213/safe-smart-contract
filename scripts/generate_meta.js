#!/usr/bin/env node
const IPFS = require('ipfs-http-client');

const fs = require('fs')
const util = require('util')
const path = require('path')

const log = console.log

const copyFile = util.promisify(fs.copyFile)
const writeFile = util.promisify(fs.writeFile)

const contractDir = path.join("build", "contracts")
const metaDir = path.join("build", "meta")

async function main() {
    const upload = process.argv.findIndex((value) => value === "--upload") >= 0
    const ipfs = IPFS({
        host: 'ipfs.infura.io',
        port: '5001',
        protocol: 'https'
    });
    const contractArtifact = require(path.join(process.cwd(), contractDir, "GnosisSafe.json"));

    if (!fs.existsSync(metaDir)) {
        fs.mkdirSync(metaDir);
    }

    log("Generating metadata...")
    log("======================")

    log();
    log(contractArtifact.contractName);
    log("-".repeat(contractArtifact.contractName.length));

    const etherscanConfig = {
        language: "",
        sources: {},
        settings: {},
        evmVersion: ""
    }

    const meta = JSON.parse(contractArtifact.metadata)
    etherscanConfig.language = meta.language
    etherscanConfig.evmVersion = meta.evmVersion
    for (let source in meta.sources) {
        const pathParts = source.split("/")
        await copyFile(source, path.join(metaDir, pathParts[pathParts.length - 1]));
        const contractSource = fs.readFileSync(source)
        etherscanConfig.sources[source] = { content: contractSource.toString() }
        if (upload) {
            for await (const res of ipfs.add(contractSource)) {
                log(`metadata: ${res.path}`);
            }
        }
    }

    log('Write GnosisSafeMeta.json');
    const contractMetaFile = path.join(process.cwd(), metaDir, "GnosisSafeMeta.json");
    await writeFile(contractMetaFile, contractArtifact.metadata)

    log('Write GnosisSafeEtherscan.json');
    const contractEtherscanFile = path.join(process.cwd(), metaDir, "GnosisSafeEtherscan.json");
    await writeFile(contractEtherscanFile, JSON.stringify(etherscanConfig))

    log();
    log('Finished.');
    log();
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.log(err);
        process.exit(1)
    })