import React, { FC } from "react";
import {
  CardActionArea,
  Typography,
  CardMedia,
  CardContent,
  Card,
  CircularProgress,
} from "@mui/material";
import { COLOR } from "@/helpers/constants";
import Image from "next/image";

interface Props {
  image: string;
  name: String;
  description: String;
}

const CustomNftCard: FC<Props> = ({ image, name, description }) => {
  return (
    <Card
      component="div"
      sx={{
        background: COLOR.SECONDARY,
        color: COLOR.WHITE,
        border: `1px solid ${COLOR.TERTIARY}`,
      }}
    >
      <CardActionArea component="div">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src={image as any}
          alt={name as any}
          width={500}
          height={500}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="p"
            className="!text-white"
          >
            {`${name}`}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="!text-white"
          >
            {`${description}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomNftCard;
