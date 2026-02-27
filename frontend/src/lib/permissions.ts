/**
 * Permission utility for handling runtime permissions in Android WebView
 * All permission dialogs display "Mucit Evreni" as the app name
 */

export type PermissionType = 'notifications' | 'camera' | 'storage' | 'microphone';

export interface PermissionResult {
  granted: boolean;
  message: string;
}

/**
 * Check if running in Android WebView
 */
export function isAndroidWebView(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('android') && (ua.includes('wv') || ua.includes('webview'));
}

/**
 * Request notification permission with branded dialog
 */
export async function requestNotificationPermission(): Promise<PermissionResult> {
  try {
    // Check if Notification API is available
    if (!('Notification' in window)) {
      return {
        granted: false,
        message: 'Mucit Evreni bildirim özelliğini desteklemiyor.'
      };
    }

    // Check current permission status
    if (Notification.permission === 'granted') {
      return {
        granted: true,
        message: 'Mucit Evreni bildirimleri zaten açık.'
      };
    }

    if (Notification.permission === 'denied') {
      return {
        granted: false,
        message: 'Mucit Evreni bildirimleri engellenmiş. Lütfen ayarlardan izin verin.'
      };
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    return {
      granted: permission === 'granted',
      message: permission === 'granted' 
        ? 'Mucit Evreni bildirimleri açıldı! 🔔'
        : 'Mucit Evreni bildirimleri için izin verilmedi.'
    };
  } catch (error) {
    console.error('Notification permission error:', error);
    return {
      granted: false,
      message: 'Mucit Evreni bildirim izni alınamadı.'
    };
  }
}

/**
 * Request camera permission with branded dialog
 */
export async function requestCameraPermission(): Promise<PermissionResult> {
  try {
    // Check if MediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        message: 'Mucit Evreni kamera özelliğini desteklemiyor.'
      };
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Stop the stream immediately after getting permission
    stream.getTracks().forEach(track => track.stop());
    
    return {
      granted: true,
      message: 'Mucit Evreni kamera izni verildi! 📷'
    };
  } catch (error) {
    console.error('Camera permission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    
    if (errorMessage.includes('Permission denied')) {
      return {
        granted: false,
        message: 'Mucit Evreni kamera izni reddedildi. Lütfen ayarlardan izin verin.'
      };
    }
    
    return {
      granted: false,
      message: 'Mucit Evreni kamera erişimi sağlanamadı.'
    };
  }
}

/**
 * Request storage/file access permission with branded dialog
 */
export async function requestStoragePermission(): Promise<PermissionResult> {
  try {
    // For web/WebView, we use the File System Access API or fallback to input element
    if ('showOpenFilePicker' in window) {
      // Modern File System Access API
      return {
        granted: true,
        message: 'Mucit Evreni dosya erişimi hazır.'
      };
    }
    
    // Fallback: Storage is accessible through file input elements
    return {
      granted: true,
      message: 'Mucit Evreni dosya seçimi hazır.'
    };
  } catch (error) {
    console.error('Storage permission error:', error);
    return {
      granted: false,
      message: 'Mucit Evreni dosya erişimi sağlanamadı.'
    };
  }
}

/**
 * Request microphone permission with branded dialog
 */
export async function requestMicrophonePermission(): Promise<PermissionResult> {
  try {
    // Check if MediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        message: 'Mucit Evreni mikrofon özelliğini desteklemiyor.'
      };
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Stop the stream immediately after getting permission
    stream.getTracks().forEach(track => track.stop());
    
    return {
      granted: true,
      message: 'Mucit Evreni mikrofon izni verildi! 🎤'
    };
  } catch (error) {
    console.error('Microphone permission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    
    if (errorMessage.includes('Permission denied')) {
      return {
        granted: false,
        message: 'Mucit Evreni mikrofon izni reddedildi. Lütfen ayarlardan izin verin.'
      };
    }
    
    return {
      granted: false,
      message: 'Mucit Evreni mikrofon erişimi sağlanamadı.'
    };
  }
}

/**
 * Check permission status without requesting
 */
export async function checkPermissionStatus(type: PermissionType): Promise<boolean> {
  try {
    switch (type) {
      case 'notifications':
        return 'Notification' in window && Notification.permission === 'granted';
      
      case 'camera':
      case 'microphone':
        if (!navigator.permissions) return false;
        const result = await navigator.permissions.query({ 
          name: type === 'camera' ? 'camera' : 'microphone' as PermissionName 
        });
        return result.state === 'granted';
      
      case 'storage':
        // Storage is generally available in WebView
        return true;
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Permission check error for ${type}:`, error);
    return false;
  }
}

/**
 * Show permission explanation dialog
 */
export function showPermissionExplanation(type: PermissionType): string {
  const explanations: Record<PermissionType, string> = {
    notifications: 'Mucit Evreni motivasyon mesajları ve hatırlatıcılar göndermek için bildirim izni istiyor.',
    camera: 'Mucit Evreni bazı aktivitelerde kamera kullanmak için izin istiyor.',
    storage: 'Mucit Evreni fotoğraf ve dosyalarına erişmek için izin istiyor.',
    microphone: 'Mucit Evreni ses kaydetme aktiviteleri için mikrofon izni istiyor.'
  };
  
  return explanations[type];
}
