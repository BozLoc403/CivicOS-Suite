import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LuxuryCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "pulse" | "gold" | "dark";
  interactive?: boolean;
}

export function LuxuryCard({ 
  title, 
  description, 
  children, 
  className, 
  variant = "default",
  interactive = false 
}: LuxuryCardProps) {
  const variants = {
    default: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
    pulse: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950 border-blue-200 dark:border-blue-800",
    gold: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-amber-950 border-amber-200 dark:border-amber-800",
    dark: "bg-slate-800 dark:bg-slate-950 border-slate-600 dark:border-slate-800"
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 shadow-sm hover:shadow-lg",
        variants[variant],
        interactive && "hover:scale-[1.02] cursor-pointer",
        className
      )}
    >
      {(title || description) && (
        <CardHeader className="pb-3">
          {title && (
            <CardTitle className="text-slate-900 dark:text-slate-100 font-serif text-lg">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}