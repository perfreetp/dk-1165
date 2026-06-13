import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Upload, 
  FolderOpen, 
  Trash2, 
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Material, Folder } from '../types';

export function MaterialsPage() {
  const { materials, folders, addMaterial, deleteMaterial, addFolder, deleteFolder } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);

  const filteredMaterials = selectedFolder === 'all'
    ? materials
    : materials.filter(m => m.folderId === selectedFolder);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const material: Material = {
            id: `material-${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            name: file.name,
            folderId: selectedFolder === 'all' ? 'default' : selectedFolder,
            relatedIdeas: [],
            createdAt: Date.now(),
          };
          addMaterial(material);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        parentId: null,
      };
      addFolder(folder);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">素材板</h1>
        <p className="text-slate-400">上传和管理参考图片素材</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1"
        >
          <div className="card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-100">素材夹</h3>
              </div>
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="p-1 rounded hover:bg-dark-200 text-slate-400 hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {isCreatingFolder && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="文件夹名称"
                  className="input-field flex-1"
                  autoFocus
                />
                <button
                  onClick={handleCreateFolder}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  selectedFolder === 'all'
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-400 hover:bg-dark-200 hover:text-slate-100'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="flex-1">全部素材</span>
                <span className="text-xs">{materials.length}</span>
              </button>

              {folders.map(folder => (
                <div key={folder.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      selectedFolder === folder.id
                        ? 'bg-primary/20 text-primary'
                        : 'text-slate-400 hover:bg-dark-200 hover:text-slate-100'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span className="text-xs">
                      {materials.filter(m => m.folderId === folder.id).length}
                    </span>
                  </button>
                  {folder.id !== 'default' && (
                    <button
                      onClick={() => deleteFolder(folder.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-slate-500'}`} />
              <p className="text-xl font-medium text-slate-100 mb-2">
                {isDragging ? '释放以上传' : '拖拽图片到这里'}
              </p>
              <p className="text-slate-500 mb-4">或者点击按钮选择文件</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                选择图片
              </button>
            </div>
          </motion.div>

          {filteredMaterials.length === 0 ? (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-xl text-slate-400 mb-2">暂无素材</p>
              <p className="text-sm text-slate-500">上传图片开始你的素材库</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredMaterials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group overflow-hidden rounded-xl border border-slate-700 hover:border-primary/50 transition-all"
                >
                  <img
                    src={material.url}
                    alt={material.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm text-white font-medium truncate mb-2">
                        {material.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          {new Date(material.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                        <button
                          onClick={() => deleteMaterial(material.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
