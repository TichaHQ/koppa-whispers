import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, MessageCircle } from "lucide-react";
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
  
  const captureAndShare = async (platform: string) => {
    if (!modalRef.current) return;
    
    try {
      const canvas = await html2canvas(modalRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const signupUrl = window.location.origin;
        const shareText = `🌟 Just received a whisper on KoppaWhisper! 🤫 Want to receive anonymous messages too? Sign up at ${signupUrl} and start getting your own whispers! 🎉 #KoppaWhisper #AnonymousMessages`;
        
        const file = new File([blob], 'whisper-message.png', { type: 'image/png' });
        
        switch (platform) {
          case 'whatsapp':
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                files: [file],
                text: shareText,
              });
            } else {
              const encodedText = encodeURIComponent(shareText);
              window.open(`https://wa.me/?text=${encodedText}`, '_blank');
            }
            break;
          case 'whatsapp-business':
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                files: [file],
                text: shareText,
              });
            } else {
              const encodedText = encodeURIComponent(shareText);
              window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
            }
            break;
          case 'facebook':
            const encodedUrl = encodeURIComponent(signupUrl);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareText)}`, '_blank');
            break;
          case 'twitter':
            const encodedTweet = encodeURIComponent(shareText);
            window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
            break;
          case 'instagram':
            // Instagram doesn't support direct sharing, so we'll download the image
            const link = document.createElement('a');
            link.download = 'whisper-message.png';
            link.href = canvas.toDataURL();
            link.click();
            alert('Image downloaded! You can now upload it to Instagram and add your caption.');
            break;
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  return (
    <>
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
        </DialogContent>
      </Dialog>
      
      {/* Share Button - Positioned below modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="mt-80 pointer-events-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="lg" className="shadow-lg bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Whisper
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={() => captureAndShare('whatsapp')}>
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => captureAndShare('whatsapp-business')}>
                  <MessageCircle className="h-4 w-4 mr-2 text-green-700" />
                  WhatsApp Business
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => captureAndShare('facebook')}>
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => captureAndShare('instagram')}>
                  <MessageCircle className="h-4 w-4 mr-2 text-pink-600" />
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => captureAndShare('twitter')}>
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Twitter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </>
  );
};