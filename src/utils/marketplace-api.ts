/**
 * Squad Planner Marketplace API
 * Provides access to community plugins and integrations
 */

import { supabase } from '@/utils/supabase/client';

export interface MarketplacePlugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    verified: boolean;
  };
  category: PluginCategory;
  tags: string[];
  icon_url?: string;
  banner_url?: string;
  version: string;
  downloads: number;
  rating: number;
  review_count: number;
  price: number; // 0 = free
  is_premium_only: boolean;
  webhook_url?: string;
  config_schema?: PluginConfigSchema;
  permissions: PluginPermission[];
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_featured: boolean;
}

export type PluginCategory =
  | 'analytics'
  | 'automation'
  | 'bots'
  | 'calendar'
  | 'communication'
  | 'esports'
  | 'games'
  | 'moderation'
  | 'notifications'
  | 'social'
  | 'streaming'
  | 'utility';

export type PluginPermission =
  | 'squads:read'
  | 'squads:write'
  | 'sessions:read'
  | 'sessions:write'
  | 'members:read'
  | 'messages:read'
  | 'messages:write'
  | 'webhooks:receive'
  | 'analytics:read';

export interface PluginConfigSchema {
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'url';
    required: boolean;
    default?: any;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    description?: string;
  }>;
}

export interface InstalledPlugin {
  id: string;
  plugin_id: string;
  squad_id: string;
  installed_by: string;
  config: Record<string, any>;
  is_active: boolean;
  installed_at: string;
  plugin: MarketplacePlugin;
}

export interface PluginReview {
  id: string;
  plugin_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  helpful_count: number;
}

