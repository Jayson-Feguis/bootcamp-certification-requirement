import { useSnackbarContext } from "@/context";

function useSnackbar() {
  const { setSnackbar } = useSnackbarContext();

  const onClose = () => {
    setSnackbar((prev) => ({ ...prev, isShow: false }));
  };

  return { onClose };
}

export default useSnackbar;
