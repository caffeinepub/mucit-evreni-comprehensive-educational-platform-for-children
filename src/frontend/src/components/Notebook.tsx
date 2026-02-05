import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotebookProps {
  userId: string;
}

export default function Notebook({ userId }: NotebookProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [nextId, setNextId] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
    });
  };

  const handleAddNote = () => {
    if (!formData.title.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Lütfen not içeriği girin');
      return;
    }

    const newNote: Note = {
      id: nextId,
      title: formData.title,
      content: formData.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setNextId(nextId + 1);
    toast.success('Not başarıyla eklendi! 📝');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditNote = () => {
    if (!editingNote || !formData.title.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Lütfen not içeriği girin');
      return;
    }

    const updatedNote: Note = {
      ...editingNote,
      title: formData.title,
      content: formData.content,
      updatedAt: new Date(),
    };

    setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
    toast.success('Not başarıyla güncellendi! ✏️');
    setIsEditDialogOpen(false);
    setEditingNote(null);
    resetForm();
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success('Not silindi 🗑️');
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (note: Note) => {
    setViewingNote(note);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-300" />
            Not Defterim
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {notes.length} not
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Not
        </Button>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Henüz not yok</p>
            <p className="text-white/40 text-sm mt-2">
              İlk notunu ekleyerek başla!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => openViewDialog(note)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <p className="text-white/50 text-xs">
                    {format(note.updatedAt, 'd MMMM yyyy, HH:mm', { locale: tr })}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm line-clamp-3 mb-3">
                    {note.content}
                  </p>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(note)}
                      className="text-white hover:bg-white/20"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Add Note Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Yeni Not Ekle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Not başlığı..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div>
              <Label htmlFor="content" className="text-white">İçerik</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Notunu buraya yaz..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              className="text-white hover:bg-white/20"
            >
              İptal
            </Button>
            <Button
              onClick={handleAddNote}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Notu Düzenle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-white">Başlık</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Not başlığı..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-content" className="text-white">İçerik</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Notunu buraya yaz..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingNote(null);
                resetForm();
              }}
              className="text-white hover:bg-white/20"
            >
              İptal
            </Button>
            <Button
              onClick={handleEditNote}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingNote?.title}</DialogTitle>
            <p className="text-white/50 text-sm">
              {viewingNote && format(viewingNote.updatedAt, 'd MMMM yyyy, HH:mm', { locale: tr })}
            </p>
          </DialogHeader>
          
          <ScrollArea className="max-h-[400px] pr-4">
            <p className="text-white/90 whitespace-pre-wrap">
              {viewingNote?.content}
            </p>
          </ScrollArea>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsViewDialogOpen(false)}
              className="text-white hover:bg-white/20"
            >
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
