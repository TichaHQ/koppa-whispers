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
      <DialogContent className="max-w-sm w-full aspect-square bg-gradient-card border-0 shadow-elegant rounded-2xl p-6 flex flex-col justify-center">
        <div className="text-center space-y-6">
          {/* App Branding */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary tracking-wide">KOPPA WHISPER</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-2"></div>
          </div>

          {/* Message Source */}
          <div className="flex items-center justify-center gap-2 text-foreground/80">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{title}</span>
          </div>

          {/* Message Content */}
          <div className="bg-background/30 rounded-xl p-4 border border-primary/10">
            <p className="text-foreground font-bold text-base leading-relaxed break-words text-center">
              "{message.message}"
            </p>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground/70 text-center">
            {format(new Date(message.created_at), 'MMMM d, yyyy • h:mm a')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};