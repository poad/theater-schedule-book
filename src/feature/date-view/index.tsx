const dateTimeFormat = new Intl.DateTimeFormat('ja-JP', { weekday: 'short' });
export const DateView = (props: {
  date: Date | number
}) => {
  const date = typeof props.date === 'number' ? new Date(props.date) : props.date;
  return <>{date.getFullYear()}/{date.getMonth()}/{date.getDate()} ({dateTimeFormat.format(date)}) {date.getHours()}:{date.getMinutes()}</>;
};
