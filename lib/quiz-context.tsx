import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quiz, QuizResult } from './types';

interface QuizContextType {
  quizzes: Quiz[];
  quizResults: QuizResult[];
  getQuizzesByTopic: (topicId: string) => Quiz[];
  getResultsByTopic: (topicId: string) => QuizResult[];
  addQuiz: (quiz: Quiz) => Promise<void>;
  addQuizResult: (result: QuizResult) => Promise<void>;
  getAverageScoreByTopic: (topicId: string) => number;
  isLoading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface State {
  quizzes: Quiz[];
  quizResults: QuizResult[];
  isLoading: boolean;
}

type Action =
  | { type: 'SET_QUIZZES'; payload: Quiz[] }
  | { type: 'SET_QUIZ_RESULTS'; payload: QuizResult[] }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'ADD_QUIZ_RESULT'; payload: QuizResult }
  | { type: 'SET_LOADING'; payload: boolean };

function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload };
    case 'SET_QUIZ_RESULTS':
      return { ...state, quizResults: action.payload };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case 'ADD_QUIZ_RESULT':
      return { ...state, quizResults: [...state.quizResults, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, {
    quizzes: [],
    quizResults: [],
    isLoading: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [quizzesJson, resultsJson] = await Promise.all([
        AsyncStorage.getItem('quizzes'),
        AsyncStorage.getItem('quiz_results'),
      ]);

      if (quizzesJson) {
        const quizzes = JSON.parse(quizzesJson);
        dispatch({ type: 'SET_QUIZZES', payload: quizzes });
      }

      if (resultsJson) {
        const results = JSON.parse(resultsJson);
        dispatch({ type: 'SET_QUIZ_RESULTS', payload: results });
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getQuizzesByTopic = (topicId: string): Quiz[] => {
    return state.quizzes.filter((q) => q.topicId === topicId);
  };

  const getResultsByTopic = (topicId: string): QuizResult[] => {
    return state.quizResults.filter((r) => r.topicId === topicId);
  };

  const addQuiz = async (quiz: Quiz) => {
    try {
      dispatch({ type: 'ADD_QUIZ', payload: quiz });
      const updatedQuizzes = [...state.quizzes, quiz];
      await AsyncStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  const addQuizResult = async (result: QuizResult) => {
    try {
      dispatch({ type: 'ADD_QUIZ_RESULT', payload: result });
      const updatedResults = [...state.quizResults, result];
      await AsyncStorage.setItem('quiz_results', JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error adding quiz result:', error);
    }
  };

  const getAverageScoreByTopic = (topicId: string): number => {
    const topicResults = getResultsByTopic(topicId);
    if (topicResults.length === 0) return 0;
    const totalScore = topicResults.reduce((sum, r) => sum + r.score, 0);
    return Math.round((totalScore / topicResults.length) * 100) / 100;
  };

  const value: QuizContextType = {
    quizzes: state.quizzes,
    quizResults: state.quizResults,
    getQuizzesByTopic,
    getResultsByTopic,
    addQuiz,
    addQuizResult,
    getAverageScoreByTopic,
    isLoading: state.isLoading,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
