export const combineDateAndTime = (date: Date, time: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

  return new Date(dateString + ' ' + timeString);
};

export const destructureDeadline = (deadline: Date) => {
  const year = deadline.getFullYear();
  const month = deadline.getMonth() + 1;
  const day = deadline.getDate();
  const dateString = `${year}-${month}-${day}`;
  return dateString;
};
