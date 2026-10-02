"use client";

type Props = {
  className?: string;
  label?: string;
};

export default function AddToCartButton({ className = "", label = "Add" }: Props) {
  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={(e) => {
        e.preventDefault(); // in case the button ends up inside a link
        e.stopPropagation();
      }}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
