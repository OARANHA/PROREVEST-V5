import { supabase } from '../lib/supabaseClient';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  tags: string[];
  category: string;
  views: number;
};

export type ProjectCase = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  client: string;
  location: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  images: string[];
  tags: string[];
  category: string;
  views: number;
  products_used: string[]; // IDs dos produtos usados no projeto
};

export class BlogService {
  // Blog Posts
  static async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ 
          ...post, 
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  static async getBlogPosts(status?: 'draft' | 'published' | 'archived'): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  static async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return this.getBlogPosts('published');
  }

  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }
  }

  static async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  static async deleteBlogPost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  static async incrementBlogPostViews(id: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', id)
        .single();

      if (error) throw error;

      const newViews = (data?.views || 0) + 1;

      await supabase
        .from('blog_posts')
        .update({ views: newViews })
        .eq('id', id);
    } catch (error) {
      console.error('Error incrementing blog post views:', error);
      throw error;
    }
  }

  // Project Cases
  static async createProjectCase(project: Omit<ProjectCase, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<ProjectCase> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .insert([{ 
          ...project, 
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project case:', error);
      throw error;
    }
  }

  static async getProjectCases(status?: 'draft' | 'published' | 'archived'): Promise<ProjectCase[]> {
    try {
      let query = supabase
        .from('project_cases')
        .select('*')
        .order('completed_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project cases:', error);
      throw error;
    }
  }

  static async getPublishedProjectCases(): Promise<ProjectCase[]> {
    return this.getProjectCases('published');
  }

  static async getProjectCaseBySlug(slug: string): Promise<ProjectCase | null> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching project case by slug:', error);
      throw error;
    }
  }

  static async updateProjectCase(id: string, updates: Partial<ProjectCase>): Promise<ProjectCase> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project case:', error);
      throw error;
    }
  }

  static async deleteProjectCase(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project case:', error);
      throw error;
    }
  }

  static async incrementProjectCaseViews(id: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .select('views')
        .eq('id', id)
        .single();

      if (error) throw error;

      const newViews = (data?.views || 0) + 1;

      await supabase
        .from('project_cases')
        .update({ views: newViews })
        .eq('id', id);
    } catch (error) {
      console.error('Error incrementing project case views:', error);
      throw error;
    }
  }

  // Categories and Tags
  static async getBlogCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      // Extrair categorias únicas
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  }

  static async getBlogTags(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags');

      if (error) throw error;
      
      // Extrair tags únicas de todos os posts
      const allTags: string[] = [];
      data?.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          allTags.push(...post.tags);
        }
      });
      
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags;
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      throw error;
    }
  }

  static async getProjectCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      // Extrair categorias únicas
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      console.error('Error fetching project categories:', error);
      throw error;
    }
  }

  static async getProjectTags(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('project_cases')
        .select('tags');

      if (error) throw error;
      
      // Extrair tags únicas de todos os projetos
      const allTags: string[] = [];
      data?.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
          allTags.push(...project.tags);
        }
      });
      
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags;
    } catch (error) {
      console.error('Error fetching project tags:', error);
      throw error;
    }
  }
}