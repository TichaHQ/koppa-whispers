import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface WelcomeDialogProps {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
  username: string;
}

export const WelcomeDialog = ({ open, onComplete, onSkip, username }: WelcomeDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-gradient-card border-0 shadow-glow">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-primary text-center">
            Welcome to KoppaWhisper, {username}! 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p>
              Your account has been created successfully! You're now part of the NYSC corps community.
            </p>
            <p>
              To help fellow corps connect with you and send anonymous messages, we recommend completing your profile with details like your batch, stream, year, and state of deployment.
            </p>
            <p className="font-medium text-primary">
              Would you like to complete your profile now?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onSkip}
            className="w-full sm:w-auto"
          >
            Skip for now
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onComplete}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Complete Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};