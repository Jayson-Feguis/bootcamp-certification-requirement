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

function toSentenceCase(str: String) {
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}

function dateOffset(offset: number, date?: number) {
  const updatedAt = date ? new Date(date) : 0;
  return new Date(+updatedAt + offset);
}

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export {
  parseWalletError,
  authorFilter,
  toSentenceCase,
  dateOffset,
  shortenAddress,
};
