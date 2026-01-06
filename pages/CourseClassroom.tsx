
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { 
  ChevronLeft, PlayCircle, CheckCircle, FileText, Lock, Menu, X, 
  ChevronDown, ChevronUp, Video, ArrowRight, ArrowLeft, Download, Maximize2, RotateCcw, Globe
} from 'lucide-react';
import { Course, Module, Lesson } from '../types';

const CourseClassroom: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, isEnrolled, markLessonComplete, getCourseProgress } = useData();
  const { user } = useUser();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Progress State
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Load Course and Progress
  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Load Progress
      if (user && courseId) {
        const progress = getCourseProgress(user.id, courseId);
        setCompletedLessons(progress.completedLessonIds);
        setProgressPercentage(progress.percentage);
      }

      // Initialize view (Open first module)
      if (foundCourse.modules && foundCourse.modules.length > 0) {
        const firstMod = foundCourse.modules[0];
        setExpandedModules([firstMod.id]);
        setActiveModuleId(firstMod.id);
        
        if (firstMod.lessons.length > 0) {
          setActiveLesson(firstMod.lessons[0]);
        }
      }
    }
  }, [courseId, courses, user, getCourseProgress]);

  // Security Check
  useEffect(() => {
    if (user && courseId && !isEnrolled(user.id, courseId)) {
        // If not enrolled, redirect to sales page
        navigate(`/product/${courseId}`); 
    }
  }, [user, courseId, isEnrolled, navigate]);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleLessonSelect = (lesson: Lesson, moduleId: string) => {
    setActiveLesson(lesson);
    setActiveModuleId(moduleId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const markComplete = () => {
    if (activeLesson && user && courseId) {
      // Optimistic update
      if (!completedLessons.includes(activeLesson.id)) {
        const newCompleted = [...completedLessons, activeLesson.id];
        setCompletedLessons(newCompleted);
        
        // Calculate new percentage locally for instant feedback
        const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
        setProgressPercentage(Math.round((newCompleted.length / totalLessons) * 100));
        
        // Persist to Context
        markLessonComplete(user.id, courseId, activeLesson.id);
      }
      navigateToNext();
    }
  };

  const navigateToNext = () => {
    if (!course || !activeLesson || !activeModuleId) return;

    const currentModIndex = course.modules?.findIndex(m => m.id === activeModuleId) ?? -1;
    const currentMod = course.modules![currentModIndex];
    const currentLessonIndex = currentMod.lessons.findIndex(l => l.id === activeLesson.id);

    // 1. Next lesson in same module
    if (currentLessonIndex < currentMod.lessons.length - 1) {
      setActiveLesson(currentMod.lessons[currentLessonIndex + 1]);
      return;
    }

    // 2. First lesson of next module
    if (currentModIndex < course.modules!.length - 1) {
      const nextMod = course.modules![currentModIndex + 1];
      if (nextMod.lessons.length > 0) {
        setActiveModuleId(nextMod.id);
        setExpandedModules(prev => [...prev, nextMod.id]);
        setActiveLesson(nextMod.lessons[0]);
      }
    }
  };

  const navigateToPrev = () => {
    if (!course || !activeLesson || !activeModuleId) return;

    const currentModIndex = course.modules?.findIndex(m => m.id === activeModuleId) ?? -1;
    const currentMod = course.modules![currentModIndex];
    const currentLessonIndex = currentMod.lessons.findIndex(l => l.id === activeLesson.id);

    if (currentLessonIndex > 0) {
      setActiveLesson(currentMod.lessons[currentLessonIndex - 1]);
      return;
    }

    if (currentModIndex > 0) {
      const prevMod = course.modules![currentModIndex - 1];
      if (prevMod.lessons.length > 0) {
        setActiveModuleId(prevMod.id);
        setExpandedModules(prev => [...prev, prevMod.id]);
        setActiveLesson(prevMod.lessons[prevMod.lessons.length - 1]);
      }
    }
  };

  // --- UNIVERSAL PLAYER RENDERER ---
  const renderVideoPlayer = (lesson: Lesson) => {
    const url = lesson.contentUrl;

    // 1. Local / Direct MP4 Upload
    if (lesson.hostingType === 'internal' || url.endsWith('.mp4') || url.endsWith('.webm')) {
      return (
        <video 
          key={lesson.id}
          controls 
          controlsList="nodownload"
          className="w-full h-full object-contain bg-black"
          poster={course?.image}
        >
          <source src={url} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      );
    }

    // 2. YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop()?.split('?')[0];
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`} 
          className="w-full h-full" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        />
      );
    }

    // 3. Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`} 
          className="w-full h-full" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
          title={lesson.title}
        />
      );
    }

    // 4. Google Drive (Convert view link to preview)
    if (url.includes('drive.google.com')) {
      const embedUrl = url.replace('/view', '/preview').replace('/share', '/preview');
      return (
        <iframe 
          src={embedUrl}
          className="w-full h-full" 
          allow="autoplay" 
          allowFullScreen
          title={lesson.title}
        />
      );
    }

    // 5. Loom (Extract embed URL)
    if (url.includes('loom.com')) {
        // Handle Loom share links
        const videoId = url.split('/share/')[1]?.split('?')[0] || url.split('/').pop();
        return (
            <iframe 
                src={`https://www.loom.com/embed/${videoId}`} 
                className="w-full h-full" 
                allowFullScreen 
                title={lesson.title}
            ></iframe>
        );
    }

    // 6. Dailymotion
    if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
        const videoId = url.split('/video/')[1]?.split('?')[0] || url.split('/').pop();
        return (
            <iframe 
                src={`https://www.dailymotion.com/embed/video/${videoId}`} 
                className="w-full h-full" 
                allowFullScreen 
                title={lesson.title}
            ></iframe>
        );
    }

    // 7. Fallback / Universal Link
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
        <Globe size={48} className="mb-4 opacity-50"/>
        <h3 className="text-xl font-bold mb-2">Contenu Externe</h3>
        <p className="mb-6 max-w-md text-gray-400">Ce contenu est hébergé sur une plateforme externe ({new URL(url).hostname}).</p>
        <a href={url} target="_blank" rel="noreferrer" className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg">
          Ouvrir le contenu <Maximize2 size={16}/>
        </a>
      </div>
    );
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans text-gray-100">
      
      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-800 bg-gray-900 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <ChevronLeft size={16} /> Retour Dashboard
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
              <X size={20} />
            </button>
          </div>
          <div>
             <h2 className="font-bold text-white leading-tight mb-2">{course.title}</h2>
             <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
               <div className="bg-green-500 h-full transition-all duration-500 ease-out" style={{width: `${progressPercentage}%`}}></div>
             </div>
             <p className="text-xs text-gray-500 mt-2 flex justify-between">
               <span>Progression</span>
               <span className="font-bold text-green-500">{progressPercentage}%</span>
             </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {course.modules?.map((mod, idx) => (
             <div key={mod.id} className="border-b border-gray-800">
               <button 
                 onClick={() => toggleModule(mod.id)}
                 className="w-full flex justify-between items-center p-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
               >
                 <div>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Module {idx + 1}</span>
                   <h4 className="font-bold text-gray-200 text-sm">{mod.title}</h4>
                 </div>
                 {expandedModules.includes(mod.id) ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
               </button>
               
               {expandedModules.includes(mod.id) && (
                 <div className="bg-gray-950/50">
                   {mod.lessons.map(lesson => {
                     const isActive = activeLesson?.id === lesson.id;
                     const isCompleted = completedLessons.includes(lesson.id);
                     return (
                       <button
                         key={lesson.id}
                         onClick={() => handleLessonSelect(lesson, mod.id)}
                         className={`w-full flex items-center gap-3 p-3 px-4 text-left transition-colors text-sm border-l-4 ${
                           isActive 
                             ? 'bg-brand-blue/10 border-brand-blue text-white' 
                             : 'border-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                         }`}
                       >
                         <div className={`mt-0.5 shrink-0`}>
                            {isCompleted ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle size={16} className={isActive ? 'text-brand-blue' : ''} />
                            ) : (
                              <FileText size={16} />
                            )}
                         </div>
                         <div className="flex-1">
                            <span className="line-clamp-2">{lesson.title}</span>
                            {lesson.duration && <span className="text-[10px] opacity-60 block">{lesson.duration}</span>}
                         </div>
                       </button>
                     );
                   })}
                 </div>
               )}
             </div>
           ))}
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
           <span className="font-bold truncate pr-4">{activeLesson?.title || course.title}</span>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-800 rounded">
             <Menu size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="max-w-5xl mx-auto w-full">
              
              <div className="bg-black w-full aspect-video relative shadow-2xl z-10">
                 {activeLesson.type === 'video' ? (
                    renderVideoPlayer(activeLesson)
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800 p-8">
                       <FileText size={64} className="mb-4 text-gray-600"/>
                       <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                       <p className="text-gray-400 mb-6">Document ou contenu texte.</p>
                       <a 
                         href={activeLesson.contentUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                       >
                         Ouvrir le contenu
                       </a>
                    </div>
                 )}
              </div>

              <div className="p-6 md:p-10 space-y-8">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
                    <div className="flex gap-2 w-full sm:w-auto">
                       <button 
                         onClick={navigateToPrev}
                         className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                       >
                         <ArrowLeft size={16}/> Précédent
                       </button>
                       <button 
                         onClick={navigateToNext}
                         className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                       >
                         Suivant <ArrowRight size={16}/>
                       </button>
                    </div>
                    
                    <button 
                      onClick={markComplete}
                      className={`px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all w-full sm:w-auto justify-center ${completedLessons.includes(activeLesson.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-black hover:bg-gray-800'}`}
                    >
                      {completedLessons.includes(activeLesson.id) ? (
                        <>Terminé <CheckCircle size={18}/></>
                      ) : (
                        <>Marquer comme terminé <CheckCircle size={18}/></>
                      )}
                    </button>
                 </div>

                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h1>
                    <div className="prose text-gray-600 max-w-none">
                       <p>Prenez des notes et assurez-vous d'avoir bien compris les concepts avant de passer à la suite.</p>
                    </div>
                 </div>

                 {/* Simulated Resources */}
                 <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Download size={18}/> Ressources jointes
                    </h3>
                    <div className="grid gap-2">
                       <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-3">
                             <FileText size={20} className="text-blue-500"/>
                             <span className="text-sm font-medium text-gray-700">Support de cours.pdf</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-bold">Télécharger</button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <RotateCcw size={48} className="mb-4 opacity-20"/>
               <p className="text-lg font-medium">Chargement du cours...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseClassroom;
