export default function ErrorText({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-md bg-bad/10 border border-bad/30 px-3 py-2 text-sm text-bad">{message}</p>;
}
