import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { TAG_COLORS } from './tagConstants';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagManagerProps {
  selectedTags: string[];
  availableTags: Tag[];
  onUpdate: (tags: string[]) => void;
  onUpdateAvailableTags?: (tags: Tag[]) => void;
  showEditMode?: boolean;
  className?: string;
}

export function TagManager({
  selectedTags,
  availableTags,
  onUpdate,
  onUpdateAvailableTags,
  showEditMode = true,
  className = ''
}: TagManagerProps) {
  const [tagSearch, setTagSearch] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [editMode, setEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  );

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const newTagObj: Tag = {
        id: Date.now().toString(),
        name: newTag.trim(),
        color: selectedColor
      };
      
      if (onUpdateAvailableTags) {
        onUpdateAvailableTags([...availableTags, newTagObj]);
      }
      
      onUpdate([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addAvailableTag = (tag: Tag) => {
    if (!selectedTags.includes(tag.name)) {
      onUpdate([...selectedTags, tag.name]);
    }
  };

  const startEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditingTagName(tag.name);
    setSelectedColor(tag.color);
    setEditMode(true);
  };

  const saveEditTag = () => {
    if (editingTag && editingTagName.trim()) {
      const updatedTags = availableTags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name: editingTagName.trim(), color: selectedColor }
          : tag
      );
      
      if (onUpdateAvailableTags) {
        onUpdateAvailableTags(updatedTags);
      }
      
      // Update selected tags if the name changed
      if (selectedTags.includes(editingTag.name)) {
        onUpdate(selectedTags.map(tag => 
          tag === editingTag.name ? editingTagName.trim() : tag
        ));
      }
      
      setEditingTag(null);
      setEditingTagName('');
      setEditMode(false);
    }
  };

  const cancelEditTag = () => {
    setEditingTag(null);
    setEditingTagName('');
    setEditMode(false);
  };

  const deleteTag = (tagId: string) => {
    const tagToDelete = availableTags.find(tag => tag.id === tagId);
    if (tagToDelete) {
      const updatedTags = availableTags.filter(tag => tag.id !== tagId);
      
      if (onUpdateAvailableTags) {
        onUpdateAvailableTags(updatedTags);
      }
      
      // Remove from selected tags if it was selected
      if (selectedTags.includes(tagToDelete.name)) {
        onUpdate(selectedTags.filter(tag => tag !== tagToDelete.name));
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-white rounded-lg border border-slate-200">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-slate-400">Clique nas tags abaixo para adicionar</span>
        ) : (
          selectedTags.map((tagName) => {
            const tag = availableTags.find(t => t.name === tagName);
            return (
              <Badge 
                key={tagName} 
                className={`${tag?.color || 'bg-slate-400'} text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {tagName}
                <X 
                  className="h-3 w-3 ml-1 hover:text-red-200" 
                  onClick={() => removeTag(tagName)} 
                />
              </Badge>
            );
          })
        )}
      </div>

      {/* Tags disponíveis */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">Tags disponíveis:</p>
          <Input
            placeholder="Pesquisar..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="h-7 text-xs w-32 border-slate-200"
          />
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-white rounded-lg border border-slate-200">
          {filteredTags.map((tag) => (
            <Badge
              key={tag.id}
              className={`${tag.color} text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => addAvailableTag(tag)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input para adicionar nova tag */}
      <div className="flex gap-2">
        <Input
          placeholder="Nova tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-1 border-slate-200"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-32 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAG_COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color.value}`} />
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addTag} 
          disabled={!newTag.trim()}
          className="border-slate-200 hover:bg-slate-50"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Modo de edição de tags (opcional) */}
      {showEditMode && (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Gerenciar Tags</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="text-slate-400 hover:text-slate-600 h-6 px-2"
          >
            <Edit2 className="h-3 w-3 mr-1" />
            {editMode ? 'Voltar' : 'Editar'}
          </Button>
        </div>
      )}

      {editMode && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableTags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 bg-white rounded-md border border-slate-200">
              {editingTag?.id === tag.id ? (
                <>
                  <Input
                    value={editingTagName}
                    onChange={(e) => setEditingTagName(e.target.value)}
                    className="flex-1 h-7 text-xs border-slate-200"
                  />
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-20 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.value}`} />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" size="sm" onClick={saveEditTag} className="h-7 text-xs">
                    Salvar
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={cancelEditTag} className="h-7 text-xs">
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                  <span className="flex-1 text-xs">{tag.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditTag(tag)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTag(tag.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
