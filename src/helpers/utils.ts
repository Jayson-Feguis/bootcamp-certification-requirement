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
  let sanitized = str.replaceAll("/", "");
  const words = sanitized.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
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

function generateNumberArray(number: number) {
  const result = [];

  for (let i = 1; i <= number; i++) {
    result.push(i);
  }

  return result;
}

function computeSkeletonOpacity(numberOfSkeleton: number, index: number) {
  return (
    generateNumberArray(numberOfSkeleton).reverse()[index - 1] /
    numberOfSkeleton
  );
}

export {
  generateNumberArray,
  parseWalletError,
  authorFilter,
  toSentenceCase,
  dateOffset,
  shortenAddress,
  computeSkeletonOpacity,
};
