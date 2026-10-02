export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div
        className="size-10 animate-spin rounded-full border-[3px] border-[#DCDCD7] border-t-[#232323]"
        role="status"
      />
    </div>
  );
}