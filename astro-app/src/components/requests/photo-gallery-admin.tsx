import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { deriveAltTextFromFilename } from "@/utils/derive-alt-text";

interface PhotoItem {
  id: string;
  url: string;
  alt: string;
}

interface PendingPhoto {
  key: string;
  file: File;
  previewUrl: string;
  alt: string;
}

interface PhotoGalleryAdminProps {
  initialPhotos: PhotoItem[];
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const GENERIC_ALT_FALLBACK = "Cubing Kerala photo";

/**
 * Admin-managed homepage photo gallery — drag-and-drop or pick several
 * files at once, each gets an alt caption auto-derived from its filename
 * (e.g. "amrita-cube-open-2026.jpg" -> "Amrita Cube Open 2026"), editable
 * before upload; a camera-generated name with nothing readable in it (e.g.
 * "IMG_20260214.jpg") falls back to a numbered generic caption instead of
 * surfacing filename junk. Alt text stays mandatory server-side — this
 * only removes the need to type one by hand for every photo.
 */
export function PhotoGalleryAdmin({ initialPhotos }: PhotoGalleryAdminProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const genericCountRef = useRef(0);

  const pickFiles = (fileList: FileList | null | undefined) => {
    if (!fileList || fileList.length === 0) return;
    const accepted: PendingPhoto[] = [];
    for (const file of Array.from(fileList)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPEG, PNG, or WebP images are allowed`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name}: must be under 8MB`);
        continue;
      }
      const derived = deriveAltTextFromFilename(file.name);
      const alt = derived ?? `${GENERIC_ALT_FALLBACK} ${++genericCountRef.current}`;
      accepted.push({
        key: `${file.name}-${file.lastModified}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        alt,
      });
    }
    if (accepted.length > 0) setPending((prev) => [...prev, ...accepted]);
  };

  const removePending = (key: string) => {
    setPending((prev) => {
      const target = prev.find((item) => item.key === key);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.key !== key);
    });
  };

  const updatePendingAlt = (key: string, alt: string) => {
    setPending((prev) => prev.map((item) => (item.key === key ? { ...item, alt } : item)));
  };

  const uploadOne = async (
    item: PendingPhoto,
  ): Promise<{ ok: true; photo: PhotoItem } | { ok: false; message: string }> => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("alt", item.alt.trim().length > 0 ? item.alt.trim() : GENERIC_ALT_FALLBACK);
    try {
      const res = await fetch("/api/admin-add-photo", { method: "POST", body: formData });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        url?: string;
        alt?: string;
        message?: string;
      };
      if (!res.ok || !data.id || !data.url) {
        return { ok: false, message: data.message ?? "Failed to upload" };
      }
      return { ok: true, photo: { id: data.id, url: data.url, alt: data.alt ?? item.alt } };
    } catch {
      return { ok: false, message: "Network error" };
    }
  };

  const handleUploadAll = async () => {
    if (pending.length === 0) return;
    setIsUploading(true);
    const toUpload = pending;
    const failedKeys = new Set<string>();
    let succeeded = 0;

    // Sequential, not parallel — a handful of admin-triggered uploads at
    // once is fine either way, but one-at-a-time gives honest per-photo
    // error feedback instead of a batch of requests racing each other.
    for (const item of toUpload) {
      const result = await uploadOne(item);
      if (result.ok) {
        succeeded++;
        setPhotos((prev) => [...prev, result.photo]);
        URL.revokeObjectURL(item.previewUrl);
      } else {
        failedKeys.add(item.key);
        toast.error(`${item.file.name}: ${result.message}`);
      }
    }

    setPending((prev) => prev.filter((item) => failedKeys.has(item.key)));
    setIsUploading(false);
    if (succeeded > 0) toast.success(succeeded === 1 ? "Photo added" : `${succeeded} photos added`);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setBusyIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch("/api/admin-delete-photo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        toast.error(data.message ?? "Failed to delete photo");
        return;
      }
      toast.success("Photo deleted");
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch {
      toast.error("Failed to delete photo — please try again");
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          pickFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex h-24 w-full max-w-sm flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-xs text-muted-foreground transition-colors hover:text-primary",
          isDragging ? "border-primary bg-primary/5 text-primary" : "border-input",
        )}
      >
        <Upload className="size-5" />
        <span>Drag & drop or click to select — multiple photos allowed</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          pickFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {pending.length > 0 && (
        <div className="flex flex-col gap-3 rounded-md border border-border p-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {pending.map((item) => (
              <div key={item.key} className="flex flex-col gap-1.5">
                <div className="group relative h-20 overflow-hidden rounded-md">
                  <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove from upload list"
                    disabled={isUploading}
                    onClick={() => removePending(item.key)}
                    className="absolute right-1 top-1 cursor-pointer rounded-md bg-background/80 p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <Input
                  value={item.alt}
                  onChange={(event) => updatePendingAlt(item.key, event.target.value)}
                  disabled={isUploading}
                  className="h-7 text-xs"
                  placeholder="Caption / alt text"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" disabled={isUploading} onClick={handleUploadAll}>
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `Add ${pending.length} photo${pending.length === 1 ? "" : "s"}`
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isUploading}
              onClick={() => {
                pending.forEach((item) => URL.revokeObjectURL(item.previewUrl));
                setPending([]);
              }}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No gallery photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative h-24 overflow-hidden rounded-md">
              <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label={`Delete photo: ${photo.alt}`}
                disabled={busyIds.has(photo.id)}
                onClick={() => setPendingDeleteId(photo.id)}
                className="absolute right-1 top-1 cursor-pointer rounded-md bg-background/80 p-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
              >
                {busyIds.has(photo.id) ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent>
          <DialogTitle>Delete this photo?</DialogTitle>
          <DialogDescription className="mt-2">
            It will be removed from the homepage and deleted from storage. This can't be undone.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              disabled={pendingDeleteId !== null && busyIds.has(pendingDeleteId)}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
