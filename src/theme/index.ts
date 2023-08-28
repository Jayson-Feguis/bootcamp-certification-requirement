import { createTheme } from "@mui/material";
import { COLOR, FONT } from "@/helpers/constants";

const customTheme = createTheme({
  palette: {
    primary: {
      main: COLOR.PRIMARY,
    },
  },
  typography: {
    fontFamily: FONT.PRIMARY,
  },
});

export default customTheme;
