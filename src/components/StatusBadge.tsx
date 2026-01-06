import { LicitacaoStatus, STATUS_CONFIG } from '@/types/licitacao';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LicitacaoStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      config.bgColor,
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
}
