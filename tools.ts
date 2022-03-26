const fs = require("fs").promises;

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

// const { Connection } = require("@metaplex/js");
const anchor = require("@project-serum/anchor");

const connection = new anchor.web3.Connection("https://ssc-dao.genesysgo.net/");

async function fetchHashTable() {
  const {
    Metadata,
    MetadataProgram,
  } = require("@metaplex-foundation/mpl-token-metadata");
  console.log("Start metadata with infos");
  console.log("candyMachineId", candyMachineId);
  console.log("firstCreatorsAddress", firstCreatorsAddress);
  console.log("secondCreatorsAddress", secondCreatorsAddress);

  const metadataAccounts = await MetadataProgram.getProgramAccounts(
    connection,
    {
      filters: [
        {
          memcmp: {
            offset:
              1 +
              32 +
              32 +
              4 +
              MAX_NAME_LENGTH +
              4 +
              MAX_URI_LENGTH +
              4 +
              MAX_SYMBOL_LENGTH +
              2 +
              1 +
              4 +
              0 * MAX_CREATOR_LEN,
            bytes: candyMachineId,
          },
        },
      ],
    }
  );
  const mintHashes = [];
  console.log("get metadataAccounts success");

  for (let index = 0; index < metadataAccounts.length; index++) {
    const account = metadataAccounts[index];
    const accountInfo = await connection.getParsedAccountInfo(account.pubkey);

    const metadata = new Metadata(candyMachineId, accountInfo.value);
    const creators = metadata.data.data.creators;
    if (creators) {
      if (firstCreatorsAddress && secondCreatorsAddress) {
        if (
          creators[0].address === firstCreatorsAddress &&
          creators[1].address === secondCreatorsAddress
        )
          if (creators[0].verified) mintHashes.push(metadata.data.mint);
      } else {
        if (creators[0].address === firstCreatorsAddress)
          mintHashes.push(metadata.data.mint);
      }
    }
  }
  console.log("number of mint find: ", mintHashes.length);

  console.log(` write in list_mints_` + candyMachineId + `.json`);
  fs.writeFile(
    `./list_mints_` + candyMachineId + `.json`,
    JSON.stringify(mintHashes, null, 2)
  );
  return mintHashes;
}

const candyMachineId = "Ehn81nZL7QFC6vkzNnKYo8X8SwLS9AHHov45i64WEmoE";
const firstCreatorsAddress = "Ehn81nZL7QFC6vkzNnKYo8X8SwLS9AHHov45i64WEmoE";
const secondCreatorsAddress = "FDvt9oqrpBXCcBR3jg7RNjSUriU9PMdrLxuNbnerdJAa";

console.log("start scripts");
fetchHashTable();
