export const isMovementEqual = (result) => {
  const { source, destination } = result;
  return (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  );
};
