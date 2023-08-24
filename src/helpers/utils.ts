function parseWalletError(error: String) {
  return error.toString().split(":")[1].split(".")[0];
}

export { parseWalletError };
