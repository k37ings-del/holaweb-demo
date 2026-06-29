import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <div
    className={
      className ??
      "text-center py-12 bg-card border border-border rounded-lg max-w-md mx-auto"
    }
  >
    <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
      <AlertTriangle className="w-6 h-6 text-destructive" />
    </div>
    <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="font-body text-sm text-muted-foreground mb-4 px-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2 font-subheading text-sm font-semibold"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
