
import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Mic, Paperclip, X, Play, Pause, FileText, Bell, CornerDownRight, LogIn } from 'lucide-react';
import { posts as initialPosts } from '../services/mockData';
import { Post } from '../types';
import { notifyCommunity, notifyCommentReply } from '../services/notificationService';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

// Define a simple structure for local comments handling
interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: string;
}

const Community: React.FC = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<{type: 'image' | 'file' | 'audio', url: string, name?: string} | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  
  // Comment Section State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  // Mock comments storage
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    'p1': [
      { id: 'c1', userId: 'u5', userName: 'Thomas L.', avatar: 'https://picsum.photos/50/50?random=10', text: "Exactement ce qu'il me fallait entendre ce matin !", timestamp: 'Il y a 1h' },
      { id: 'c2', userId: 'u6', userName: 'Sophie M.', avatar: 'https://picsum.photos/50/50?random=11', text: "Le leadership commence par soi-même.", timestamp: 'Il y a 30min' }
    ]
  });
  
  // Simulated Audio Player State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (!currentUser || (!newPostContent.trim() && !attachment)) return;
    
    setIsNotifying(true);

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'A l\'instant',
      likedByMe: false,
      ...(attachment?.type === 'image' ? { image: attachment.url } : {}),
      ...(attachment?.type === 'audio' ? { audioUrl: attachment.url, attachmentType: 'audio' } : {}),
      ...(attachment?.type === 'file' ? { attachmentUrl: attachment.url, attachmentType: 'file' } : {}),
    };

    setPosts([newPost, ...posts]);
    
    // Simulate Notification
    await notifyCommunity(currentUser.name, newPostContent.substring(0, 50));
    setIsNotifying(false);

    setNewPostContent('');
    setAttachment(null);
  };

  const handleLike = (postId: string) => {
    if (!currentUser) return; // Optionally prompt login
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          likedByMe: !post.likedByMe
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
    }
  };

  const handleSendComment = async (postId: string) => {
    if (!currentUser || !commentInput.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: commentInput,
      timestamp: 'À l\'instant'
    };

    // Update comments map
    const existingComments = commentsMap[postId] || [];
    setCommentsMap({
      ...commentsMap,
      [postId]: [...existingComments, newComment]
    });

    // Update post comment count
    setPosts(posts.map(p => p.id === postId ? {...p, comments: p.comments + 1} : p));
    setCommentInput('');

    // --- NOTIFICATION LOGIC ---
    // If there are other people in the thread, notify them (simulated)
    if (existingComments.length > 0) {
      const lastCommenter = existingComments[existingComments.length - 1];
      // Don't notify self
      if (lastCommenter.userId !== currentUser.id) {
        const postTitle = posts.find(p => p.id === postId)?.content.substring(0, 30) || 'Post';
        await notifyCommentReply(lastCommenter.userName, currentUser.name, postTitle);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate file upload
      const file = e.target.files[0];
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      const url = URL.createObjectURL(file);
      setAttachment({ type, url, name: file.name });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording simulation
      setIsRecording(false);
      setAttachment({ type: 'audio', url: 'mock_audio_blob', name: 'Message Vocal' });
    } else {
      setIsRecording(true);
    }
  };

  const toggleAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-black">Communauté</h1>
          <p className="text-gray-500">Échangez avec les membres de l'élite</p>
        </div>
        {isNotifying && (
          <div className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full animate-pulse">
            <Bell size={12} /> Notification des membres...
          </div>
        )}
      </div>

      {/* Create Post - Only if Logged In */}
      {currentUser ? (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
          <div className="flex gap-4">
            <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-blue/10" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Partagez vos réussites, fichiers ou audio... (Une notification sera envoyée)"
                className="w-full bg-brand-gray rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none h-24 text-sm text-brand-black"
              />
              
              {/* Attachment Preview */}
              {attachment && (
                <div className="mt-2 bg-gray-50 p-2 rounded flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {attachment.type === 'image' && <ImageIcon size={16} />}
                    {attachment.type === 'file' && <Paperclip size={16} />}
                    {attachment.type === 'audio' && <Mic size={16} />}
                    <span className="truncate max-w-xs">{attachment.name || 'Fichier joint'}</span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors"
                    title="Image ou Fichier"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button 
                     onClick={toggleRecording}
                     className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-brand-blue hover:bg-blue-50'}`}
                     title="Message Vocal"
                  >
                    <Mic size={20} />
                  </button>
                  {isRecording && <span className="text-xs text-red-500 self-center font-bold">Enregistrement...</span>}
                </div>
                <button 
                  onClick={handlePost}
                  disabled={(!newPostContent.trim() && !attachment) || isNotifying}
                  className="bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isNotifying ? 'Envoi...' : 'Publier'} <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100 flex flex-col items-center">
           <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
             <LogIn size={24} className="text-brand-blue" />
           </div>
           <h3 className="font-bold text-gray-900 mb-1">Rejoignez la discussion</h3>
           <p className="text-sm text-gray-500 mb-4">Connectez-vous pour publier, commenter et échanger avec la communauté.</p>
           <Link to="/login" className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">
             Se connecter
           </Link>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-brand-black text-sm">{post.author.name}</h3>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              {post.author.role === 'admin' && (
                <span className="bg-brand-blue/10 text-brand-blue text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Content Types Render */}
            {post.image && (
              <img src={post.image} alt="Post content" className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            
            {post.attachmentType === 'audio' && (
              <div className="flex items-center gap-3 bg-brand-gray p-3 rounded-lg mb-4 border border-gray-200">
                <button 
                  onClick={() => toggleAudio(post.id)}
                  className="w-10 h-10 bg-brand-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                >
                  {playingAudioId === post.id ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="flex-1">
                  <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div className={`h-full bg-brand-blue transition-all duration-1000 ${playingAudioId === post.id ? 'w-full' : 'w-0'}`}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">Message Vocal • 0:45</span>
                </div>
              </div>
            )}

            {post.attachmentType === 'file' && (
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                <div className="p-2 bg-blue-200 text-blue-700 rounded">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-blue hover:underline cursor-pointer">Document_Partagé.pdf</p>
                  <p className="text-xs text-blue-400">1.2 MB • PDF</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 text-sm transition-colors ${post.likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart size={18} fill={post.likedByMe ? "currentColor" : "none"} />
                <span>{post.likes}</span>
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className={`flex items-center gap-2 text-sm transition-colors ${activeCommentPostId === post.id ? 'text-brand-blue font-bold' : 'text-gray-500 hover:text-brand-blue'}`}
              >
                <MessageCircle size={18} />
                <span>{commentsMap[post.id] ? commentsMap[post.id].length : post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-brand-black transition-colors text-sm ml-auto">
                <Share2 size={18} />
                <span>Partager</span>
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === post.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4 mb-4">
                  {commentsMap[post.id] && commentsMap[post.id].map(comment => (
                    <div key={comment.id} className="flex gap-3 text-sm">
                      <img src={comment.avatar} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
                      <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-brand-black">{comment.userName}</span>
                          <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {(!commentsMap[post.id] || commentsMap[post.id].length === 0) && (
                    <p className="text-xs text-gray-400 text-center italic">Soyez le premier à commenter</p>
                  )}
                </div>

                {currentUser ? (
                  <div className="flex gap-2 items-center">
                    <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full" />
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="Répondre au fil de discussion..."
                        className="w-full bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                      <button 
                        onClick={() => handleSendComment(post.id)}
                        disabled={!commentInput.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-brand-blue hover:text-blue-700 disabled:text-gray-400"
                      >
                        <CornerDownRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-400">
                    <Link to="/login" className="text-brand-blue hover:underline">Connectez-vous</Link> pour répondre.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