// Mock data for demo
const MOCK_PLUGINS: MarketplacePlugin[] = [
  {
    id: '1',
    name: 'Discord Auto-Sync',
    slug: 'discord-auto-sync',
    description: 'Synchronise automatiquement vos sessions avec Discord',
    long_description: 'Ce plugin synchronise automatiquement vos sessions Squad Planner avec votre serveur Discord. Les événements sont créés automatiquement et les rappels sont envoyés aux membres.',
    author: { id: 'a1', name: 'Squad Planner Team', verified: true },
    category: 'communication',
    tags: ['discord', 'sync', 'notifications'],
    icon_url: 'https://cdn.squadplanner.app/plugins/discord-sync.png',
    version: '2.1.0',
    downloads: 15420,
    rating: 4.8,
    review_count: 234,
    price: 0,
    is_premium_only: false,
    permissions: ['sessions:read', 'webhooks:receive'],
    created_at: '2024-01-15',
    updated_at: '2024-06-20',
    is_verified: true,
    is_featured: true,
  },
  {
    id: '2',
    name: 'Analytics Pro',
    slug: 'analytics-pro',
    description: 'Analyses avancées et rapports détaillés pour votre squad',
    author: { id: 'a2', name: 'DataGaming', verified: true },
    category: 'analytics',
    tags: ['analytics', 'stats', 'reports'],
    version: '1.5.2',
    downloads: 8750,
    rating: 4.6,
    review_count: 156,
    price: 0,
    is_premium_only: true,
    permissions: ['squads:read', 'sessions:read', 'analytics:read'],
    created_at: '2024-02-10',
    updated_at: '2024-07-01',
    is_verified: true,
    is_featured: true,
  },
  {
    id: '3',
    name: 'Twitch Integration',
    slug: 'twitch-integration',
    description: 'Affichez vos streams live et stats Twitch',
    author: { id: 'a3', name: 'StreamTools', verified: true },
    category: 'streaming',
    tags: ['twitch', 'streaming', 'live'],
    version: '3.0.1',
    downloads: 12300,
    rating: 4.7,
    review_count: 189,
    price: 0,
    is_premium_only: false,
    permissions: ['squads:read', 'members:read'],
    created_at: '2024-01-20',
    updated_at: '2024-06-15',
    is_verified: true,
    is_featured: true,
  },
  {
    id: '4',
    name: 'Tournament Manager',
    slug: 'tournament-manager',
    description: 'Organisez des tournois au sein de votre squad',
    author: { id: 'a4', name: 'EsportsHub', verified: true },
    category: 'esports',
    tags: ['tournament', 'brackets', 'competition'],
    version: '2.0.0',
    downloads: 6540,
    rating: 4.5,
    review_count: 98,
    price: 4.99,
    is_premium_only: false,
    permissions: ['squads:write', 'sessions:write', 'members:read'],
    created_at: '2024-03-05',
    updated_at: '2024-06-28',
    is_verified: true,
    is_featured: false,
  },
  {
    id: '5',
    name: 'Auto-Scheduler',
    slug: 'auto-scheduler',
    description: 'IA qui propose les meilleurs créneaux pour votre squad',
    author: { id: 'a1', name: 'Squad Planner Team', verified: true },
    category: 'automation',
    tags: ['ai', 'scheduling', 'smart'],
    version: '1.2.0',
    downloads: 9870,
    rating: 4.9,
    review_count: 312,
    price: 0,
    is_premium_only: true,
    permissions: ['sessions:read', 'sessions:write', 'analytics:read'],
    created_at: '2024-02-28',
    updated_at: '2024-07-05',
    is_verified: true,
    is_featured: true,
  },
  {
    id: '6',
    name: 'Google Calendar Sync',
    slug: 'google-calendar-sync',
    description: 'Synchronisez vos sessions avec Google Calendar',
    author: { id: 'a5', name: 'CalendarPlus', verified: true },
    category: 'calendar',
    tags: ['google', 'calendar', 'sync'],
    version: '1.8.0',
    downloads: 18200,
    rating: 4.7,
    review_count: 267,
    price: 0,
    is_premium_only: false,
    permissions: ['sessions:read'],
    created_at: '2024-01-10',
    updated_at: '2024-06-30',
    is_verified: true,
    is_featured: true,
  },
  {
    id: '7',
    name: 'Valorant Tracker',
    slug: 'valorant-tracker',
    description: 'Affichez les stats Valorant de votre squad',
    author: { id: 'a6', name: 'GameStats', verified: false },
    category: 'games',
    tags: ['valorant', 'stats', 'tracker'],
    version: '1.0.5',
    downloads: 4320,
    rating: 4.3,
    review_count: 78,
    price: 0,
    is_premium_only: false,
    permissions: ['members:read'],
    created_at: '2024-04-15',
    updated_at: '2024-06-20',
    is_verified: false,
    is_featured: false,
  },
  {
    id: '8',
    name: 'Squad Bot',
    slug: 'squad-bot',
    description: 'Bot Discord complet pour gérer votre squad',
    author: { id: 'a7', name: 'BotFactory', verified: true },
    category: 'bots',
    tags: ['discord', 'bot', 'commands'],
    version: '2.3.1',
    downloads: 7650,
    rating: 4.6,
    review_count: 145,
    price: 0,
    is_premium_only: false,
    permissions: ['squads:read', 'sessions:read', 'members:read', 'webhooks:receive'],
    created_at: '2024-02-01',
    updated_at: '2024-07-02',
    is_verified: true,
    is_featured: false,
  },
];

