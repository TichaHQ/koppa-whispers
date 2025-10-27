import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { useRef } from "react";

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
  const modalRef = useRef<HTMLDivElement>(null);
  
  const captureAndShare = async () => {
    if (!modalRef.current) return;
    
    try {
      const canvas = await html2canvas(modalRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const signupUrl = window.location.origin;
        const shareText = `🌟 Just received a whisper on KoppaWhisper! 🤫 Want to receive anonymous messages too? Sign up at ${signupUrl} and start getting your own whispers! 🎉 #KoppaWhisper #AnonymousMessages`;
        
        const file = new File([blob], 'whisper-message.png', { type: 'image/png' });
        
        // Check if native sharing is supported
        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              text: shareText,
            });
          } catch (error) {
            // User cancelled or sharing failed
            console.log('Share cancelled or failed:', error);
          }
        } else {
          // Fallback: Download the image
          const link = document.createElement('a');
          link.download = 'whisper-message.png';
          link.href = canvas.toDataURL();
          link.click();
          alert('Image downloaded! You can now share it on your preferred platform.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white border-0 shadow-elegant rounded-2xl p-0 overflow-hidden">
        <div ref={modalRef}>
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
        </div>
        
        {/* Share Button - Inside modal at bottom */}
        <div className="px-6 pb-6">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full shadow-lg bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={captureAndShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Whisper
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};