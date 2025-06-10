import { ReactNode } from "react";
import { Button } from "@thefolk/ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "outline";
  };
  children?: ReactNode;
}

export const PageHeader = ({
  title,
  description,
  action,
  children,
}: PageHeaderProps) => {
  return (
    <div className="border-b border-neutral-200 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900">{title}</h1>
          {description && (
            <p className="text-neutral-600 mt-1">{description}</p>
          )}
        </div>

        {action && (
          <Button
            as={action.href ? "a" : "button"}
            href={action.href}
            onClick={action.onClick}
            variant={action.variant || "primary"}
            leftIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};
