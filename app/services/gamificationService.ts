// Serviço para gerenciar gamificação e recompensas
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  secret: boolean; // Se é um segredo
  unlocked: boolean;
  unlockedAt: string | null;
};

export type UserProgress = {
  totalPoints: number;
  level: number;
  achievements: string[]; // IDs das conquistas desbloqueadas
  lastActivity: string;
};

export class GamificationService {
  static readonly ACHIEVEMENTS_KEY = 'tintas_zanai_achievements';
  static readonly USER_PROGRESS_KEY = 'tintas_zanai_user_progress';
  
  // Lista de conquistas disponíveis
  static readonly ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first_login',
      title: 'Primeiro Passo',
      description: 'Faça seu primeiro login no sistema',
      icon: '👣',
      points: 10,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'create_project',
      title: 'Arquiteto Iniciante',
      description: 'Crie seu primeiro projeto',
      icon: '🏗️',
      points: 20,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'request_sample',
      title: 'Explorador de Cores',
      description: 'Solicite sua primeira amostra',
      icon: '🎨',
      points: 15,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'complete_quote',
      title: 'Comprador Consciente',
      description: 'Complete seu primeiro orçamento',
      icon: '💰',
      points: 25,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'share_moodboard',
      title: 'Inspiração Compartilhada',
      description: 'Compartilhe um moodboard',
      icon: '🔗',
      points: 30,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'contact_consultant',
      title: 'Buscador de Sabedoria',
      description: 'Entre em contato com um consultor',
      icon: '📞',
      points: 20,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'simulate_color',
      title: 'Artista Virtual',
      description: 'Use o simulador de cores',
      icon: '🖌️',
      points: 15,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'compare_products',
      title: 'Comparador Profissional',
      description: 'Compare pelo menos 3 produtos',
      icon: '⚖️',
      points: 20,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'secret_guide_1',
      title: 'Caçador de Segredos',
      description: 'Desbloqueie seu primeiro guia secreto',
      icon: '🗝️',
      points: 50,
      secret: true,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'secret_guide_2',
      title: 'Mestre dos Segredos',
      description: 'Desbloqueie três guias secretos',
      icon: '🗝️🗝️',
      points: 100,
      secret: true,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'expert_user',
      title: 'Usuário Expert',
      description: 'Desbloqueie 5 conquistas não secretas',
      icon: '🏆',
      points: 100,
      secret: false,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'loyal_customer',
      title: 'Cliente Fiel',
      description: 'Use o sistema por 30 dias consecutivos',
      icon: '💎',
      points: 200,
      secret: false,
      unlocked: false,
      unlockedAt: null
    }
  ];
  
  // Inicializar conquistas do usuário
  static initializeUserAchievements(): void {
    try {
      const stored = localStorage.getItem(this.ACHIEVEMENTS_KEY);
      if (!stored) {
        // Salvar conquistas padrão
        const achievements = this.ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          unlocked: false,
          unlockedAt: null
        }));
        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(achievements));
      }
      
      // Inicializar progresso do usuário se não existir
      const progressStored = localStorage.getItem(this.USER_PROGRESS_KEY);
      if (!progressStored) {
        const progress: UserProgress = {
          totalPoints: 0,
          level: 1,
          achievements: [],
          lastActivity: new Date().toISOString()
        };
        localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(progress));
      }
    } catch (error) {
      console.error('Erro ao inicializar conquistas do usuário:', error);
    }
  }
  
  // Carregar conquistas do usuário
  static getUserAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(this.ACHIEVEMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: false,
        unlockedAt: null
      }));
    } catch (error) {
      console.error('Erro ao carregar conquistas do usuário:', error);
      return this.ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: false,
        unlockedAt: null
      }));
    }
  }
  
  // Carregar progresso do usuário
  static getUserProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(this.USER_PROGRESS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        totalPoints: 0,
        level: 1,
        achievements: [],
        lastActivity: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao carregar progresso do usuário:', error);
      return {
        totalPoints: 0,
        level: 1,
        achievements: [],
        lastActivity: new Date().toISOString()
      };
    }
  }
  
  // Salvar conquistas do usuário
  static saveUserAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('Erro ao salvar conquistas do usuário:', error);
    }
  }
  
  // Salvar progresso do usuário
  static saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Erro ao salvar progresso do usuário:', error);
    }
  }
  
  // Desbloquear uma conquista
  static unlockAchievement(achievementId: string): boolean {
    try {
      const achievements = this.getUserAchievements();
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (!achievement) {
        console.warn(`Conquista não encontrada: ${achievementId}`);
        return false;
      }
      
      if (achievement.unlocked) {
        // Já desbloqueada
        return false;
      }
      
      // Atualizar conquista
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      
      // Salvar conquistas atualizadas
      this.saveUserAchievements(achievements);
      
      // Atualizar progresso do usuário
      const progress = this.getUserProgress();
      progress.achievements.push(achievementId);
      progress.totalPoints += achievement.points;
      
      // Calcular novo nível (a cada 100 pontos)
      progress.level = Math.floor(progress.totalPoints / 100) + 1;
      
      // Atualizar última atividade
      progress.lastActivity = new Date().toISOString();
      
      // Salvar progresso atualizado
      this.saveUserProgress(progress);
      
      return true;
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
      return false;
    }
  }
  
  // Verificar se uma conquista está desbloqueada
  static isAchievementUnlocked(achievementId: string): boolean {
    try {
      const achievements = this.getUserAchievements();
      const achievement = achievements.find(a => a.id === achievementId);
      return achievement ? achievement.unlocked : false;
    } catch (error) {
      console.error('Erro ao verificar conquista:', error);
      return false;
    }
  }
  
  // Obter conquistas desbloqueadas
  static getUnlockedAchievements(): Achievement[] {
    try {
      const achievements = this.getUserAchievements();
      return achievements.filter(a => a.unlocked);
    } catch (error) {
      console.error('Erro ao obter conquistas desbloqueadas:', error);
      return [];
    }
  }
  
  // Obter conquistas secretas
  static getSecretAchievements(): Achievement[] {
    try {
      const achievements = this.getUserAchievements();
      return achievements.filter(a => a.secret);
    } catch (error) {
      console.error('Erro ao obter conquistas secretas:', error);
      return [];
    }
  }
  
  // Obter conquistas não desbloqueadas
  static getLockedAchievements(): Achievement[] {
    try {
      const achievements = this.getUserAchievements();
      return achievements.filter(a => !a.unlocked);
    } catch (error) {
      console.error('Erro ao obter conquistas bloqueadas:', error);
      return [];
    }
  }
  
  // Calcular pontos totais
  static getTotalPoints(): number {
    try {
      const progress = this.getUserProgress();
      return progress.totalPoints;
    } catch (error) {
      console.error('Erro ao calcular pontos totais:', error);
      return 0;
    }
  }
  
  // Calcular nível do usuário
  static getUserLevel(): number {
    try {
      const progress = this.getUserProgress();
      return progress.level;
    } catch (error) {
      console.error('Erro ao calcular nível do usuário:', error);
      return 1;
    }
  }
  
  // Obter próxima conquista secreta a ser desbloqueada
  static getNextSecretAchievement(): Achievement | null {
    try {
      const secretAchievements = this.getSecretAchievements();
      const unlockedSecrets = secretAchievements.filter(a => a.unlocked);
      
      // Ordenar por pontos (do menor para o maior)
      const sortedSecrets = [...secretAchievements].sort((a, b) => a.points - b.points);
      
      // Retornar a primeira que ainda não foi desbloqueada
      return sortedSecrets.find(a => !a.unlocked) || null;
    } catch (error) {
      console.error('Erro ao obter próxima conquista secreta:', error);
      return null;
    }
  }
  
  // Verificar se usuário é elegível para uma conquista secreta
  static checkSecretAchievementEligibility(achievementId: string): boolean {
    try {
      const progress = this.getUserProgress();
      const unlockedNonSecret = progress.achievements.filter(id => {
        const achievement = this.ACHIEVEMENTS.find(a => a.id === id);
        return achievement && !achievement.secret;
      });
      
      switch (achievementId) {
        case 'secret_guide_1':
          // Precisa de pelo menos 3 conquistas não secretas
          return unlockedNonSecret.length >= 3;
        case 'secret_guide_2':
          // Precisa de pelo menos 5 conquistas não secretas
          return unlockedNonSecret.length >= 5;
        default:
          return false;
      }
    } catch (error) {
      console.error('Erro ao verificar elegibilidade de conquista secreta:', error);
      return false;
    }
  }
  
  // Verificar e desbloquear conquistas secretas automaticamente
  static checkAndUnlockSecretAchievements(): void {
    try {
      const secretAchievements = this.getSecretAchievements();
      
      secretAchievements.forEach(achievement => {
        if (!achievement.unlocked && this.checkSecretAchievementEligibility(achievement.id)) {
          this.unlockAchievement(achievement.id);
        }
      });
    } catch (error) {
      console.error('Erro ao verificar e desbloquear conquistas secretas:', error);
    }
  }
}