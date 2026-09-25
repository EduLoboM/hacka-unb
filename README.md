# 📌 Hub FGA - Mural Universitário & Mobilidade da UnB Gama

Plataforma web gamificada para a comunidade acadêmica da **Universidade de Brasília - Campus Gama (FGA)**, combinando uma estética skeuomórfica de **Quadro de Cortiça Universitário (Corkboard)** com mecânicas de **Gamificação Pesada** (XP, Karma, 20 Níveis Universitários, Missões Diárias e Conquistas).

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [SvelteKit](https://svelte.dev/) com **Svelte 5** (Runes: `$state`, `$derived`, `$props`)
- **Estilização & Design System:** [UnoCSS](https://unocss.dev/) (Presets Uno, Icons e atalhos customizados de cortiça e post-it)
- **Linguagem:** TypeScript com tipagem estrita
- **Ícones:** `@lucide/svelte`
- **Áudio Imersivo:** Web Audio API sintético nativo (sem assets externos de áudio)
- **Persistência:** `localStorage` reativo no cliente

---

## 🎨 Design Skeuomórfico & Experiência Tátil

1. **Superfície de Cortiça Orgânica e Porosa:**
   - Textura procedural realista gerada com filtro fractal SVG de turbulência contínua (`feTurbulence`), eliminando qualquer padrão de pontinhos repetitivos.
   - Vinheta radial e tons quentes de madeira prensada (`#c19a6b`, `#a47c48`, `#785328`).
   - Moldura de madeira chanfrada com sombras internas de profundidade física.
2. **Fixadores Físicos Distintos por Seção:**
   - **Chamados (Ação & Segurança):** Fixados com **Alfinetes de Bola 3D com Parallax Interativo** ([Pin.svelte](file:///home/eduardolm/Documents/GAMADO/src/lib/components/Pin.svelte)), cuja luz e sombra reagem dinamicamente ao mouse/toque.
   - **Mobilidade (Fichas da SEMOB-DF):** Presas nas pontas com **Fita Adesiva Transparente / Durex** ([ClearTape.svelte](file:///home/eduardolm/Documents/GAMADO/src/lib/components/ClearTape.svelte)), simulando folhas coladas no ponto de ônibus com reflexo celofane e bordas recortadas.
   - **Avisos Acadêmicos (Mural Universitário):** Fixados no topo com **Grampos Metálicos Galvanizados de Grampeador de Mural** ([Staple.svelte](file:///home/eduardolm/Documents/GAMADO/src/lib/components/Staple.svelte)), com furos de perfuração e brilho de aço escovado.
3. **Fitas Adesivas (Washi Tapes) & Carimbos de Tinta:**
   - Fitas adesivas nos cantos dos cards para categorias e rotas.
   - Carimbos universitários manuais (`PASSOU`, `ATRASADO`, `LOTADO`) com vazamento de tinta e selos de cera (*wax seals*) animados para recompensas de XP.

---

## 📱 Responsividade PC vs. Mobile

- **Desktop / Telas Grandes:**
  - **Sidebar Lateral Esquerda Fixa ("Mural de Conquistas"):** Painel completo do aluno com Avatar, Nível atual, Barra de XP animada, Saldo de Karma, Conquistas e Missões Diárias ativas.
  - **Grid de Cortiça Amplo:** Layout estilo Masonry de 3 a 4 colunas expansivas.
- **Mobile:**
  - Feed em coluna única vertical otimizado para scroll contínuo com touch.
  - **Bottom Navigation Bar ("Régua Universitária"):** Navegação na base da tela com acesso rápido a Chamados, Ônibus, Avisos e botão central flutuante para fixar novo post-it.
  - **Gaveta Superior Expansível:** Painel de perfil e progresso de missões acessível em 1 toque.

---

## 🎮 Mecânicas Centrais de Gamificação

### 1. Sistema de Níveis Universitários (1 a 20)
| Nível | Título | Faixa de XP | Perk Universitário |
|---|---|---|---|
| **1** | Calouro Perdido | 0 - 100 XP | Acesso liberado ao mural e caravanas |
| **2** | Desbravador do UAC | 100 - 250 XP | Pode confirmar presença em até 3 caravanas |
| **3** | Freguês do RU | 250 - 450 XP | Pode votar na lotação dos ônibus |
| **4** | Sobrevivente de Cálculo 1 | 450 - 700 XP | Desbloqueia pin azul para seus posts |
| **5** | Corredor da 480 | 700 - 1000 XP | Criação de caravana com badge destacada |
| **...** | ... | ... | ... |
| **11** | Oráculo do BRT | 4000 - 5000 XP | Votos de ônibus têm peso duplo na comunidade |
| **16** | Monitor Lendário | 11000 - 13000 XP | Avisos fixados no topo por 24h |
| **20** | Lenda Imortal da FGA | 22000+ XP | Pin Diamante Mítico e aura cintilante nos posts |

### 2. Ações Recompensadas
- **Criar caravana noturna:** `+60 XP` (+5 Karma)
- **Confirmar presença em caravana ("+1 Vou Junto"):** `+30 XP` (+2 Karma)
- **Candidatar-se / criar Squad de PI:** `+45 XP` (+4 Karma)
- **Reportar status de ônibus (Passou / Atrasado / Lotado):** `+15 XP` (+1 Karma)
- **Marcar aviso ou edital como lido:** `+10 XP` (+1 Karma)

---

## 🗂️ Estrutura das Abas

1. **Chamados (Ação e Segurança Imediata):**
   - **Caravanas DF-480 / BRT:** Saídas noturnas em grupo com horário, origem, destino e lista de alunos confirmados.
   - **Esquadrões / PI:** Recrutamento multidisciplinar entre Engenharias (Software, Aero, Auto, Eletrônica, Energia).
   - **Alertas Relâmpago:** Avisos de segurança com pin vermelho de emergência.
2. **Mobilidade (Fichas Oficiais da SEMOB-DF):**
   - Linhas cobertas: **0.234** (Gama ⇄ Águas Claras/Taguatinga via FGA/Pistão Sul/Areal), **2201** (Expresso BRT DF-480), **2202** (Parador BRT), **2208** (Expresso SIG), **205** (Eixo W) e **205.1** (Semi-Expresso).
   - **Quadro Oficial de Partidas da SEMOB-DF:** Grade de viagens programadas com detector automático da próxima partida destacado com efeito de **marca-texto amarelo fluorescente** e contagem regressiva em minutos.
   - **Dica da FGA:** Anotações manuscritas autênticas à caneta azul com macetes de transporte dos veteranos.
   - **Validação com Carimbos de Tinta Físicos (*Rubber Stamps*):** Carimbos de carimbeira (`PASSOU`, `ATRASADO`, `LOTADO`) que 'batem' diretamente na folha com tinta e rotação física (+15 XP).
   - **Link Direto:** Acesso ao portal oficial **DF no Ponto** da SEMOB-DF para consulta do GPS em tempo real.
3. **Avisos (Mural Acadêmico):**
   - Editais de EJs (Orc'sLab, etc.), PIBIC/PIBITI, eventos da Atlética Manada e workshops.
   - Carimbo com tempo restante de validade (*Expira em 48h*).

---

## 🚀 Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Checagem de tipos Svelte 5 / TypeScript
npm run check

# Gerar build de produção
npm run build

# Pré-visualizar build de produção
npm run preview
```
