// TAG constants and functions
const tagColors = [
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "light-blue",
  "aqua",
  "pink",
  "black",
];

export const getColorCode = (color) => {
  let colorCode;

  switch (color) {
    case "green":
      colorCode = "#61bd4f";
      break;
    case "yellow":
      colorCode = "#f2d600";
      break;
    case "orange":
      colorCode = "#ff9f1a";
      break;
    case "red":
      colorCode = "#eb5a46";
      break;
    case "purple":
      colorCode = "#c377e0";
      break;
    case "blue":
      colorCode = "#0079bf";
      break;
    case "light-blue":
      colorCode = "#00c2e0";
      break;
    case "aqua":
      colorCode = "#51e898";
      break;
    case "pink":
      colorCode = "#ff78cb";
      break;
    case "black":
      colorCode = "#344563";
      break;
    default:
      colorCode = "#b3bac5";
      break;
  }

  return colorCode;
};

export const getTagColorsArray = () => {
  const colors = tagColors.map((clr) => {
    return {
      name: clr,
      colorCode: getColorCode(clr),
    };
  });

  return colors;
};
