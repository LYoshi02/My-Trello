export const appColors = [
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

export const isMovementEqual = (result) => {
  const { source, destination } = result;
  return (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  );
};
