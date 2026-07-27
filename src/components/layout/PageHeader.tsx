import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbPath {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbPath[];
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 mb-6 animate-fade-in", className)}>
      {/* Breadcrumbs — Apple: subtle navigation hierarchy */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className="text-[12px]">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={crumb.label} className="flex items-center">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground/70 font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href || '#'}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="mx-1.5 opacity-40" />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            // Apple HIG: icon containers use soft tinted fill, not gradient
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary [&>svg]:size-5 shrink-0">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            {/* Apple HIG: Navigation titles use font-semibold (600), not extrabold */}
            <h1 className="text-title-1 text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-subheadline text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
