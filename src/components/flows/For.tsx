export function For<T>({
  items,
  children,
}: {
  items?: T[];
  children: (props: { item: T; index?: number }) => JSX.Element;
}): JSX.Element {
  return <>{items?.map((item, index) => children({ item, index }))}</>;
}
