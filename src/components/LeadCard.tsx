import React from 'react';
import { Button } from '@/components/ui/button';

interface LeadCardProps {
  // Define your props here
  id?: string;
  name?: string;
}

export const LeadCard: React.FC<LeadCardProps> = (props) => {
  return (
    <div>
      <Button>Example Button</Button>
    </div>
  );
};
