import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
      <DialogContent className="max-w-md w-full bg-white border-0 shadow-elegant rounded-2xl p-0 overflow-hidden">
        {/* Green Header Section */}
        <div className="bg-gradient-primary px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Koppa<span className="text-yellow-300">Whisper</span>
          </h1>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 text-center space-y-6">
          {/* Link Name/Question */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide leading-tight">
              {title}
            </h2>
          </div>

          {/* Message Content */}
          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <p className="text-gray-800 text-lg leading-relaxed break-words">
              "{message.message}"
            </p>
          </div>

          {/* Anonymous Message Label */}
          <div className="text-gray-600 text-lg font-medium">
            anonymous message
          </div>

          {/* Timestamp */}
          <div className="text-sm text-gray-500 mt-4">
            {format(new Date(message.created_at), 'MMMM d, yyyy • h:mm a')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};