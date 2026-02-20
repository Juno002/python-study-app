# Python Study App - Design Document

## Overview
A mobile learning app for studying Python with personalized study plans, integrated code editor, AI-generated quizzes, and progress tracking. The app follows Apple HIG standards with a Python-inspired color scheme (blue/yellow).

## Screen List

### 1. **Home Screen** (Tab: Home)
- Welcome message with user's current progress
- Quick stats: topics completed, current streak, next topic
- "Continue Learning" button linking to today's topic
- List of recent activities (last 3 topics studied)
- Study plan overview card

### 2. **Study Plan Screen** (Tab: Study Plan)
- Create new study plan button
- List of active study plans with progress bars
- Plan details:
  - Plan name, total topics, completion percentage
  - Topics organized by order with checkmarks
  - Edit/delete plan options
- Plan creation flow:
  - Step 1: Plan name and total duration (days)
  - Step 2: Add topics (name, description, estimated days)
  - Step 3: Arrange topics in order
  - Step 4: Review and create

### 3. **Topic Detail Screen**
- Topic name and description
- Progress indicator (day X of Y)
- Tabs: Notes | Code Editor | Quiz
- **Notes Tab:**
  - Display saved notes for this topic
  - Edit/add notes button
  - Rich text editor for notes
- **Code Editor Tab:**
  - Python code editor with syntax highlighting
  - Run button to execute code
  - Output display area
  - Code templates/examples
- **Quiz Tab:**
  - Generate quiz button (AI-powered)
  - Display quiz questions (multiple choice, true/false, code completion)
  - Score and feedback after submission

### 4. **Notes Editor Screen**
- Text editor for topic notes
- Save/cancel buttons
- Auto-save indicator
- Formatting options (bold, italic, lists, code blocks)

### 5. **Code Editor Screen**
- Full-screen Python code editor
- Syntax highlighting
- Run/Clear buttons
- Output console below editor
- Code templates dropdown
- Save code snippet option

### 6. **Quiz Screen**
- Question display with question type indicator
- Multiple choice: radio buttons for options
- True/False: toggle buttons
- Code completion: text input with code template
- Submit button
- Progress indicator (question X of Y)
- Results screen with score and explanations

### 7. **Progress Screen** (Tab: Progress)
- Overall progress metrics:
  - Total topics completed
  - Study streak (consecutive days)
  - Total study time
  - Average quiz score
- Progress chart (topics completed over time)
- Study plan progress breakdown:
  - List of all plans with completion percentage
  - Detailed progress for active plan
- Quiz statistics:
  - Average score by topic
  - Quiz attempts history
- Achievements/milestones

### 8. **Settings Screen** (Tab: Settings)
- User preferences:
  - Dark/light mode toggle
  - Notifications settings
  - Study reminders
- About section
- Reset data option

## Primary Content and Functionality

### Study Plan Management
- Create custom study plans with flexible topics and timelines
- Topics are dosed day-by-day based on user's pace
- Track completion status for each topic
- Edit/delete plans

### Notes System
- Write and save notes linked to each topic
- Rich text editing (bold, italic, lists, code blocks)
- Auto-save functionality
- Quick access from topic detail screen

### Code Editor
- Real Python code execution (via backend API)
- Syntax highlighting
- Code templates for common patterns
- Output console for results and errors
- Save code snippets for reference

### AI-Generated Quizzes
- Automatically generate quiz questions based on:
  - Topic content
  - User's notes
  - Previous quiz performance
- Question types:
  - Multiple choice (4 options)
  - True/False
  - Code completion (fill-in-the-blank Python code)
- Instant feedback with explanations
- Score tracking

### Progress Visualization
- Real-time progress tracking
- Visual charts and statistics
- Study streak counter
- Topic completion overview
- Quiz performance analytics

## Key User Flows

### Flow 1: Create Study Plan
1. User taps "Create Plan" on Study Plan screen
2. Enters plan name and total duration
3. Adds topics with descriptions and estimated days
4. Arranges topics in desired order
5. Reviews and confirms creation
6. Plan appears in active plans list

### Flow 2: Study a Topic
1. User taps topic from Study Plan or "Continue Learning"
2. Topic Detail screen opens with Notes, Code, Quiz tabs
3. User reads/writes notes (Notes tab)
4. User writes and runs Python code (Code tab)
5. User takes AI-generated quiz (Quiz tab)
6. Topic marked as completed
7. Progress updates automatically

### Flow 3: Generate and Take Quiz
1. User on Topic Detail screen, Quiz tab
2. Taps "Generate Quiz" button
3. AI generates 5 quiz questions based on topic + notes
4. User answers questions (multiple choice, true/false, code)
5. User submits quiz
6. Results screen shows score and explanations
7. Quiz data saved to progress tracking

### Flow 4: View Progress
1. User taps Progress tab
2. Sees overall metrics and charts
3. Taps on specific plan to see detailed breakdown
4. Views quiz statistics and study history
5. Can see achievements/milestones

## Color Choices

### Primary Colors (Python Theme)
- **Primary Blue:** `#0066CC` (Python blue, used for buttons, highlights, active states)
- **Secondary Yellow:** `#FFB81C` (Python yellow, used for accents, badges, success states)
- **Dark Background:** `#1A1A1A` (dark mode) / `#FFFFFF` (light mode)
- **Surface:** `#2D2D2D` (dark) / `#F5F5F5` (light)
- **Text Primary:** `#FFFFFF` (dark) / `#1A1A1A` (light)
- **Text Secondary:** `#B0B0B0` (dark) / `#666666` (light)
- **Success Green:** `#4CAF50`
- **Error Red:** `#FF5252`
- **Warning Orange:** `#FF9800`

### Usage
- Primary buttons and navigation: Blue
- Accents and completed items: Yellow
- Success feedback: Green
- Error states: Red
- Code editor background: Dark theme with syntax highlighting

## Navigation Structure

**Tab-based navigation (bottom tabs):**
1. Home (house icon)
2. Study Plan (book icon)
3. Code Editor (code icon) - Quick access to code editor
4. Progress (chart icon)
5. Settings (gear icon)

**Modal/Stack Navigation:**
- Topic Detail (pushed from Study Plan)
- Notes Editor (modal from Topic Detail)
- Quiz (modal from Topic Detail)
- Plan Creation (modal from Study Plan)

## Technical Notes

- **Local Storage:** Study plans, notes, quiz results stored in AsyncStorage
- **Backend API:** Python code execution, AI quiz generation via OpenAI
- **State Management:** React Context + useReducer for study plan and progress state
- **Styling:** NativeWind (Tailwind CSS) with custom Python theme colors
- **Responsive Design:** Portrait orientation (9:16), one-handed usage
