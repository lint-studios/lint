import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-body-m font-body text-text-secondary mb-8 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl"
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-body-m font-body text-text-secondary">
          Loading insights...
        </p>
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="p-12 text-center bg-surface-card border border-destructive/20 rounded-2xl">
      <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
        Something went wrong
      </h3>
      <p className="text-body-m font-body text-text-secondary mb-8">
        We couldn't load your insights. Please try again.
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="font-medium rounded-xl"
        >
          Try again
        </Button>
      )}
    </Card>
  );
}