import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { 
  Paintbrush, 
  Award, 
  Users, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Mail as Envelope,
  Globe,
  Heart,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Qualidade Premium",
      description: "Compromisso com a excelência em cada lata que produzimos."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustentabilidade",
      description: "Práticas ecológicas em todos os processos de produção."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Inovação",
      description: "Constante evolução para atender às necessidades do mercado."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Paixão",
      description: "Amor pelo que fazemos refletido em cada produto."
    }
  ];

  const team = [
    {
      name: "Carlos Mendes",
      role: "Fundador & CEO",
      image: "/images/team/carlos.jpg",
      bio: "Com mais de 20 anos de experiência na indústria de tintas."
    },
    {
      name: "Ana Silva",
      role: "Diretora de Inovação",
      image: "/images/team/ana.jpg",
      bio: "Especialista em desenvolvimento de novas formulações."
    },
    {
      name: "Roberto Santos",
      role: "Diretor de Produção",
      image: "/images/team/roberto.jpg",
      bio: "Responsável por garantir a qualidade em cada etapa."
    },
    {
      name: "Fernanda Costa",
      role: "Diretora de Sustentabilidade",
      image: "/images/team/fernanda.jpg",
      bio: "Lidera nossas iniciativas ecológicas e responsáveis."
    }
  ];

  const milestones = [
    { year: "2008", event: "Fundação da Prorevest" },
    { year: "2012", event: "Lançamento da linha premium" },
    { year: "2015", event: "Expansão para 5 estados" },
    { year: "2018", event: "Certificação ambiental ISO 14001" },
    { year: "2020", event: "Inauguração da nova fábrica" },
    { year: "2023", event: "Reconhecimento como marca líder" }
  ];

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 pt-20">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="font-bold">NOSSA HISTÓRIA</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Transformando Espaços com <span className="text-primary">Cores e Qualidade</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Há mais de 15 anos, a Prorevest tem se dedicado a criar produtos de excelência
              que transformam ambientes e inspiram criatividade.
            </p>
            
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-muted-foreground">Anos de Experiência</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-muted-foreground">Produtos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-muted-foreground">Clientes Satisfeitos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-muted-foreground">Taxa de Recomendação</div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
                <p className="text-muted-foreground mb-6">
                  Fundada em 2008 por Carlos Mendes, um visionário apaixonado por cores e qualidade,
                  a Prorevest começou como uma pequena fábrica com grandes ambições.
                  O compromisso com a excelência e a inovação rapidamente nos destacou no mercado.
                </p>
                <p className="text-muted-foreground mb-6">
                  Ao longo dos anos, expandimos nossa operação e diversificamos nossa linha de produtos, 
                  mantendo sempre o foco na qualidade e na satisfação do cliente. Hoje, somos 
                  reconhecidos como referência em tintas e texturas no Brasil.
                </p>
                <p className="text-muted-foreground">
                  Nossa jornada é marcada por inovação constante, práticas sustentáveis e 
                  um profundo respeito pelo meio ambiente. Cada produto que desenvolvemos 
                  carrega consigo a paixão e o compromisso que nos definem.
                </p>
              </div>
              <div className="bg-muted rounded-2xl h-96 flex items-center justify-center">
                <img
                  src="/images/about/factory.jpg"
                  alt="Fábrica Prorevest"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl shadow-lg p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nossos Marcos</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                      <div className="text-lg">{milestone.event}</div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-card shadow-lg"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nossa Equipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="bg-muted h-64 flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sustainability */}
          <section className="mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Compromisso com a Sustentabilidade</h2>
                <p className="text-muted-foreground mb-6">
                  Na Prorevest, acreditamos que é possível criar produtos de qualidade
                  sem comprometer o meio ambiente. Nossas práticas sustentáveis incluem:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Formulações com baixo impacto ambiental</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Embalagens recicláveis e biodegradáveis</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Processos de produção com eficiência energética</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Programas de reciclagem e reutilização</span>
                  </li>
                </ul>
                <Link 
                  to="/sustentabilidade" 
                  className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Saiba mais sobre nossas iniciativas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-muted rounded-2xl h-80 flex items-center justify-center">
                <Leaf className="h-24 w-24 text-primary" />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Pronto para Transformar seu Espaço?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Descubra nossa linha completa de produtos e encontre a combinação perfeita para seu projeto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalogo" 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Paintbrush className="mr-2 h-5 w-5" />
                Explorar Produtos
              </Link>
              <Link 
                to="/contato" 
                className="bg-card border border-border text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-muted transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Entrar em Contato
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