export const marketplaceAPI = {
  /**
   * Get all plugins with optional filters
   */
  async getPlugins(options?: {
    category?: PluginCategory;
    search?: string;
    featured?: boolean;
    sort?: 'popular' | 'recent' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<MarketplacePlugin[]> {
    // In production, this would query Supabase
    let plugins = [...MOCK_PLUGINS];

    if (options?.category) {
      plugins = plugins.filter(p => p.category === options.category);
    }

    if (options?.search) {
      const search = options.search.toLowerCase();
      plugins = plugins.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(t => t.includes(search))
      );
    }

    if (options?.featured) {
      plugins = plugins.filter(p => p.is_featured);
    }

    // Sort
    switch (options?.sort) {
      case 'popular':
        plugins.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'recent':
        plugins.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'rating':
        plugins.sort((a, b) => b.rating - a.rating);
        break;
      default:
        plugins.sort((a, b) => b.downloads - a.downloads);
    }

    const offset = options?.offset || 0;
    const limit = options?.limit || 20;
    return plugins.slice(offset, offset + limit);
  },

  /**
   * Get a plugin by ID or slug
   */
  async getPlugin(idOrSlug: string): Promise<MarketplacePlugin | null> {
    return MOCK_PLUGINS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  /**
   * Get featured plugins
   */
  async getFeaturedPlugins(): Promise<MarketplacePlugin[]> {
    return MOCK_PLUGINS.filter(p => p.is_featured);
  },

  /**
   * Get plugins by category
   */
  async getPluginsByCategory(category: PluginCategory): Promise<MarketplacePlugin[]> {
    return MOCK_PLUGINS.filter(p => p.category === category);
  },

  /**
   * Get plugin categories with counts
   */
  async getCategories(): Promise<Array<{ category: PluginCategory; count: number; label: string }>> {
    const categoryLabels: Record<PluginCategory, string> = {
      analytics: 'Analytics',
      automation: 'Automatisation',
      bots: 'Bots',
      calendar: 'Calendrier',
      communication: 'Communication',
      esports: 'Esports',
      games: 'Jeux',
      moderation: 'Modération',
      notifications: 'Notifications',
      social: 'Social',
      streaming: 'Streaming',
      utility: 'Utilitaires',
    };

    const counts = MOCK_PLUGINS.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<PluginCategory, number>);

    return Object.entries(counts).map(([category, count]) => ({
      category: category as PluginCategory,
      count,
      label: categoryLabels[category as PluginCategory],
    }));
  },

  /**
   * Install a plugin for a squad
   */
  async installPlugin(pluginId: string, squadId: string, config?: Record<string, any>): Promise<InstalledPlugin> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const plugin = await this.getPlugin(pluginId);
    if (!plugin) throw new Error('Plugin not found');

    const { data, error } = await (supabase
      .from('installed_plugins') as any)
      .insert({
        plugin_id: pluginId,
        squad_id: squadId,
        installed_by: user.id,
        config: config || {},
        is_active: true,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to install plugin: ${error.message}`);

    return { ...data, plugin };
  },

  /**
   * Uninstall a plugin
   */
  async uninstallPlugin(installedPluginId: string): Promise<void> {
    const { error } = await (supabase
      .from('installed_plugins') as any)
      .delete()
      .eq('id', installedPluginId);

    if (error) throw new Error(`Failed to uninstall plugin: ${error.message}`);
  },

  /**
   * Get installed plugins for a squad
   */
  async getInstalledPlugins(squadId: string): Promise<InstalledPlugin[]> {
    const { data, error } = await (supabase
      .from('installed_plugins') as any)
      .select('*')
      .eq('squad_id', squadId);

    if (error) return [];

    // Enrich with plugin data
    return Promise.all((data || []).map(async (ip: any) => {
      const plugin = await this.getPlugin(ip.plugin_id);
      return { ...ip, plugin: plugin! };
    }));
  },

  /**
   * Update plugin configuration
   */
  async updatePluginConfig(installedPluginId: string, config: Record<string, any>): Promise<void> {
    const { error } = await (supabase
      .from('installed_plugins') as any)
      .update({ config })
      .eq('id', installedPluginId);

    if (error) throw new Error(`Failed to update plugin config: ${error.message}`);
  },

  /**
   * Toggle plugin active status
   */
  async togglePlugin(installedPluginId: string, isActive: boolean): Promise<void> {
    const { error } = await (supabase
      .from('installed_plugins') as any)
      .update({ is_active: isActive })
      .eq('id', installedPluginId);

    if (error) throw new Error(`Failed to toggle plugin: ${error.message}`);
  },

  /**
   * Get plugin reviews
   */
  async getPluginReviews(pluginId: string): Promise<PluginReview[]> {
    // Mock reviews
    return [
      {
        id: 'r1',
        plugin_id: pluginId,
        user_id: 'u1',
        user_name: 'GamerPro',
        rating: 5,
        title: 'Excellent plugin!',
        content: 'Fonctionne parfaitement avec notre squad. Installation facile et configuration intuitive.',
        created_at: '2024-06-15',
        helpful_count: 12,
      },
      {
        id: 'r2',
        plugin_id: pluginId,
        user_id: 'u2',
        user_name: 'SquadLeader42',
        rating: 4,
        title: 'Très utile',
        content: 'Bon plugin, quelques améliorations possibles mais dans l\'ensemble très satisfait.',
        created_at: '2024-06-10',
        helpful_count: 8,
      },
    ];
  },

  /**
   * Submit a plugin review
   */
  async submitReview(pluginId: string, rating: number, title: string, content: string): Promise<PluginReview> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('plugin_reviews') as any)
      .insert({
        plugin_id: pluginId,
        user_id: user.id,
        rating,
        title,
        content,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to submit review: ${error.message}`);

    return data;
  },
};

export default marketplaceAPI;
