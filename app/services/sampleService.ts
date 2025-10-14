import { supabase } from '../lib/supabaseClient';

export type SampleStatus = 'requested' | 'in_production' | 'shipped' | 'delivered' | 'feedback_received';

export type Sample = {
  id: string;
  user_id: string;
  project_id: string;
  variant_id: string;
  status: SampleStatus;
  tracking_code: string;
  shipping_company: string;
  requested_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
};

export type SampleWithDetails = Sample & {
  project: {
    name: string;
  };
  product_variant: {
    sku: string;
    product: {
      name: string;
      slug: string;
    };
    color: {
      name: string;
      hex_code: string;
    };
    texture: {
      name: string;
    };
  };
};

export class SampleService {
  static async getSamples(userId: string): Promise<Sample[]> {
    try {
      console.log("Buscando amostras para o usuário:", userId);
      const { data, error } = await supabase
        .from('samples')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log("Resultado da busca de amostras:", { data, error });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching samples:', error);
      throw error;
    }
  }

  // Função para buscar amostras com detalhes relacionados em consultas separadas
  static async getSamplesWithDetails(userId: string): Promise<SampleWithDetails[]> {
    try {
      console.log("Buscando amostras com detalhes para o usuário:", userId);
      
      // Primeiro buscar as amostras básicas
      const { data: samples, error: samplesError } = await supabase
        .from('samples')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (samplesError) throw samplesError;
      
      if (!samples || samples.length === 0) {
        return [];
      }
      
      // Buscar dados relacionados em consultas separadas
      const projectIds = [...new Set(samples.map(sample => sample.project_id).filter(Boolean))] as string[];
      const variantIds = [...new Set(samples.map(sample => sample.variant_id).filter(Boolean))] as string[];
      
      // Buscar projetos
      let projects: any[] = [];
      if (projectIds.length > 0) {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name')
          .in('id', projectIds);
          
        if (projectsError) throw projectsError;
        projects = projectsData || [];
      }
      
      // Buscar variantes de produtos
      let variants: any[] = [];
      if (variantIds.length > 0) {
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select(`
            id, 
            sku, 
            product_id, 
            color_id, 
            texture_id,
            products(id, name, slug),
            colors(id, name, hex_code),
            textures(id, name)
          `)
          .in('id', variantIds);
          
        if (variantsError) throw variantsError;
        variants = variantsData || [];
      }
      
      // Combinar os dados
      const samplesWithDetails = samples.map(sample => {
        const project = projects.find(p => p.id === sample.project_id) || { name: '' };
        const variant = variants.find(v => v.id === sample.variant_id) || {
          sku: '',
          products: { name: '', slug: '' },
          colors: { name: '', hex_code: '' },
          textures: { name: '' }
        };
        
        return {
          ...sample,
          project: {
            name: project.name
          },
          product_variant: {
            sku: variant.sku,
            product: {
              name: variant.products?.name || '',
              slug: variant.products?.slug || ''
            },
            color: {
              name: variant.colors?.name || '',
              hex_code: variant.colors?.hex_code || ''
            },
            texture: {
              name: variant.textures?.name || ''
            }
          }
        };
      });
      
      return samplesWithDetails;
    } catch (error) {
      console.error('Error fetching samples with details:', error);
      throw error;
    }
  }

  static async getSample(id: string): Promise<SampleWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('samples')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching sample:', error);
      throw error;
    }
  }

  static async requestSample(sample: Omit<Sample, 'id' | 'created_at' | 'updated_at'>): Promise<Sample> {
    try {
      const { data, error } = await supabase
        .from('samples')
        .insert([{ ...sample, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error requesting sample:', error);
      throw error;
    }
  }

  static async updateSample(id: string, updates: Partial<Sample>): Promise<Sample> {
    try {
      const { data, error } = await supabase
        .from('samples')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating sample:', error);
      throw error;
    }
  }

  static async deleteSample(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('samples')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting sample:', error);
      throw error;
    }
  }

  static async updateSampleStatus(id: string, status: SampleStatus): Promise<Sample> {
    try {
      const updates: Partial<Sample> = { status, updated_at: new Date().toISOString() };
      
      // Atualizar timestamps específicos com base no status
      if (status === 'shipped') {
        updates.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('samples')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating sample status:', error);
      throw error;
    }
  }

  static async addFeedback(id: string, feedback: string): Promise<Sample> {
    try {
      const { data, error } = await supabase
        .from('samples')
        .update({ 
          feedback,
          status: 'feedback_received',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding feedback to sample:', error);
      throw error;
    }
  }
}