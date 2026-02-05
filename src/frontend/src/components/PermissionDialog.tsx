import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bell, Camera, FolderOpen, Mic } from 'lucide-react';
import { PermissionType } from '@/lib/permissions';

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissionType: PermissionType;
  onConfirm: () => void;
  onCancel: () => void;
}

const permissionIcons: Record<PermissionType, React.ReactNode> = {
  notifications: <Bell className="w-12 h-12 text-yellow-400" />,
  camera: <Camera className="w-12 h-12 text-blue-400" />,
  storage: <FolderOpen className="w-12 h-12 text-green-400" />,
  microphone: <Mic className="w-12 h-12 text-purple-400" />,
};

const permissionTitles: Record<PermissionType, string> = {
  notifications: 'Bildirim İzni',
  camera: 'Kamera İzni',
  storage: 'Dosya Erişim İzni',
  microphone: 'Mikrofon İzni',
};

const permissionDescriptions: Record<PermissionType, string> = {
  notifications: 'Mucit Evreni sana motivasyon mesajları ve uyku vakti hatırlatıcıları göndermek istiyor. Bu sayede öğrenme yolculuğunda seni destekleyebiliriz!',
  camera: 'Mucit Evreni bazı eğlenceli aktivitelerde kamera kullanmak istiyor. Kameranı sadece sen kullanacaksın!',
  storage: 'Mucit Evreni fotoğraflarına ve dosyalarına erişmek istiyor. Bu sayede projelerini kaydedebilir ve paylaşabilirsin!',
  microphone: 'Mucit Evreni ses kaydetme aktiviteleri için mikrofon kullanmak istiyor. Sesini sadece sen duyacaksın!',
};

export default function PermissionDialog({
  open,
  onOpenChange,
  permissionType,
  onConfirm,
  onCancel,
}: PermissionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-indigo-900 to-purple-900 border-white/20 text-white max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            {permissionIcons[permissionType]}
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            {permissionTitles[permissionType]}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/90 text-center text-base leading-relaxed">
            {permissionDescriptions[permissionType]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Şimdi Değil
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold"
          >
            İzin Ver
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
