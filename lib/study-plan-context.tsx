import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyPlan, Topic, Progress } from './types';

interface StudyPlanContextType {
  plans: StudyPlan[];
  activePlan: StudyPlan | null;
  progress: Progress;
  addPlan: (plan: StudyPlan) => Promise<void>;
  updatePlan: (plan: StudyPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  setActivePlan: (planId: string) => Promise<void>;
  markTopicComplete: (topicId: string) => Promise<void>;
  updateProgress: (progress: Progress) => Promise<void>;
  isLoading: boolean;
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined);

interface State {
  plans: StudyPlan[];
  activePlan: StudyPlan | null;
  progress: Progress;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_PLANS'; payload: StudyPlan[] }
  | { type: 'SET_ACTIVE_PLAN'; payload: StudyPlan | null }
  | { type: 'ADD_PLAN'; payload: StudyPlan }
  | { type: 'UPDATE_PLAN'; payload: StudyPlan }
  | { type: 'DELETE_PLAN'; payload: string }
  | { type: 'UPDATE_PROGRESS'; payload: Progress }
  | { type: 'SET_LOADING'; payload: boolean };

const initialProgress: Progress = {
  totalTopicsCompleted: 0,
  totalTopicsInActivePlan: 0,
  currentStreak: 0,
  totalStudyTime: 0,
  averageQuizScore: 0,
  lastStudiedDate: new Date(),
  topicsCompletedByDate: {},
  quizResultsHistory: [],
};

function studyPlanReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PLANS':
      return { ...state, plans: action.payload };
    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlan: action.payload };
    case 'ADD_PLAN':
      return { ...state, plans: [...state.plans, action.payload] };
    case 'UPDATE_PLAN':
      return {
        ...state,
        plans: state.plans.map((p) => (p.id === action.payload.id ? action.payload : p)),
        activePlan:
          state.activePlan?.id === action.payload.id ? action.payload : state.activePlan,
      };
    case 'DELETE_PLAN':
      return {
        ...state,
        plans: state.plans.filter((p) => p.id !== action.payload),
        activePlan:
          state.activePlan?.id === action.payload ? null : state.activePlan,
      };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyPlanReducer, {
    plans: [],
    activePlan: null,
    progress: initialProgress,
    isLoading: true,
  });

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [plansJson, activePlanJson, progressJson] = await Promise.all([
        AsyncStorage.getItem('study_plans'),
        AsyncStorage.getItem('active_plan'),
        AsyncStorage.getItem('progress'),
      ]);

      if (plansJson) {
        const plans = JSON.parse(plansJson);
        dispatch({ type: 'SET_PLANS', payload: plans });
      }

      if (activePlanJson) {
        const activePlan = JSON.parse(activePlanJson);
        dispatch({ type: 'SET_ACTIVE_PLAN', payload: activePlan });
      }

      if (progressJson) {
        const progress = JSON.parse(progressJson);
        dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
      }
    } catch (error) {
      console.error('Error loading study plan data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addPlan = async (plan: StudyPlan) => {
    try {
      dispatch({ type: 'ADD_PLAN', payload: plan });
      const updatedPlans = [...state.plans, plan];
      await AsyncStorage.setItem('study_plans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Error adding study plan:', error);
    }
  };

  const updatePlan = async (plan: StudyPlan) => {
    try {
      dispatch({ type: 'UPDATE_PLAN', payload: plan });
      const updatedPlans = state.plans.map((p) => (p.id === plan.id ? plan : p));
      await AsyncStorage.setItem('study_plans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Error updating study plan:', error);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      dispatch({ type: 'DELETE_PLAN', payload: planId });
      const updatedPlans = state.plans.filter((p) => p.id !== planId);
      await AsyncStorage.setItem('study_plans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Error deleting study plan:', error);
    }
  };

  const setActivePlan = async (planId: string) => {
    try {
      const plan = state.plans.find((p) => p.id === planId) || null;
      dispatch({ type: 'SET_ACTIVE_PLAN', payload: plan });
      if (plan) {
        await AsyncStorage.setItem('active_plan', JSON.stringify(plan));
      }
    } catch (error) {
      console.error('Error setting active plan:', error);
    }
  };

  const markTopicComplete = async (topicId: string) => {
    try {
      if (!state.activePlan) return;

      const updatedPlan = {
        ...state.activePlan,
        topics: state.activePlan.topics.map((t) =>
          t.id === topicId ? { ...t, isCompleted: true, completedAt: new Date() } : t
        ),
      };

      await updatePlan(updatedPlan);

      // Update progress
      const newProgress = {
        ...state.progress,
        totalTopicsCompleted: state.progress.totalTopicsCompleted + 1,
      };
      await updateProgress(newProgress);
    } catch (error) {
      console.error('Error marking topic complete:', error);
    }
  };

  const updateProgress = async (progress: Progress) => {
    try {
      dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
      await AsyncStorage.setItem('progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const value: StudyPlanContextType = {
    plans: state.plans,
    activePlan: state.activePlan,
    progress: state.progress,
    addPlan,
    updatePlan,
    deletePlan,
    setActivePlan,
    markTopicComplete,
    updateProgress,
    isLoading: state.isLoading,
  };

  return (
    <StudyPlanContext.Provider value={value}>
      {children}
    </StudyPlanContext.Provider>
  );
}

export function useStudyPlan() {
  const context = useContext(StudyPlanContext);
  if (context === undefined) {
    throw new Error('useStudyPlan must be used within a StudyPlanProvider');
  }
  return context;
}
