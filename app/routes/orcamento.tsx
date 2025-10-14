import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams, Form, useActionData, useNavigation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductService } from "~/services/productService";
import Layout from "~/components/Layout";
import { Calculator, Palette, Brush, FileText, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useFormValidation, ValidationRules } from "~/hooks/useFormValidation";

interface Color {
  id: string;
  name: string;
  hex_code: string;
}

interface PaintType {
  id: string;
  name: string;
  description: string;
  applications: string[];
  coverage: string; // m²/L
  price_per_liter: number;
  min_quantity: number;
  icon: string;
}

interface LoaderData {
  colors: Color[];
  paintTypes: PaintType[];
  selectedColor?: Color;
  selectedPaintType?: PaintType;
}

interface ActionData {
  success?: boolean;
  error?: string;
  quoteId?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const colorId = url.searchParams.get("cor");
  const paintTypeId = url.searchParams.get("tipo");
  
  const colors = await ProductService.getColors();
  
  // Tipos de tinta disponíveis
  const paintTypes: PaintType[] = [
    {
      id: "prime-selador",
      name: "Prime/Selador",
      description: "Primer e selador para preparação de superfícies",
      applications: ["Preparação de paredes", "Selagem de superfícies porosas", "Base para tintas"],
      coverage: "12-15",
      price_per_liter: 25.90,
      min_quantity: 1,
      icon: "🔧"
    },
    {
      id: "tinta-acrilica",
      name: "Tinta Acrílica",
      description: "Tinta à base de água para uso interno e externo",
      applications: ["Paredes internas", "Paredes externas", "Alvenaria", "Reboco"],
      coverage: "10-12",
      price_per_liter: 32.90,
      min_quantity: 1,
      icon: "🏠"
    },
    {
      id: "tinta-esmalte",
      name: "Tinta Esmalte",
      description: "Tinta sintética para madeira e metal",
      applications: ["Madeira", "Metal", "Portões", "Janelas", "Móveis"],
      coverage: "8-10",
      price_per_liter: 45.90,
      min_quantity: 1,
      icon: "🚪"
    },
    {
      id: "tinta-texturizada",
      name: "Tinta Texturizada",
      description: "Tinta com efeito texturizado para acabamentos especiais",
      applications: ["Paredes decorativas", "Fachadas", "Acabamentos especiais"],
      coverage: "6-8",
      price_per_liter: 52.90,
      min_quantity: 2,
      icon: "🎨"
    },
    {
      id: "verniz",
      name: "Verniz",
      description: "Verniz transparente para proteção e acabamento",
      applications: ["Madeira", "Móveis", "Pisos", "Proteção UV"],
      coverage: "12-15",
      price_per_liter: 38.90,
      min_quantity: 1,
      icon: "✨"
    }
  ];

  let selectedColor;
  if (colorId) {
    selectedColor = colors.find(color => color.id === colorId);
  }

  let selectedPaintType;
  if (paintTypeId) {
    selectedPaintType = paintTypes.find(pt => pt.id === paintTypeId);
  }

  return json<LoaderData>({
    colors,
    paintTypes,
    selectedColor,
    selectedPaintType
  });
}

import { QuoteService } from "~/services/quoteService";
import { supabase } from "~/lib/supabaseClient";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  try {
    // Obter sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return json<ActionData>({ 
        error: "Usuário não autenticado. Faça login para solicitar orçamento." 
      });
    }

    // Preparar dados do orçamento
    const quoteData = {
      user_id: session.user.id,
      status: 'draft' as const,
      customer_name: formData.get("customerName") as string,
      customer_email: formData.get("customerEmail") as string,
      customer_phone: formData.get("customerPhone") as string || undefined,
      notes: formData.get("observations") as string || "",
      subtotal: 0, // Será calculado baseado nos itens
      discount: 0,
      total: 0, // Será calculado
    };

    // Criar orçamento no banco de dados
    const quote = await QuoteService.createQuote(quoteData);
    
    // Adicionar itens do orçamento
    const paintType = formData.get("paintType") as string;
    const colorId = formData.get("colorId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const area = parseFloat(formData.get("area") as string) || 0;

    if (paintType && colorId && quantity > 0) {
      // Aqui você precisaria buscar o preço real do produto
      // Por enquanto, usando um valor padrão
      const priceAtTime = 32.90; // Preço padrão da tinta acrílica
      
      await QuoteService.addQuoteItem({
        quote_id: quote.id,
        variant_id: colorId, // Na prática, seria o ID da variante do produto
        quantity: quantity,
        price_at_time: priceAtTime
      });

      // Atualizar total do orçamento
      const total = quantity * priceAtTime;
      await QuoteService.updateQuote(quote.id, {
        subtotal: total,
        total: total
      });
    }
    
    return json<ActionData>({ 
      success: true, 
      quoteId: quote.id 
    });
  } catch (error) {
    console.error("Erro ao processar orçamento:", error);
    return json<ActionData>({ 
      error: "Erro ao processar orçamento. Tente novamente." 
    });
  }
}

