interface LoadingStateProps {
  label?: string;
  className?: string;
}

const LoadingState = ({ label = "Loading...", className }: LoadingStateProps) => (
  <div className={className ?? "text-center py-12 text-muted-foreground font-body"}>{label}</div>
);

export default LoadingState;
