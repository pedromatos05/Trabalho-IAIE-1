import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-primary text-primary-foreground rounded-lg size-10',
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M12 2c-3.5 0-6 2.5-6 6 0 2.5 1.5 5 4 6s5 2 5 4-2 4-4 4-4-2-4-4" />
        <path d="M4 14a8 8 0 0 1 8-8" />
        <path d="M4 18a4 4 0 0 0 4 4" />
        <path d="M14 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
        <path d="m19 14 3-3 2 2" />
        <path d="m15 13 4-4 2 2" />
        <path d="M12 8s-1-4-4-4" />
        <path d="M12 2v4" />
      </svg>
    </div>
  );
}
