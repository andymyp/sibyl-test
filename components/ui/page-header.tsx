interface Props {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col w-full gap-1">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
