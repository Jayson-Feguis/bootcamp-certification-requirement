function parseWalletError(error: String) {
  return error.toString().split(":")[1].split(".")[0];
}

function authorFilter(authorBase58PublicKey: any) {
  return {
    memcmp: {
      offset: 8, // Discriminator.
      bytes: authorBase58PublicKey,
    },
  };
}

export { parseWalletError, authorFilter };
