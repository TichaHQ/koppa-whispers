import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    message: string;
    created_at: string;
  };
  title: string;
}

export const MessageModal = ({ isOpen, onClose, message, title }: MessageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 bg-gradient-card border-0 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
            <p className="text-foreground font-semibold text-lg leading-relaxed break-words">
              {message.message}
            </p>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {format(new Date(message.created_at), 'MMMM d, yyyy • h:mm a')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};