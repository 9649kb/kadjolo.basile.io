
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, 
  Mic, Paperclip, X, Play, Pause, FileText, Bell, CornerDownRight, 
  LogIn, StopCircle, Trash2, Globe, Palette, Type, ChevronDown,
  Pin, PinOff, HelpCircle, ShieldCheck, Edit3, Save, Check
} from 'lucide-react';
import { Post, TextStyle } from '../types';
import { notifyCommunity, notifyCommentReply } from '../services/notificationService';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import SocialShare from '../components/SocialShare';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: string;
  style?: TextStyle;
  isAdmin?: boolean;
}

const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Bleu', value: '#2563eb' },
  { name: 'Vert', value: '#16a34a' },
  { name: 'Or', value: '#d4af37' },
  { name: 'Violet', value: '#8b5cf6' }
];

const FONTS = [
  { name: 'Sans', value: 'font-sans' },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Mono', value: 'font-mono' }
];

const Community: React.FC = () => {
  const { user: currentUser } = useUser();
  const { posts, addPost, updatePost, deletePost, togglePinPost } = useData();
  const [newPostContent, setNewPostContent] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isFounder;
  const isCreator = currentUser?.role === 'creator';

  // États de Style
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isQuestionMode, setIsQuestionMode] = useState(false);

  // Édition
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // États de l'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [attachment, setAttachment] = useState<{type: 'image' | 'file' | 'audio', url: string, name?: string} | null>(null);
  
  // États de la lecture audio
  const audioPlayer = useRef<HTMLAudioElement>(new Audio());
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  
  // Section Commentaires
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentStyle, setCommentStyle] = useState<TextStyle>({ color: '#000000', fontFamily: 'sans' });
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    'p1': [
      { id: 'c1', userId: 'u5', userName: 'Thomas L.', avatar: 'https://picsum.photos/50/50?random=10', text: "Exactement ce qu'il me fallait entendre ce matin !", timestamp: 'Il y a 1h', style: { color: '#2563eb', fontFamily: 'serif' } },
      { id: 'c2', userId: 'u1', userName: 'Kadjolo Basile', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300', text: "Le leadership commence par soi-même.", timestamp: 'Il y a 30min', isAdmin: true }
    ]
  });
  
  const [shareData, setShareData] = useState<{url: string, title: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tri des posts : Épinglés en haut, puis par date décroissante
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [posts]);

  useEffect(() => {
    const audio = audioPlayer.current;
    const updateProgress = () => { if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100); };
    const handleEnded = () => { setPlayingAudioId(null); setAudioProgress(0); };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAttachment({ type: 'audio', url: audioUrl, name: `Vocal_${new Date().toLocaleTimeString()}` });
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("Accès micro refusé.");
    }
  };

  const stopRecording = () => { if (mediaRecorder && isRecording) { mediaRecorder.stop(); setIsRecording(false); } };

  const handlePost = async () => {
    if (!currentUser || (!newPostContent.trim() && !attachment)) return;
    setIsNotifying(true);
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'À l\'instant',
      likedByMe: false,
      isPinned: isAdmin && isQuestionMode,
      isQuestion: isAdmin && isQuestionMode,
      style: { color: selectedColor, fontFamily: selectedFont },
      ...(attachment?.type === 'image' ? { image: attachment.url } : {}),
      ...(attachment?.type === 'audio' ? { audioUrl: attachment.url, attachmentType: 'audio' } : {}),
      ...(attachment?.type === 'file' ? { attachmentUrl: attachment.url, attachmentType: 'file' } : {}),
    };
    
    addPost(newPost);
    await notifyCommunity(currentUser.name, newPostContent.substring(0, 50));
    setIsNotifying(false);
    setNewPostContent('');
    setAttachment(null);
    setSelectedColor('#000000');
    setSelectedFont('sans');
    setIsQuestionMode(false);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = () => {
    if (editingPostId && editContent.trim()) {
      updatePost(editingPostId, editContent);
      setEditingPostId(null);
    }
  };

  const toggleAudio = (id: string, url: string) => {
    const audio = audioPlayer.current;
    if (playingAudioId === id) { audio.pause(); setPlayingAudioId(null); }
    else { if (audio.src !== url) { audio.src = url; audio.load(); } audio.play(); setPlayingAudioId(id); }
  };

  const handleSendComment = async (postId: string) => {
    if (!currentUser || !commentInput.trim()) return;
    const newComment: Comment = { 
      id: Date.now().toString(), 
      userId: currentUser.id, 
      userName: currentUser.name, 
      avatar: currentUser.avatar, 
      text: commentInput, 
      timestamp: 'À l\'instant',
      style: { ...commentStyle },
      isAdmin: currentUser.role === 'admin' || currentUser.isFounder
    };
    setCommentsMap({ ...commentsMap, [postId]: [...(commentsMap[postId] || []), newComment] });
    setCommentInput('');
    setCommentStyle({ color: '#000000', fontFamily: 'sans' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      setAttachment({ type, url: URL.createObjectURL(file), name: file.name });
    }
  };

  const getFontClass = (font?: string) => {
    if (font === 'serif') return 'font-serif';
    if (font === 'mono') return 'font-mono';
    return 'font-sans';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-brand-black tracking-tighter uppercase italic">Communauté</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Espace d'échange Élite</p>
        </div>
        {isNotifying && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full animate-pulse border border-brand-blue/20">
            <Bell size={12} /> Diffusion en cours...
          </div>
        )}
      </div>

      {/* Créer un Post */}
      {currentUser ? (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative group transition-all hover:shadow-xl">
          <div className="flex gap-5">
            <img src={currentUser.avatar} alt="Me" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-gray-50 shadow-md" />
            <div className="flex-1">
              
              {/* BARRE DE STYLE */}
              <div className="flex flex-wrap items-center gap-4 mb-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                  {COLORS.map(c => (
                    <button 
                      key={c.value} 
                      onClick={() => setSelectedColor(c.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c.value ? 'border-gray-400 scale-110 shadow-sm' : 'border-transparent'}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                   {FONTS.map(f => (
                     <button 
                       key={f.value}
                       onClick={() => setSelectedFont(f.value.replace('font-', '') as any)}
                       className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedFont === f.value.replace('font-', '') ? 'bg-brand-black text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                     >
                       {f.name}
                     </button>
                   ))}
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => setIsQuestionMode(!isQuestionMode)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isQuestionMode ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-orange-500 border border-orange-100'}`}
                  >
                    <HelpCircle size={14}/> Question Épinglée
                  </button>
                )}
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={isQuestionMode ? "Posez une question officielle à la communauté..." : "Exprimez-vous avec style..."}
                className={`w-full bg-brand-gray rounded-[24px] p-5 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 resize-none h-28 text-sm transition-all ${getFontClass(selectedFont)}`}
                style={{ color: selectedColor }}
              />
              
              {attachment && (
                <div className="mt-4 bg-blue-50 p-4 rounded-2xl flex items-center justify-between border border-blue-100">
                  <div className="flex items-center gap-3 text-sm text-brand-blue">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      {attachment.type === 'image' && <ImageIcon size={20} />}
                      {attachment.type === 'file' && <FileText size={20} />}
                      {attachment.type === 'audio' && <Mic size={20} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xs truncate max-w-[200px] uppercase tracking-wider">{attachment.name || 'Fichier joint'}</p>
                      <p className="text-[10px] font-bold opacity-60">Prêt pour publication</p>
                    </div>
                  </div>
                  <button onClick={() => setAttachment(null)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl transition-colors shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-5">
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-2xl transition-all shadow-sm group/btn">
                    <Paperclip size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                     onClick={isRecording ? stopRecording : startRecording}
                     className={`p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${isRecording ? 'bg-red-600 text-white animate-pulse px-6 shadow-red-500/30' : 'bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-blue-50'}`}
                  >
                    {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                    {isRecording && <span className="text-[10px] font-black uppercase tracking-widest">{formatDuration(recordingDuration)}</span>}
                  </button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={(!newPostContent.trim() && !attachment) || isNotifying}
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 transition-all shadow-xl ${isQuestionMode ? 'bg-orange-600 text-white' : 'bg-brand-black text-white'}`}
                >
                  {isNotifying ? 'Publication...' : isQuestionMode ? 'Lancer la question' : 'Publier'} <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-blue text-white p-10 rounded-[40px] text-center shadow-2xl">
           <LogIn size={28} className="mx-auto mb-4" />
           <h3 className="text-2xl font-black mb-2 uppercase italic">Rejoignez l'élite</h3>
           <p className="text-blue-100 text-sm mb-8">Connectez-vous pour échanger avec la communauté.</p>
           <Link to="/login" className="bg-white text-brand-blue px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest inline-block shadow-xl">Accéder maintenant</Link>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-8 mt-12">
        {sortedPosts.map(post => {
          const isOwnPost = currentUser?.id === post.author.id;
          const canEdit = isOwnPost && (isAdmin || isCreator);
          const canDelete = isAdmin || isOwnPost;

          return (
            <div 
              key={post.id} 
              className={`bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in transition-all relative overflow-hidden ${post.isPinned ? 'ring-2 ring-brand-blue/30 border-brand-blue/20' : ''}`}
            >
              {post.isPinned && (
                <div className="absolute top-0 right-0">
                   <div className="bg-brand-blue text-white px-6 py-1.5 rounded-bl-3xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                     <Pin size={10} fill="white"/> Épinglé par l'admin
                   </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-4 ring-gray-50" />
                  <div>
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight flex items-center gap-2">
                      {post.author.name}
                      {(post.author.role === 'admin' || post.author.isFounder) && <ShieldCheck size={14} className="text-brand-blue" fill="currentColor" color="white" />}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {post.timestamp} {post.isEdited && <span className="italic font-medium ml-1">(modifié)</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isAdmin && (
                    <button 
                      onClick={() => togglePinPost(post.id)}
                      className={`p-2 rounded-xl transition-colors ${post.isPinned ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-300 hover:text-brand-blue'}`}
                      title={post.isPinned ? "Désépingler" : "Épingler en haut"}
                    >
                      {post.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                    </button>
                  )}
                  {canEdit && editingPostId !== post.id && (
                    <button 
                      onClick={() => handleStartEdit(post)}
                      className="p-2 text-gray-300 hover:text-brand-blue transition-colors"
                      title="Modifier"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => { if(confirm('Supprimer ce message ?')) deletePost(post.id); }}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* CONTENU DU POST */}
              <div className={`mb-6 p-4 rounded-3xl ${post.isQuestion ? 'bg-orange-50 border border-orange-100' : ''}`}>
                {post.isQuestion && <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-1"><HelpCircle size={10}/> Question Officielle</p>}
                
                {editingPostId === post.id ? (
                  <div className="space-y-3 animate-in fade-in">
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setEditingPostId(null)} className="px-4 py-2 text-xs font-black text-gray-400 uppercase">Annuler</button>
                       <button onClick={handleSaveEdit} className="bg-brand-black text-white px-6 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg"><Save size={14}/> Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-base leading-relaxed font-medium whitespace-pre-wrap ${getFontClass(post.style?.fontFamily)}`} style={{ color: post.style?.color || '#374151' }}>
                    {post.content}
                  </p>
                )}
              </div>

              {!editingPostId && post.image && (
                <div className="rounded-[32px] overflow-hidden mb-6 border border-gray-100">
                  <img src={post.image} alt="Contenu" className="w-full h-auto max-h-[500px] object-cover" />
                </div>
              )}
              
              {!editingPostId && post.attachmentType === 'audio' && post.audioUrl && (
                <div className="bg-brand-gray p-6 rounded-[32px] mb-6 border border-gray-100 flex items-center gap-5">
                  <button 
                    onClick={() => toggleAudio(post.id, post.audioUrl!)}
                    className="w-14 h-14 bg-brand-black text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-all"
                  >
                    {playingAudioId === post.id ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-blue transition-all duration-150" 
                        style={{ width: `${playingAudioId === post.id ? audioProgress : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Message Vocal</span>
                      <span>{playingAudioId === post.id ? "Lecture en cours" : "Prêt"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
                <button onClick={() => {}} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${post.likedByMe ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                  <Heart size={20} fill={post.likedByMe ? "currentColor" : "none"} />
                  <span>{post.likes}</span>
                </button>
                <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${activeCommentPostId === post.id ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue'}`}>
                  <MessageCircle size={20} />
                  <span>{commentsMap[post.id]?.length || post.comments}</span>
                </button>
                <button 
                  onClick={() => setShareData({ url: `${window.location.origin}/#/community?post=${post.id}`, title: `Post de ${post.author.name}` })}
                  className="flex items-center gap-2 text-gray-400 hover:text-brand-black transition-all text-xs font-black uppercase tracking-widest ml-auto"
                >
                  <Share2 size={20} />
                  <span className="hidden sm:inline">Partager</span>
                </button>
              </div>

              {activeCommentPostId === post.id && (
                <div className="mt-8 pt-8 border-t border-gray-50 animate-in slide-in-from-top-4">
                  <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {commentsMap[post.id]?.map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <img src={comment.avatar} alt={comment.userName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div className={`p-5 rounded-[24px] rounded-tl-none flex-1 ${comment.isAdmin ? 'bg-blue-50 border border-blue-100 ring-2 ring-blue-100/50 shadow-sm' : 'bg-brand-gray'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-gray-900 text-xs uppercase tracking-tight flex items-center gap-2">
                              {comment.userName}
                              {comment.isAdmin && <span className="bg-brand-blue text-white text-[7px] px-1.5 py-0.5 rounded-full uppercase tracking-[0.2em] font-black flex items-center gap-1"><Check size={8}/> RÉPONSE OFFICIELLE</span>}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{comment.timestamp}</span>
                          </div>
                          <p className={`text-sm font-medium leading-relaxed ${getFontClass(comment.style?.fontFamily)}`} style={{ color: comment.style?.color || '#4b5563' }}>
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 w-fit">
                         <div className="flex gap-1 border-r pr-2">
                           {COLORS.slice(0, 4).map(c => (
                             <button key={c.value} onClick={() => setCommentStyle({...commentStyle, color: c.value})} className={`w-4 h-4 rounded-full ${commentStyle.color === c.value ? 'ring-2 ring-gray-400' : ''}`} style={{backgroundColor: c.value}} />
                           ))}
                         </div>
                         <button onClick={() => setCommentStyle({...commentStyle, fontFamily: commentStyle.fontFamily === 'serif' ? 'sans' : 'serif'})} className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${commentStyle.fontFamily === 'serif' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                           {commentStyle.fontFamily === 'serif' ? 'Serif' : 'Sans'}
                         </button>
                      </div>

                      <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
                        <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-lg" />
                        <input 
                          type="text" 
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                          placeholder={post.isQuestion ? "Répondez à la question..." : "Écrivez votre réponse..."}
                          className={`flex-1 bg-transparent border-none px-2 py-2 text-sm outline-none ${getFontClass(commentStyle.fontFamily)}`}
                          style={{ color: commentStyle.color }}
                        />
                        <button onClick={() => handleSendComment(post.id)} disabled={!commentInput.trim()} className="p-2 bg-brand-black text-white rounded-xl shadow-lg disabled:opacity-30">
                          <CornerDownRight size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-[10px] text-gray-400 font-black uppercase">Connectez-vous pour répondre.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {shareData && <SocialShare url={shareData.url} title={shareData.title} onClose={() => setShareData(null)} />}
    </div>
  );
};

export default Community;
