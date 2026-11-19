'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  ForumPost,
  ForumComment,
  EModul,
  MediaAjar,
  LkmAssignment,
  LkmSubmission,
  Quiz,
  QuizSubmission,
} from './types';
import {
  initialProfiles,
  initialPosts,
  initialModules,
  initialMedia,
  initialLkms,
  initialSubmissions,
  initialQuizzes,
} from './initialData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

interface PortalContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  isSupabaseMode: boolean;
  
  // Forum
  posts: ForumPost[];
  createPost: (title: string, content: string, category: ForumPost['category']) => void;
  updatePost: (id: string, title: string, content: string, category: ForumPost['category']) => void;
  deletePost: (id: string) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentId?: string | null) => void;
  deleteComment: (postId: string, commentId: string) => void;

  // E-Modul
  modules: EModul[];
  completedModuleIds: string[];
  createModule: (mod: Omit<EModul, 'id' | 'created_at' | 'updated_at'>) => void;
  updateModule: (id: string, mod: Partial<EModul>) => void;
  deleteModule: (id: string) => void;
  toggleModuleComplete: (moduleId: string) => void;

  // Media Ajar
  mediaList: MediaAjar[];
  createMedia: (media: Omit<MediaAjar, 'id' | 'created_at'>) => void;
  updateMedia: (id: string, media: Partial<MediaAjar>) => void;
  deleteMedia: (id: string) => void;

  // LKM
  lkms: LkmAssignment[];
  submissions: LkmSubmission[];
  createLkm: (lkm: Omit<LkmAssignment, 'id' | 'created_at'>) => void;
  updateLkm: (id: string, lkm: Partial<LkmAssignment>) => void;
  deleteLkm: (id: string) => void;
  submitLkmWork: (assignmentId: string, contentText: string, attachmentName?: string, attachmentUrl?: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Asesmen & Kuis
  quizzes: Quiz[];
  quizResults: QuizSubmission[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'created_at'>) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  recordQuizResult: (result: Omit<QuizSubmission, 'id' | 'student_id' | 'student_name' | 'submitted_at'>) => void;
  
  // Reset demo data
  resetDemoData: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'eduportal_data_v2_';

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialProfiles[0]); // Default Guru
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [modules, setModules] = useState<EModul[]>(initialModules);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(['modul-1']);
  const [mediaList, setMediaList] = useState<MediaAjar[]>(initialMedia);
  const [lkms, setLkms] = useState<LkmAssignment[]>(initialLkms);
  const [submissions, setSubmissions] = useState<LkmSubmission[]>(initialSubmissions);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [quizResults, setQuizResults] = useState<QuizSubmission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
      const savedPosts = localStorage.getItem(STORAGE_KEY_PREFIX + 'posts');
      const savedModules = localStorage.getItem(STORAGE_KEY_PREFIX + 'modules');
      const savedCompleted = localStorage.getItem(STORAGE_KEY_PREFIX + 'completed_modules');
      const savedMedia = localStorage.getItem(STORAGE_KEY_PREFIX + 'media');
      const savedLkms = localStorage.getItem(STORAGE_KEY_PREFIX + 'lkms');
      const savedSubmissions = localStorage.getItem(STORAGE_KEY_PREFIX + 'submissions');
      const savedQuizzes = localStorage.getItem(STORAGE_KEY_PREFIX + 'quizzes');
      const savedQuizResults = localStorage.getItem(STORAGE_KEY_PREFIX + 'quiz_results');

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      if (savedModules) setModules(JSON.parse(savedModules));
      if (savedCompleted) setCompletedModuleIds(JSON.parse(savedCompleted));
      if (savedMedia) setMediaList(JSON.parse(savedMedia));
      if (savedLkms) setLkms(JSON.parse(savedLkms));
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
      if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
      if (savedQuizResults) setQuizResults(JSON.parse(savedQuizResults));
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'posts', JSON.stringify(posts));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'modules', JSON.stringify(modules));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'completed_modules', JSON.stringify(completedModuleIds));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'media', JSON.stringify(mediaList));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'lkms', JSON.stringify(lkms));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'submissions', JSON.stringify(submissions));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'quizzes', JSON.stringify(quizzes));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'quiz_results', JSON.stringify(quizResults));
    } catch (e) {
      console.warn('Error writing to localStorage', e);
    }
  }, [
    isLoaded,
    currentUser,
    posts,
    modules,
    completedModuleIds,
    mediaList,
    lkms,
    submissions,
    quizzes,
    quizResults
  ]);

  const switchRole = (role: UserRole) => {
    if (role === 'guru') {
      setCurrentUser(initialProfiles[0]);
    } else {
      setCurrentUser(initialProfiles[1]);
    }
  };

  const resetDemoData = () => {
    setCurrentUser(initialProfiles[0]);
    setPosts(initialPosts);
    setModules(initialModules);
    setCompletedModuleIds(['modul-1']);
    setMediaList(initialMedia);
    setLkms(initialLkms);
    setSubmissions(initialSubmissions);
    setQuizzes(initialQuizzes);
    setQuizResults([]);
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // --- FORUM ACTIONS ---
  const createPost = (title: string, content: string, category: ForumPost['category']) => {
    const newPost: ForumPost = {
      id: 'post-' + Date.now(),
      user_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role,
      author_avatar: currentUser.avatar_url,
      category,
      title,
      content,
      likes_count: 0,
      liked_by_users: [],
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (id: string, title: string, content: string, category: ForumPost['category']) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, title, content, category, updated_at: new Date().toISOString() } : p
      )
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyLiked = post.liked_by_users.includes(currentUser.id);
        const updatedLiked = alreadyLiked
          ? post.liked_by_users.filter((uid) => uid !== currentUser.id)
          : [...post.liked_by_users, currentUser.id];
        return {
          ...post,
          likes_count: updatedLiked.length,
          liked_by_users: updatedLiked,
        };
      })
    );
  };

  const addComment = (postId: string, content: string, parentId?: string | null) => {
    const newComment: ForumComment = {
      id: 'comm-' + Date.now(),
      post_id: postId,
      parent_id: parentId || null,
      user_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role,
      author_avatar: currentUser.avatar_url,
      content,
      created_at: new Date().toISOString(),
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        if (!parentId) {
          // Top-level comment
          return {
            ...post,
            comments_count: post.comments_count + 1,
            comments: [...post.comments, newComment],
          };
        } else {
          // Nested reply
          const attachReply = (comments: ForumComment[]): ForumComment[] => {
            return comments.map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newComment],
                };
              }
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: attachReply(c.replies),
                };
              }
              return c;
            });
          };

          return {
            ...post,
            comments_count: post.comments_count + 1,
            comments: attachReply(post.comments),
          };
        }
      })
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const removeRecursive = (comments: ForumComment[]): ForumComment[] => {
          return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? removeRecursive(c.replies) : [],
            }));
        };

        return {
          ...post,
          comments_count: Math.max(0, post.comments_count - 1),
          comments: removeRecursive(post.comments),
        };
      })
    );
  };

  // --- E-MODUL ACTIONS ---
  const createModule = (mod: Omit<EModul, 'id' | 'created_at' | 'updated_at'>) => {
    const newMod: EModul = {
      ...mod,
      id: 'modul-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setModules((prev) => [...prev, newMod]);
  };

  const updateModule = (id: string, mod: Partial<EModul>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...mod, updated_at: new Date().toISOString() } : m))
    );
  };

  const deleteModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleModuleComplete = (moduleId: string) => {
    setCompletedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  // --- MEDIA AJAR ACTIONS ---
  const createMedia = (media: Omit<MediaAjar, 'id' | 'created_at'>) => {
    const newMedia: MediaAjar = {
      ...media,
      id: 'media-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setMediaList((prev) => [newMedia, ...prev]);
  };

  const updateMedia = (id: string, media: Partial<MediaAjar>) => {
    setMediaList((prev) => prev.map((m) => (m.id === id ? { ...m, ...media } : m)));
  };

  const deleteMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // --- LKM ACTIONS ---
  const createLkm = (lkm: Omit<LkmAssignment, 'id' | 'created_at'>) => {
    const newLkm: LkmAssignment = {
      ...lkm,
      id: 'lkm-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setLkms((prev) => [newLkm, ...prev]);
  };

  const updateLkm = (id: string, lkm: Partial<LkmAssignment>) => {
    setLkms((prev) => prev.map((item) => (item.id === id ? { ...item, ...lkm } : item)));
  };

  const deleteLkm = (id: string) => {
    setLkms((prev) => prev.filter((item) => item.id !== id));
  };

  const submitLkmWork = (
    assignmentId: string,
    contentText: string,
    attachmentName?: string,
    attachmentUrl?: string
  ) => {
    // Check if student already submitted, update or create new
    setSubmissions((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.assignment_id === assignmentId && s.student_id === currentUser.id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          content_text: contentText,
          attachment_name: attachmentName || updated[existingIndex].attachment_name,
          attachment_url: attachmentUrl || updated[existingIndex].attachment_url,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        };
        return updated;
      }

      const newSubmission: LkmSubmission = {
        id: 'sub-' + Date.now(),
        assignment_id: assignmentId,
        student_id: currentUser.id,
        student_name: currentUser.full_name,
        student_avatar: currentUser.avatar_url,
        student_email: currentUser.email,
        content_text: contentText,
        attachment_name: attachmentName,
        attachment_url: attachmentUrl,
        score: null,
        feedback: null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };
      return [newSubmission, ...prev];
    });
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              score,
              feedback,
              status: 'graded',
              graded_at: new Date().toISOString(),
            }
          : s
      )
    );
  };

  // --- ASESMEN & KUIS ACTIONS ---
  const createQuiz = (quiz: Omit<Quiz, 'id' | 'created_at'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: 'quiz-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const updateQuiz = (id: string, quiz: Partial<Quiz>) => {
    setQuizzes((prev) => prev.map((q) => (q.id === id ? { ...q, ...quiz } : q)));
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const recordQuizResult = (
    result: Omit<QuizSubmission, 'id' | 'student_id' | 'student_name' | 'submitted_at'>
  ) => {
    const newResult: QuizSubmission = {
      ...result,
      id: 'result-' + Date.now(),
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      submitted_at: new Date().toISOString(),
    };
    setQuizResults((prev) => [newResult, ...prev]);
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isSupabaseMode: isSupabaseConfigured,
        posts,
        createPost,
        updatePost,
        deletePost,
        toggleLikePost,
        addComment,
        deleteComment,
        modules,
        completedModuleIds,
        createModule,
        updateModule,
        deleteModule,
        toggleModuleComplete,
        mediaList,
        createMedia,
        updateMedia,
        deleteMedia,
        lkms,
        submissions,
        createLkm,
        updateLkm,
        deleteLkm,
        submitLkmWork,
        gradeSubmission,
        quizzes,
        quizResults,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        recordQuizResult,
        resetDemoData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
