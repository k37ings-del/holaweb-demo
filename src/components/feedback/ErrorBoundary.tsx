import { Component, ErrorInfo, ReactNode } from "react";
import ErrorState from "./ErrorState";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught error", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <ErrorState
            title="Something went wrong"
            message={this.state.error?.message || "An unexpected error occurred. Please try again."}
            onRetry={this.reset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