export default function Orcamento() {
  const { colors, paintTypes, selectedColor, selectedPaintType: preselectedPaintType } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  
  const [selectedPaintType, setSelectedPaintType] = useState<string>(preselectedPaintType?.id || "");
  const [selectedColorId, setSelectedColorId] = useState<string>(selectedColor?.id || "");
  const [area, setArea] = useState<string>("");
  const [calculatedQuantity, setCalculatedQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const isSubmitting = navigation.state === "submitting";

  // Calcular quantidade e preço quando área ou tipo de tinta mudam
  useEffect(() => {
    if (area && selectedPaintType) {
      const paintType = paintTypes.find(pt => pt.id === selectedPaintType);
      if (paintType) {
        const areaNum = parseFloat(area);
        const coverage = parseFloat(paintType.coverage.split("-")[0]); // Pega o menor valor de cobertura
        const quantity = Math.ceil(areaNum / coverage);
        const finalQuantity = Math.max(quantity, paintType.min_quantity);
        
        setCalculatedQuantity(finalQuantity);
        setTotalPrice(finalQuantity * paintType.price_per_liter);
      }
    }
  }, [area, selectedPaintType, paintTypes]);

  const selectedPaint = paintTypes.find(pt => pt.id === selectedPaintType);
  const selectedColorObj = colors.find(color => color.id === selectedColorId);

  if (actionData?.success) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Orçamento Enviado!
              </h2>
              <p className="text-gray-600 mb-4">
                Seu orçamento foi registrado com sucesso.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">
                  Número do Orçamento: {actionData.quoteId}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Entraremos em contato em até 24 horas com o orçamento detalhado.
              </p>
              <div className="space-y-2">
                <a
                  href="/orcamento"
                  className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Novo Orçamento
                </a>
                <a
                  href="/cores"
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ver Paleta de Cores
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Solicitar Orçamento
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Escolha o tipo de tinta, a cor e calcule seu orçamento
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Form method="post" className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <div className="space-y-6">
                {/* Tipo de Tinta */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brush className="w-5 h-5" />
                    Tipo de Tinta
                  </h2>
                  <div className="grid gap-3">
                    {paintTypes.map((paintType) => (
                      <label
                        key={paintType.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPaintType === paintType.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paintType"
                          value={paintType.id}
                          checked={selectedPaintType === paintType.id}
                          onChange={(e) => setSelectedPaintType(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{paintType.icon}</span>
                            <h3 className="font-semibold">{paintType.name}</h3>
                            <span className="text-sm text-green-600 font-semibold">
                              R$ {paintType.price_per_liter.toFixed(2)}/L
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{paintType.description}</p>
                          <div className="text-xs text-gray-500">
                            <p>Cobertura: {paintType.coverage} m²/L</p>
                            <p>Aplicações: {paintType.applications.join(", ")}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cor */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Cor
                  </h2>
                  <select
                    name="colorId"
                    value={selectedColorId}
                    onChange={(e) => setSelectedColorId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione uma cor</option>
                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name} ({color.hex_code})
                      </option>
                    ))}
                  </select>
                  
                  {selectedColorObj && (
                    <div className="mt-3 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedColorObj.hex_code }}
                      />
                      <span className="font-medium">{selectedColorObj.name}</span>
                      <span className="text-sm text-gray-500">{selectedColorObj.hex_code}</span>
                    </div>
                  )}
                </div>

                {/* Área */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Área a Pintar
                  </h2>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Ex: 50"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      step="0.1"
                      required
                    />
                    <span className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                      m²
                    </span>
                  </div>
                  
                  {calculatedQuantity > 0 && selectedPaint && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Cálculo Estimado:</h3>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p>Quantidade necessária: <strong>{calculatedQuantity} litros</strong></p>
                        <p>Cobertura: {selectedPaint.coverage} m²/L</p>
                        <p>Quantidade mínima: {selectedPaint.min_quantity}L</p>
                        <p className="text-lg font-bold text-blue-800 mt-2">
                          Total estimado: R$ {totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dados do Cliente */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Seus Dados
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Nome completo"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="E-mail"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="tel"
                      name="customerPhone"
                      placeholder="Telefone/WhatsApp"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <textarea
                      name="observations"
                      placeholder="Observações adicionais (opcional)"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPaintType || !selectedColorId || !area}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Solicitar Orçamento
                    </>
                  )}
                </button>

                {actionData?.error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    {actionData.error}
                  </div>
                )}
              </div>

              {/* Resumo */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Resumo do Orçamento</h2>
                  
                  {selectedPaint && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{selectedPaint.icon}</span>
                        <div>
                          <h3 className="font-semibold">{selectedPaint.name}</h3>
                          <p className="text-sm text-gray-600">R$ {selectedPaint.price_per_liter.toFixed(2)}/L</p>
                        </div>
                      </div>
                      
                      {selectedColorObj && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: selectedColorObj.hex_code }}
                          />
                          <div>
                            <h3 className="font-semibold">{selectedColorObj.name}</h3>
                            <p className="text-sm text-gray-600">{selectedColorObj.hex_code}</p>
                          </div>
                        </div>
                      )}
                      
                      {area && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p><strong>Área:</strong> {area} m²</p>
                          {calculatedQuantity > 0 && (
                            <>
                              <p><strong>Quantidade:</strong> {calculatedQuantity} litros</p>
                              <p className="text-lg font-bold text-green-600 mt-2">
                                Total: R$ {totalPrice.toFixed(2)}
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!selectedPaint && (
                    <p className="text-gray-500 text-center py-8">
                      Selecione um tipo de tinta para ver o resumo
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Campos ocultos para o cálculo */}
            <input type="hidden" name="quantity" value={calculatedQuantity} />
          </Form>
        </div>
      </div>
    </Layout>

  );
}
