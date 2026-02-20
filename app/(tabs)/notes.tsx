import { ScrollView, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { useNotes } from '@/lib/notes-context';
import { Note } from '@/lib/types';

export default function NotesScreen() {
  const { notes, getNotesByTopic, addNote, updateNote, deleteNote } = useNotes();
  const [topicId] = useState('demo-topic-1');
  const [topicNotes, setTopicNotes] = useState<Note[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const notes = getNotesByTopic(topicId);
    setTopicNotes(notes);
  }, [notes, topicId]);

  const handleAddNote = async () => {
    if (noteContent.trim()) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        topicId,
        content: noteContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addNote(newNote);
      setNoteContent('');
      setShowEditor(false);
    }
  };

  const handleUpdateNote = async () => {
    if (editingNote && noteContent.trim()) {
      const updated: Note = {
        ...editingNote,
        content: noteContent,
        updatedAt: new Date(),
      };

      await updateNote(updated);
      setNoteContent('');
      setEditingNote(null);
      setShowEditor(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setShowEditor(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
    setNoteContent('');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">Apuntes</Text>
              <Text className="text-sm text-muted mt-1">Tema: Variables y Tipos de Datos</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowEditor(true)}
              className="bg-primary rounded-lg px-4 py-2 active:opacity-80"
            >
              <Text className="text-white font-semibold text-sm">+ Nuevo</Text>
            </TouchableOpacity>
          </View>

          {/* Notes List */}
          {topicNotes.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 items-center gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Sin apuntes</Text>
              <Text className="text-sm text-muted text-center">
                Crea tus primeros apuntes para este tema
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {topicNotes.map((note) => (
                <View
                  key={note.id}
                  className="bg-surface rounded-lg p-4 border border-border gap-3"
                >
                  <View className="flex-row items-start justify-between">
                    <Text className="text-xs text-muted flex-1">
                      {new Date(note.createdAt).toLocaleDateString('es-ES')}
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEditNote(note)}
                        className="active:opacity-80"
                      >
                        <Text className="text-sm text-primary font-semibold">Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteNote(note.id)}
                        className="active:opacity-80"
                      >
                        <Text className="text-sm text-error font-semibold">Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-sm text-foreground leading-relaxed">
                    {note.content}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          <View className="bg-secondary bg-opacity-10 border border-secondary rounded-lg p-4">
            <Text className="text-sm text-foreground font-semibold">💡 Consejo</Text>
            <Text className="text-xs text-muted mt-2">
              Toma notas mientras estudias. Estas notas se usarán para generar cuestionarios personalizados.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Note Editor Modal */}
      <Modal visible={showEditor} animationType="slide" transparent={true}>
        <ScreenContainer className="p-6 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl font-bold text-foreground">
                {editingNote ? 'Editar apunte' : 'Nuevo apunte'}
              </Text>
              <TouchableOpacity onPress={handleCloseEditor} className="active:opacity-80">
                <Text className="text-2xl text-muted">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-background border border-border rounded-lg overflow-hidden">
              <TextInput
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                numberOfLines={10}
                placeholder="Escribe tus apuntes aquí..."
                placeholderTextColor="#999"
                className="p-4 text-foreground"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCloseEditor}
                className="flex-1 border border-border rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-foreground font-semibold text-center">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={editingNote ? handleUpdateNote : handleAddNote}
                className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">
                  {editingNote ? 'Guardar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
