export const styles = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-glow transition-shadow duration-300',
  
  // Typography
  h1: 'font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-nexar-500 to-nexar-600 bg-clip-text text-transparent',
  h2: 'font-display text-3xl font-bold text-gray-900 dark:text-white',
  h3: 'font-display text-2xl font-bold text-gray-800 dark:text-gray-200',
  
  // Buttons
  buttonPrimary: 'px-4 py-2 bg-gradient-to-r from-nexar-500 to-nexar-600 text-white rounded-lg shadow-md hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5',
  buttonSecondary: 'px-4 py-2 bg-white dark:bg-gray-700 text-nexar-600 dark:text-nexar-300 border border-nexar-200 dark:border-nexar-700 rounded-lg shadow-sm hover:shadow-glow transition-all duration-300',
  
  // Cards
  card: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 p-6',
  cardHeader: 'text-xl font-bold text-gray-900 dark:text-white mb-4',
  
  // Forms
  input: 'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-nexar-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300',
  
  // Navigation
  nav: 'fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-50',
  navLink: 'text-gray-600 dark:text-gray-300 hover:text-nexar-500 dark:hover:text-nexar-400 transition-colors duration-300',
  
  // Gamification
  xpBadge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-game-xp/10 text-game-xp',
  rareBadge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-game-rare/10 text-game-rare',
  epicBadge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-game-epic/10 text-game-epic',
  legendaryBadge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-game-legendary/10 text-game-legendary',
  
  // Progress bars
  progressBar: 'h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
  progressFill: 'h-full bg-gradient-to-r from-nexar-500 to-nexar-400 transition-all duration-300',
} 