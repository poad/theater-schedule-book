const dateTimeFormat = new Intl.DateTimeFormat('ja-JP', { weekday: 'short' });
export const DateView = (props: {
  date: Date | number
}) => {
  const date = typeof props.date === 'number' ? new Date(props.date) : props.date;
  return <>{date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()} ({dateTimeFormat.format(date)}) {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</>;
};
