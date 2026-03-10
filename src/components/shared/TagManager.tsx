import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Edit2, Trash2, Check, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [editMode, setEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  );

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

      if (selectedTags.includes(tagToDelete.name)) {
        onUpdate(selectedTags.filter(tag => tag !== tagToDelete.name));
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagSearch.trim()) {
      e.preventDefault();
      const existingAvailable = availableTags.find(t => t.name.toLowerCase() === tagSearch.trim().toLowerCase());
      if (existingAvailable) {
        if (!selectedTags.includes(existingAvailable.name)) {
          addAvailableTag(existingAvailable);
        }
      } else {
        const newTagObj: Tag = {
          id: Date.now().toString(),
          name: tagSearch.trim(),
          color: selectedColor
        };
        if (onUpdateAvailableTags) {
          onUpdateAvailableTags([...availableTags, newTagObj]);
        }
        onUpdate([...selectedTags, newTagObj.name]);
      }
      setTagSearch('');
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Create */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pesquisar ou criar nova tag..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="pl-10 h-11 border-slate-200 bg-white shadow-sm focus:ring-indigo-500"
          />
          {tagSearch.trim() && !availableTags.find(t => t.name.toLowerCase() === tagSearch.trim().toLowerCase()) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", selectedColor)} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSearchKeyPress({ key: 'Enter', preventDefault: () => { } } as any)}
                className="h-7 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50"
              >
                CRIAR NOVA
              </Button>
            </div>
          )}
        </div>

        {/* Color Picker for Creation */}
        {tagSearch.trim() && !availableTags.find(t => t.name.toLowerCase() === tagSearch.trim().toLowerCase()) && (
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-md border border-slate-100">
            {TAG_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all border-2",
                  selectedColor === color.value ? "border-slate-400 scale-110 shadow-sm" : "border-transparent hover:scale-105"
                )}
                title={color.name}
              >
                <div className={cn("w-full h-full rounded-full", color.value)} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tags */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selecionadas</Label>
        <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          {selectedTags.length === 0 ? (
            <div className="flex items-center justify-center w-full py-2">
              <span className="text-xs text-slate-400 italic">Nenhuma tag selecionada</span>
            </div>
          ) : (
            selectedTags.map((tagName) => {
              const tag = availableTags.find(t => t.name === tagName);
              return (
                <Badge
                  key={tagName}
                  className={cn(
                    tag?.color || 'bg-slate-400',
                    "text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:brightness-110"
                  )}
                >
                  {tagName}
                  <button
                    type="button"
                    onClick={() => removeTag(tagName)}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              );
            })
          )}
        </div>
      </div>

      {/* Available Tags Suggestion */}
      {!tagSearch && filteredTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sugestões</Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {filteredTags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addAvailableTag(tag)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-sm group"
              >
                <div className={cn("w-2 h-2 rounded-full", tag.color)} />
                {tag.name}
                <Plus className="h-3 w-3 text-slate-300 group-hover:text-indigo-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Mode Section */}
      {showEditMode && (
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
            >
              <Settings className="h-3 w-3" />
              {editMode ? 'FECHAR GERENCIAMENTO' : 'GERENCIAR TODAS AS TAGS'}
            </button>
          </div>

          {editMode && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {availableTags.map((tag) => (
                <div key={tag.id} className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all shadow-sm">
                  {editingTag?.id === tag.id ? (
                    <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex gap-2">
                        <Input
                          autoFocus
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="flex-1 h-9 text-sm"
                        />
                        <Button type="button" size="sm" onClick={saveEditTag} className="h-9 bg-indigo-600 font-bold">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={cancelEditTag} className="h-9">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setSelectedColor(color.value)}
                            className={cn(
                              "w-5 h-5 rounded-full border-2",
                              selectedColor === color.value ? "border-indigo-500 scale-110 shadow-sm" : "border-transparent"
                            )}
                          >
                            <div className={cn("w-full h-full rounded-full", color.value)} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={cn("w-3 h-3 rounded-full shadow-sm", tag.color)} />
                      <span className="flex-1 text-sm font-semibold text-slate-700">{tag.name}</span>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditTag(tag)}
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTag(tag.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
