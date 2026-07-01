import type { Disciplina } from "./types";

/**
 * Dados das disciplinas do curso
 *
 * Para adicionar uma nova disciplina:
 * 1. Adicione um novo objeto ao array com todos os campos obrigatórios
 * 2. Use preRequisitos: [] se não houver pré-requisito, ou liste os IDs
 *    (ex.: preRequisitos: ["CC117", "CC118"] para múltiplos pré-requisitos)
 * 3. Informe os creditos da disciplina
 *
 * Para remover uma disciplina:
 * 1. Delete o objeto correspondente
 * 2. Atualize outras disciplinas que a tinham como pré-requisito
 */
export const disciplinas: Disciplina[] = [
  {
    id: "CC117",
    nome: "CALCULO DIFERENCIAL E INTEGRALI",
    preRequisitos: [],
    creditos: 4,
    semestre: 1,
    ementa: "Funções. Limite e continuidade. Derivadas. Antiderivada.",
  },
  {
    id: "CC118",
    nome: "GEOMETRIA ANALITICA",
    preRequisitos: [],
    creditos: 4,
    semestre: 1,
    ementa:
      "Matrizes e sistemas de equações lineares. Vetores, espaços e subespaços vetoriais. Independência linear e bases. Sistemas de coordenadas. Retas e planos. Distâncias e ângulos. Superficies. Translação, rotação, reflexão, deformação e suas matrizes.",
  },
  {
    id: "CC116",
    nome: "MATEMATICA DISCRETA",
    preRequisitos: [],
    creditos: 4,
    semestre: 1,
    ementa:
      "Técnicas de demonstração. Indução. Conjuntos. Permutações e Combinações. Relações e Funções.",
  },
  {
    id: "CC119",
    nome: "ORGANIZACAO DE COMPUTADORES",
    preRequisitos: [],
    creditos: 4,
    semestre: 1,
    ementa:
      "Evolução dos computadores, processador, memória, dispositivos de entrada e saída, barramentos, sistema de numeração. Algebra booleana, portas lógicas, circuitos combinacionais, circuitos sequenciais, memória, conversores e dispositivos programáveis.",
  },
  {
    id: "CC115",
    nome: "PROGRAMACAO E ALGORITMOS",
    preRequisitos: [],
    creditos: 4,
    semestre: 1,
    ementa:
      "Definição de algoritmo, análise de algoritmos, noções de linguagem de alto nível, processos de compilação e interpretação. Procedimentos e Funções. Ponteiros. Alocação dinâmica de memória. Estrutura de dados. Espaço de Nomes. Entrada e saída com arquivos. Técnicas para melhoria do rendimento em programação.",
  },
  {
    id: "CC122",
    nome: "CALCULO DIFERENCIAL E INTEGRAL II",
    preRequisitos: ["CC117"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Integral de Riemann e Teorema Fundamental do Cálculo. Técnicas de primitivação. Sequências e séries numéricas. Séries de potência e de Fourier. Equações diferenciais ordinárias lineares.",
  },
  {
    id: "CC123",
    nome: "ALGEBRA LINEAR PARA COMPUTACAO",
    preRequisitos: ["CC118"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Sistemas de equações lineares. Determinantes. Espaços vetoriais. Transformações lineares. Autovalores e autovetores. Aplicações.",
  },
  {
    id: "CC125",
    nome: "LOGICA PARA COMPUTACAO",
    preRequisitos: ["CC116"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Conjuntos. Lógica proposicional. Métodos de demonstração. Lógica de predicados.",
  },
  {
    id: "CC121",
    nome: "ARQUITETURA DE COMPUTADORES",
    preRequisitos: ["CC119"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Evolução dos computadores, desempenho, projeto do conjunto de instruções, projeto do processador, pipeline e paralelismo, organização de memória, interface de entrada e saída, arquiteturas multi-processadores.",
  },
  {
    id: "CC120",
    nome: "PROGRAMACAO ORIENTADA A OBJETO",
    preRequisitos: ["CC115"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Ponteiros. Alocação dinâmica de memória. Espaço de Nomes. Entrada e saída com arquivos. Classes, Objetos, Métodos. Encapsulamento de atributos e métodos. Abstração. Membros. Herança. Polimorfismo. Construtores e Destrutores. Relacionamento entre classes. Membros estáticos e virtuais. Biblioteca padrão. Programação genérica (templates).",
  },
  {
    id: "CC124",
    nome: "FISICA PARA COMPUTACAO",
    preRequisitos: ["CC117"],
    creditos: 4,
    semestre: 2,
    ementa:
      "Medidas Físicas, Eletrostática, Eletrodinâmica, Oscilações, Ondas, Eletromagnetismo.",
  },
  {
    id: "CC128",
    nome: "CALCULO DIFERENC. E INTEGRAL III",
    preRequisitos: ["CC122"],
    creditos: 4,
    semestre: 3,
    ementa: "Funções. Limite e continuidade. Derivadas. Antiderivada.",
  },
  {
    id: "CC129",
    nome: "COMPUTACAO GRAFICA",
    preRequisitos: ["CC123"],
    creditos: 4,
    semestre: 3,
    ementa:
      "Introdução à computação gráfica. Computação Gráfica Bidimensional: primitivas 2D, atributos, transformações geométricas e animação. Computação Gráfica Tridimensional; primitivas 3D, rasterização, ray tracing, transformações espaciais, textualização, iluminação e animação.",
  },
  {
    id: "CC131",
    nome: "TEORIA DOS AUTOMATOS E LING. FORMAIS",
    preRequisitos: ["CC125"],
    creditos: 4,
    semestre: 3,
    ementa: "",
  },
  {
    id: "CC127",
    nome: "SISTEMAS OPERACIONAIS",
    preRequisitos: ["CC121"],
    creditos: 4,
    semestre: 3,
    ementa:
      "Serviços de sistemas operacionais. Gerência do processador. Programação concorrente e deadlock. Gerência de memória. Gerência de arquivos. Gerência de entrada e saída, Virtualização. Segurança.",
  },
  {
    id: "CC126",
    nome: "ESTRUTURA DE DADOS",
    preRequisitos: ["CC120"],
    creditos: 4,
    semestre: 3,
    ementa:
      "Introdução a Estrutura de Dados. Introdução à Análise de Algoritmos. Estruturas Sequenciais (Listas, Filas e Pilhas), variações e implementações. Estruturas Múltiplos Caminhos (Árvores, Árvores Binárias, Árvores Balanceadas). Métodos de ordenação e Tabelas Hash.",
  },
  {
    id: "CC130",
    nome: "PROBABILIDADE E ESTATISTICA",
    preRequisitos: ["CC122"],
    creditos: 4,
    semestre: 3,
    ementa:
      "Eventos e probabilidade. Espaços amostrais finitos. Probabilidade condicionada e independência. Esperança matemática, variância e coeficiente de correlação. Variáveis aleatórias discretas. Variáveis aleatórias contínuas. Regressão e correlação. Testes de hipóteses.",
  },
  {
    id: "CC135",
    nome: "CALCULO NUMERICO",
    preRequisitos: ["CC128"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Aspectos básicos da Computação Numérica. Aritmética de máquina e erros. Solução de equações transcendentes. Estudos das Reizes de Polinômio. Interpolação e aproximação. Sistemas de equações lineares. Integração numérica.",
  },
  {
    id: "CC134",
    nome: "AVALIACAO DE DESEMPENHO",
    preRequisitos: ["CC130"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Fundamentos de avaliação de desempenho, seleção de técnicas, métricas e cargas de trabalho. Experimentação: intervalo de confiança, teste de hipótese, regressão linear e planejamento de experimentos. Simulação: conceitos, geração de números aleatórios, geração de variáveis aleatórias, método de Monte Carlo. Modelagem Analítica: conceitos de processos estocásticos, teoria das filas, fila única, rede de filas e suas aplicações.",
  },
  {
    id: "CC136",
    nome: "TEORIA DA COMPUTABILIDADE",
    preRequisitos: ["CC131"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Máquina de Turing: MT como Reconhecedor de Linguagens e Avaliador de Funções; Hierarquia de Chomsky; Decidibilidade: Problemas de Decisão, Tese de Church Turing, O Problema da Parada, A Máquina Universal, Redutibilidade de Problemas e Problemas Indecidíveis de Linguagem Livre de Contexto; Computação Numérica: Computação de Funções, Funções Numéricas, Composições de Funções e Funções Não Computáveis; Funções M-Recursivas: Funções Primitivas Recursivas, Operadores de Limite, Funções de Divisões, Funções Parcialmente Computáveis e M-Recursivas.",
  },
  {
    id: "CC137",
    nome: "BANCO DE DADOS",
    preRequisitos: ["CC120"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Introdução a Bancos de Dados e Sistemas Gerenciadores de Bancos de Dados. Tipos de Banco de Dados, Projeto conceitual de banco de dados; Projeto Lógico de um banco de dados, Comandos SQL, Criando aplicações com bancos de dados.",
  },
  {
    id: "CC133",
    nome: "TEORIA DOS GRAFOS",
    preRequisitos: ["CC126"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Notação e Definições; Representação de Grafos; Ordenação Topológica; Componentes Fortemente Conexos; Árvore Geradora Mínima; Caminho Mínimo em Grafos; Rede de Fluxos; Coloração de Grafos;",
  },
  {
    id: "CC132",
    nome: "ENGENHARIA DE SOFTWARE",
    preRequisitos: ["CC120"],
    creditos: 4,
    semestre: 4,
    ementa:
      "Fundamentos da Engenharia de Software, Processos de software, Desenvolvimento Ágil, Engenharia de Requisitos, Modelagem de Sistemas, Projeto e Implementação, Verificação e Validação, Testes e Evolução.",
  },
  {
    id: "CC154",
    nome: "EXTENSAO Ι",
    preRequisitos: [],
    creditos: 4,
    semestre: 5,
    ementa: "",
  },
  {
    id: "CC139",
    nome: "REDES DE COMPUTADORES",
    preRequisitos: ["CC134"],
    creditos: 4,
    semestre: 5,
    ementa:
      "Introdução à comunicação de dados, Camada fisica, Camada de enlace, Camada de Rede, Camada de Transporte, Camada de Aplicação, Novas tecnologias e tendências.",
  },
  {
    id: "CC140",
    nome: "INTELIGENCIAL COMPUTACIONAL",
    preRequisitos: ["CC131"],
    creditos: 4,
    semestre: 5,
    ementa:
      "Definição e Problemas de Inteligência Computacional (IC); Agentes Inteligentes; Resolução de Problemas como Busca em um Espaço de Estados; Computação Evolutiva, Agentes Lógico; Sistema Fuzzy; Introdução ao Aprendizado Conexionista.",
  },
  {
    id: "CC138",
    nome: "PROGRAMACAO CONCORRENTE E PARALELA",
    preRequisitos: ["CC127"],
    creditos: 4,
    semestre: 5,
    ementa:
      "Introdução à programação concorrente, Arquiteturas e modelos de programação Algoritmos de programação concorrente e paralela, Bibliotecas e ferramentas.",
  },
  {
    id: "CC142",
    nome: "PROJETO E ANALISE DE ALGORITMOS",
    preRequisitos: ["CC133"],
    creditos: 4,
    semestre: 5,
    ementa:
      "Análise de Algoritmos, Notação Assintótica, Provas de Corretude, Algoritmos Determinísticos, Algoritmos Não Determinísticos, Complexidade.",
  },
  {
    id: "CC141",
    nome: "ANALISE E PROJETO DE SOFTWARE",
    preRequisitos: ["CC132"],
    creditos: 4,
    semestre: 5,
    ementa:
      "Introdução a Modelagem de sistemas. Linguagem de Modelagem Unificada (UML). Processos de desenvolvimento de software. Modelagem de Requisitos. Modelagem de classes de análise. Modelagem de interação. Projeto de classes de software. Projeto de Arquitetura. Projeto de Banco de dados.",
  },
  {
    id: "CC147",
    nome: "COMPILADORES",
    preRequisitos: ["CC136"],
    creditos: 4,
    semestre: 6,
    ementa:
      "Conceitos básicos. Fases da compilação. Tipos de Compiladores. Análise Léxica. Análise Sintática. Análise Semântica. Geração de Código. Definição de uma linguagem e implementação de um compilador para uma máquina hipotética.",
  },
  {
    id: "CC155",
    nome: "EXTENSAO II",
    preRequisitos: [],
    creditos: 4,
    semestre: 6,
    ementa:
      "Eng. de Software Aplicações Comunitárias II. Introdução à Engenharia de Software: Conceitos básicos e aplicações em projetos de extensão compreensão dos fundamentos e como aplicá-los em projetos de extensão. Ciclo de Vida de Desenvolvimento de Software: Modelos de desenvolvimento e sua aplicação em projetos comunitários - aplicação prática de modelos de desenvolvimento, como o modelo em cascata, iterativo e ágil. Modelagem e Especificação de Requisitos: Técnicas para captar e documentar necessidades comunitárias - técnicas para elicitação, análise e especificação de requisitos com foco nas necessidades da comunidade. Design e Arquitetura de Software: Métodos de design para soluções comunitárias criação de arquiteturas de software eficientes e adaptáveis às demandas comunitárias. Teste e Garantia de Qualidade: Técnicas de teste aplicadas a projetos de software comunitário estratégias de teste para garantir a qualidade dos sistemas desenvolvidos. Desenvolvimento de Software Ágil: Métodos ágeis como Scrum e Kanban aplicados a projetos comunitários uso de métodos ágeis para aumentar a eficiência e adaptabilidade dos projetos. Envolvimento em Projetos de Software: Projetos que visam resolver problemas específicos da comunidade realização de projetos reais que trazem beneficios diretos para a comunidade.",
  },
  {
    id: "CC145",
    nome: "INTERACAO HUMANO COMPUTADOR",
    preRequisitos: ["CC132"],
    creditos: 4,
    semestre: 6,
    ementa:
      "Conceitos de IHC; Técnicas e Processos de projeto da interação; Prototipagem; Princípios de projeto de interfaces; Avaliação de interfaces.",
  },
  {
    id: "CC144",
    nome: "PROCESSAMENTO DE IMAGENS",
    preRequisitos: ["CC123"],
    creditos: 4,
    semestre: 6,
    ementa:
      "Introdução à computação gráfica. Computação Gráfica Bidimensional: primitivas 2D, atributos, transformações geométricas e animação. Computação Gráfica Tridimensional; primitivas 3D, rasterização, ray tracing, transformações espaciais, textualização, iluminação e animação.",
  },
  {
    id: "CC143",
    nome: "PROGRAMACAO MATEMATICA",
    preRequisitos: ["CC135"],
    creditos: 4,
    semestre: 6,
    ementa:
      "Definição e formulação de problemas de programação matemática. A teoria clássica da otimização. Teoria da programação linear e o método simplex. Dualidade e análise de sensibilidade em programação linear.",
  },
  {
    id: "CC146",
    nome: "SISTEMAS DISTRIBUIDOS",
    preRequisitos: ["CC139"],
    creditos: 4,
    semestre: 6,
    ementa:
      "Componentes de sistemas distribuídos: comunicação, processos, serviço de nomes, sincronização, consistência, replicação, tolerância à falhas e segurança; Exemplos de sistemas distribuídos.",
  },
  {
    id: "CC150",
    nome: "ADMINISTRACAO E EMPREEND. P/COMPUTACAO",
    preRequisitos: [],
    creditos: 4,
    semestre: 7,
    ementa: "",
  },
  {
    id: "CC149",
    nome: "CIENCIA DE DADOS",
    preRequisitos: ["CC140"],
    creditos: 4,
    semestre: 7,
    ementa:
      "Introdução e Conceitos Fundamentais em Ciência de Dados. Análise Exploratória de Dados. Aprendizagem de Máquina.",
  },
  {
    id: "CC152",
    nome: "ESTAGIO",
    preRequisitos: [],
    creditos: 6,
    semestre: 7,
    ementa:
      "I.Introdução ao Estágio: Apresentação dos objetivos e estrutura do estágio, Orientações sobre a conduta profissional, Importância do estágio na formação acadêmica e profissional. II.Planejamento do Estágio: Definição dos objetivos individuais do estágio, Seleção do local de estágio, Elaboração do plano de atividades. III.Execução do Estágio: Desenvolvimento das atividades previstas no plano de estágio, Aplicação de conhecimentos teóricos em projetos práticos, Participação em reuniões, treinamentos e outras atividades profissionais. IV.Acompanhamento e Avaliação: Relatórios parciais e finais, Feedback contínuo do orientador acadêmico e supervisor da empresa, Autoavaliação e avaliação por parte da empresa. V.Apresentação dos Resultados: Elaboração do relatório final de estágio, Apresentação oral dos resultados obtidos durante o estágio, discussão e análise crítica da experiência de estágio.",
  },
  {
    id: "CC148",
    nome: "INFORMATICA NA SOCIEDADE E ETICA",
    preRequisitos: [],
    creditos: 4,
    semestre: 7,
    ementa:
      "O computador na sociedade moderna. O desenvolvimento tecnológico. Aspectos sociais e econômicos da utilização do computador. Atuação do profissional no mercado de trabalho. Automação, Robótica e Desemprego. Aspectos éticos e legais. Ética profissional. Ética empresarial. A função pública do profissional da computação.",
  },
  {
    id: "CC151",
    nome: "PESQUISA EM COMPUTACAO",
    preRequisitos: ["CC142"],
    creditos: 4,
    semestre: 7,
    ementa:
      "I. Introdução à Pesquisa Científica: Definição e importância da pesquisa científica, Tipos de pesquisa: exploratória, descritiva, explicativa, aplicada e básica, Ética na pesquisa científica. II. Formulação do Problema de Pesquisa: Identificação de problemas e lacunas na literatura, Definição de objetivos e hipóteses de pesquisa, Revisão bibliográfica: técnicas e ferramentas. III. Metodologia de Pesquisa: Métodos qualitativos e quantitativos, Técnicas de coleta de dados: entrevistas, questionários, observação, experimentos, Análise de dados: estatística descritiva e inferencial, análise qualitativa. IV. Elaboração do Projeto de Pesquisa: Estrutura e componentes de um projeto de pesquisa, Cronograma e planejamento de atividades, Redação de propostas de pesquisa. V. Redação Científica: Estrutura de artigos científicos e trabalhos acadêmicos, Normas e estilos de formatação, Ferramentas para gestão de referências e escrita colaborativa. VI. Apresentação de Resultados: Preparação de apresentações orais e pôsteres científicos, Técnicas de comunicação eficaz, Participação em seminários e congressos.",
  },
  {
    id: "CC156",
    nome: "EXTENSAO III",
    preRequisitos: [],
    creditos: 4,
    semestre: 8,
    ementa:
      "Inteligência Artificial e Otimização de Sistemas - Aplicações Comunitárias III Introdução à Inteligência Artificial: Conceitos básicos e aplicações em projetos de extensão compreensão dos conceitos fundamentais e como eles podem ser aplicados em projetos que beneficiem a comunidade. Algoritmos de Busca e Otimização: Técnicas para resolver problemas comunitários utilização de algoritmos para otimizar recursos comunitários e resolver problemas logísticos. Redes Neurais e Aprendizado Profundo: Fundamentos e aplicações práticas implementação de modelos que aprendem e tomam decisões baseadas em dados. Processamento de Linguagem Natural: Técnicas para melhorar a comunicação comunitária desenvolvimento de ferramentas para facilitar a comunicação e o acesso à informação na comunidade. Otimização de Sistemas: Métodos de otimização e suas aplicações em contextos comunitários - aplicação de técnicas de otimização para melhorar a eficiência de sistemas comunitários. Aprendizado de Máquina Supervisionado e Não Supervisionado: Métodos e aplicações práticas - aplicação de métodos de aprendizado para analisar dados comunitários e identificar padrões. Visão Computacional: Aplicações em segurança e monitoramento utilização de técnicas de visão computacional para monitoramento e segurança comunitária. IA na Saúde: Aplicações para melhorar serviços de saúde comunitários implementação de soluções de IA para melhorar diagnósticos e tratamentos em clínicas comunitárias.",
  },
  {
    id: "CC157",
    nome: "EXTENSAO IV",
    preRequisitos: [],
    creditos: 4,
    semestre: 8,
    ementa:
      "Redes de Computadores, Segurança da Informação e Sistemas Distribuídos Aplicações Comunitárias IV Fundamentos de Redes de Computadores: Conceitos básicos e aplicação prática em projetos comunitários introdução aos conceitos essenciais de redes e sua aplicação prática. Protocolos de Comunicação: Implementação de protocolos com foco em contextos comunitários - estudo e implementação de protocolos com aplicações reais na comunidade. Arquitetura de Redes e Roteamento: Soluções arquitetônicas para redes comunitárias - planejamento e design de redes robustas e eficientes. Segurança em Redes: Princípios e práticas de segurança voltados para proteção comunitária - técnicas e ferramentas para garantir a segurança da informação. Sistemas Distribuídos: Fundamentos e aplicações em projetos de extensão - princípios de sistemas distribuídos e sua implementação prática. Tecnologias Emergentes: Redes sem fio, redes de sensores, SDN, e IoT aplicados a comunidades inteligentes aplicação de tecnologias inovadoras para melhorar a conectividade e a segurança. Projetos Comunitários: Desenvolvimento de projetos de redes, segurança e sistemas distribuídos com impacto comunitário desenvolvimento e implementação de projetos reais que beneficiam a comunidade.",
  },
  {
    id: "CC160",
    nome: "EXTENSAO V",
    preRequisitos: [],
    creditos: 4,
    semestre: 8,
    ementa: "",
  },
  {
    id: "CC153",
    nome: "PROJETO FINAL",
    preRequisitos: ["CC151"],
    creditos: 4,
    semestre: 8,
    ementa:
      "I. Introdução ao Projeto Final: Apresentação dos objetivos e estrutura do Projeto Final, Normas e regulamentos para a realização do projeto, Definição do tema e escolha do orientador. II. Planejamento do Projeto: Elaboração do plano de projeto, Definição de cronograma e metas, Revisão bibliográfica e estado da arte. III. Desenvolvimento do Projeto: Implementação do projeto conforme o plano de atividades, Aplicação de metodologias de desenvolvimento e gestão de projetos, Testes e validação dos resultados. IV. Documentação do Projeto: Estruturação do relatório final, Normas para redação científica e técnica, Elaboração de manuais e documentação complementar. V. Apresentação e Defesa do Projeto: Preparação da apresentação oral, Técnicas de apresentação e defesa de projetos, Realização da defesa perante a banca examinadora.",
  },
  {
    id: "CL179",
    nome: "ATIVIDADES ACADEMICAS CIENT. E CULTURAIS",
    preRequisitos: [],
    creditos: 4,
    semestre: 99,
    ementa: "",
  },
  {
    id: "AEE",
    nome: "ATIVIDADE ESPECIFICA DE EXTENSAO",
    preRequisitos: [],
    creditos: 4,
    semestre: 99,
    ementa: "",
  },
  {
    id: "CC159",
    nome: "GERENCIA DE PROJETOS",
    preRequisitos: ["CC141"],
    creditos: 4,
    semestre: 99,
    ementa:
      "Conceitos básicos da gerência de projetos; Ciclo de Vida de Projetos; PMBOK; Gerenciamento da Integração, Gerenciamento do Escopo, Gerenciamento do Tempo, Gerenciamento dos Custos, Gerenciamento da Qualidade, Gerenciamento dos Recursos Humanos, Gerenciamento dos Riscos.",
  },
  {
    id: "CT983",
    nome: "PADROES DE SOFTWARE",
    preRequisitos: ["CC120"],
    creditos: 4,
    semestre: 99,
    ementa:
      "Introdução aos Padrões de Software, sua definição, histórico, classificação quanto à área de aplicação e em relação ao processo de desenvolvimento, e seus formatos mais conhecidos; Descrição e discussão dos 23 padrões do GoF; Descrição e discussão dos 17 padrões do POSA, entre outros padrões.",
  },
  {
    id: "CT976",
    nome: "PROGRAMAÇÃO INTEIRA E COMBINATORIA",
    preRequisitos: [],
    creditos: 4,
    semestre: 99,
    ementa:
      "Grafos e redes. Algoritmos de planos de corte. Métodos enumerativos. Métodos de decomposição. Métodos não-exatos. Métodos Heurísticos para Otimização Combinatória.",
  },
  {
    id: "CC083",
    nome: "QUALIDADE DE SOFTWARE",
    preRequisitos: [],
    creditos: 4,
    semestre: 99,
    ementa:
      "O conceito de qualidade. Evolução do conceito de qualidade e histórico. Qualidade de Produto de Software. Normas ISO. Qualidade de Processo de Software. Modelos CMMI e MPS.BR. Métricas. Melhoria Contínua.",
  },
  {
    id: "CC109",
    nome: "REDES NEURAIS ARTIFICIAIS",
    preRequisitos: ["CC140"],
    creditos: 4,
    semestre: 99,
    ementa:
      "Fundamentos, Neurônio de McCulloch, Perceptrons, Neurônio de Widrow-Hoff, Aspectos Estruturais e de Aprendizado em Redes Neurais Artificiais (RNA), Modelos de RNA, Aplicações de RNA.",
  },
  {
    id: "CC158",
    nome: "SEGURANCA EM REDES",
    preRequisitos: ["CC139"],
    creditos: 4,
    semestre: 99,
    ementa:
      "Princípios de Segurança em redes. Criptografia. Algoritmos Criptográficos. Assinatura Digital. Certificados Digitais. Técnicas de Ataque e Ameaças. Malware Vírus, Trojans e Worms. Engenharia Social. Firewalls. Sistemas de Detecção de Intrusão.",
  },
  {
    id: "CC202",
    nome: "TOPIC. ESPECIAIS INTELIG. COMPUTACIONA",
    preRequisitos: ["CC140"],
    creditos: 4,
    semestre: 99,
    ementa: "",
  },
  {
    id: "CC200",
    nome: "TOPICOS ESPECIAIS EM PROG. MATAMATICA",
    preRequisitos: ["CC143"],
    creditos: 4,
    semestre: 99,
    ementa: "Ementa Livre.",
  },
  {
    id: "CC201",
    nome: "TOPICOS ESPECIAIS EM PROGRAMACAO",
    preRequisitos: ["CC132"],
    creditos: 4,
    semestre: 99,
    ementa: "Ementa Livre.",
  },
  {
    id: "CC111",
    nome: "TOPICOS ESPECIAIS ENG. DE SOFTWARE",
    preRequisitos: ["CC132"],
    creditos: 4,
    semestre: 99,
    ementa: "Ementa Livre.",
  },
];

/**
 * Semestre "sentinela" usado para agrupar disciplinas optativas/eletivas,
 * que não pertencem a um período fixo do fluxo.
 */
export const SEMESTRE_OPTATIVAS = 99;

/**
 * Retorna o rótulo de exibição de um semestre.
 * Semestres regulares viram "Nº Semestre"; o sentinela vira "Optativas".
 */
export function getSemestreLabel(semestre: number): string {
  return semestre === SEMESTRE_OPTATIVAS ? "Optativas" : `${semestre}º Semestre`;
}

/**
 * Retorna as disciplinas agrupadas por semestre
 */
export function getDisciplinasPorSemestre(): Map<number, Disciplina[]> {
  const porSemestre = new Map<number, Disciplina[]>();

  disciplinas.forEach((d) => {
    const lista = porSemestre.get(d.semestre) || [];
    lista.push(d);
    porSemestre.set(d.semestre, lista);
  });

  return porSemestre;
}

/**
 * Retorna uma disciplina pelo ID
 */
export function getDisciplinaById(id: string): Disciplina | undefined {
  return disciplinas.find((d) => d.id === id);
}
