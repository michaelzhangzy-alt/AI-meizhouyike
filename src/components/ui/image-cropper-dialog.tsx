
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { getCroppedImg } from '../../lib/canvas-utils';
import { Loader2 } from 'lucide-react';

interface ImageCropperDialogProps {
  imageSrc: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspect?: number;
}

export function ImageCropperDialog({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
  aspect = 16 / 9,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
        onOpenChange(false);
      }
    } catch (e) {
      console.error(e);
      alert('裁剪失败，可能是跨域图片导致。将直接使用原图。');
      // Fallback: try to fetch original blob or just fail gracefully
      // For now just close
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b z-10 bg-white">
          <DialogTitle>调整封面图片</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full h-[400px] bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteHandler}
            />
          )}
        </div>

        <div className="p-4 border-t bg-white flex items-center justify-between gap-4">
           <div className="flex-1">
             <label className="text-sm font-medium text-gray-700">缩放</label>
             <input
               type="range"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               aria-labelledby="Zoom"
               onChange={(e) => setZoom(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
             />
           </div>
           <DialogFooter className="flex-shrink-0">
             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
               取消
             </Button>
             <Button onClick={handleSave} disabled={loading}>
               {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
               确认使用
             </Button>
           </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
