import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ScheduleVisitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { date: string; time: string; notes: string; activity: string }) => void;
  lead?: {
    id: string;
    name: string;
    property: string;
  } | null;
}

export function ScheduleVisitModal({ open, onClose, onConfirm, lead }: ScheduleVisitModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('14:00');
  const [notes, setNotes] = useState('');
  const [activity, setActivity] = useState('visita');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onConfirm({
        date: format(date, 'dd/MM/yyyy'),
        time,
        notes,
        activity
      });
      setDate(new Date());
      setTime('14:00');
      setNotes('');
      setActivity('visita');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agendar Atividade</DialogTitle>
            {lead && (
              <div className="text-sm text-muted-foreground">
                <p>Cliente: {lead.name}</p>
                <p>Imóvel: {lead.property}</p>
              </div>
            )}
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Tipo de Atividade</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">Visita ao imóvel</SelectItem>
                    <SelectItem value="ligacao">Ligação telefônica</SelectItem>
                    <SelectItem value="email">Envio de e-mail</SelectItem>
                    <SelectItem value="reuniao">Reunião presencial</SelectItem>
                    <SelectItem value="proposta">Apresentar proposta</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                  placeholder="Alguma observação importante sobre a visita?"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!date}>
              Confirmar Visita
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
