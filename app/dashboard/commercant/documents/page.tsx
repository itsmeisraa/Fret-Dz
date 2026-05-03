"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload, FileText, Download, Trash2, Eye,
  Loader2, FilePlus, CheckCircle, AlertCircle,
} from "lucide-react";

interface Document {
  name: string;
  id: string;
  created_at: string;
  metadata: { size: number; mimetype: string };
}

export default function MyDocumentsPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from("bons-livraison")
        .list(user.id, { sortBy: { column: "created_at", order: "desc" } });

      if (error) throw error;
      setDocuments((data as Document[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Format non supporté. Utilisez PDF, JPG ou PNG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "Fichier trop volumineux (max 10 MB).");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const { error } = await supabase.storage
        .from("bons-livraison")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;
      showToast("success", "Document uploadé avec succès !");
      fetchDocuments();
    } catch (err: any) {
      showToast("error", err.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const downloadFile = async (doc: Document) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.storage
      .from("bons-livraison")
      .createSignedUrl(`${user.id}/${doc.name}`, 60);

    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const deleteFile = async (doc: Document) => {
    if (!confirm("Supprimer ce document ?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.storage
      .from("bons-livraison")
      .remove([`${user.id}/${doc.name}`]);

    if (!error) {
      showToast("success", "Document supprimé.");
      fetchDocuments();
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype === "application/pdf") return "📄";
    if (mimetype?.startsWith("image/")) return "🖼️";
    return "📎";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Mes Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos bons de livraison et documents de transport
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}>
            {toast.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.msg}
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center mb-6 transition-all cursor-pointer ${
            dragOver
              ? "border-[#1e3a5f] bg-blue-50"
              : "border-gray-200 bg-white hover:border-[#1e3a5f] hover:bg-gray-50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileInput}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-[#1e3a5f]">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="font-medium">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-[#1e3a5f]/10 rounded-full">
                <Upload className="h-8 w-8 text-[#1e3a5f]" />
              </div>
              <div>
                <p className="font-semibold text-[#1e3a5f]">
                  Glissez un fichier ici ou cliquez pour parcourir
                </p>
                <p className="text-sm text-gray-400 mt-1">PDF, JPG, PNG — max 10 MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#1e3a5f]">
              Documents ({documents.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
            </div>
          ) : documents.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-medium text-gray-600">Aucun document</p>
                <p className="text-sm text-gray-400 mt-1">
                  Uploadez vos bons de livraison signés
                </p>
              </CardContent>
            </Card>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 py-4 px-5">
                  <div className="text-2xl">{getFileIcon(doc.metadata?.mimetype)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1e3a5f] truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {formatSize(doc.metadata?.size)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-[#1e3a5f]"
                      onClick={() => downloadFile(doc)}
                      title="Télécharger / Aperçu"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-[#1e3a5f]"
                      onClick={() => downloadFile(doc)}
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => deleteFile(doc)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
