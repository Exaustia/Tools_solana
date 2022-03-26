const fs = require("fs").promises;

function order() {
  console.log("--- Start script ---");
  const result = [];

  console.log("--- readFile urls.json  ---");

  const listOfProof = require("./mainnet-beta-urls-5bwXyC5qXdQaPuuaX8U3ratKukk4P74TKKSJV8GEFFXF");

  listOfProof.map((e) => {
    const key = e.handle;
    const amount = e.amount;

    const url = e.url;
    const params = new URLSearchParams(url);
    const proofsStr = params.get("proof");
    const distributor = params.get(
      "https://lwus.github.io/gumdrop/claim?distributor"
    );
    const tokenAcc = params.get("tokenAcc");
    const index = params.get("index");

    const proofs = proofsStr.split(",");
    console.log("--- add new entry:", {
      key,
      amount,
      proofs,
      distributor,
      index: parseInt(index),
      tokenAcc,
    });

    result.push({
      key,
      amount,
      proofs,
      distributor,
      index: parseInt(index),
      tokenAcc,
    });
  });
  console.log("--- Write result in gumdrop.json ---");

  console.log("total entries: ", result.length);
  fs.writeFile("./gumdrop.json", JSON.stringify(result, null, 2));
  //   console.log(result);
}

order();
