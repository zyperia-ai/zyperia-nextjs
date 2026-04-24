import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies — ZYPERIA Intelligence",
  description: "Como usamos cookies e tecnologias similares.",
};

export default function CookiesPage() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = "24 de Abril de 2026";

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Legal</span>
        <h1 className="h-display text-4xl md:text-6xl mb-4">Política de Cookies</h1>
        <div className="text-xs text-[var(--text-muted)] h-mono mb-12">
          Última actualização: {lastUpdated}
        </div>

        <div className="prose-zyperia">
          <p>
            Esta Política de Cookies explica o que são cookies, quais usamos, e
            como os podes controlar. Para práticas de dados mais amplas, vê a
            nossa <Link href="/privacy">Política de Privacidade</Link>.
          </p>

          <h2>O que são cookies?</h2>
          <p>
            Cookies são pequenos ficheiros de texto guardados no teu dispositivo
            pelos sites que visitas. Permitem aos sites lembrar as tuas
            preferências, medir utilização e entregar funcionalidade.
          </p>

          <h2>Cookies que usamos</h2>

          <h3>Estritamente necessários (sempre activos)</h3>
          <p>
            Necessários para o site funcionar. Incluem gestão de sessão e
            segurança. Não exigem consentimento sob o GDPR.
          </p>

          <h3>Funcionais (com consentimento)</h3>
          <p>
            Lembram as tuas preferências (ex.: "já dispensei o banner de cookies").
            Guardados localmente no teu dispositivo, não transmitidos a terceiros.
          </p>

          <h3>Analytics (com consentimento)</h3>
          <p>
            Usamos Google Analytics 4 (GA4) e/ou Plausible para perceber padrões
            de tráfego. Apenas carregados depois de aceitares cookies de analytics.
            Endereços IP são anonimizados.
          </p>

          <h3>Marketing (com consentimento)</h3>
          <p>
            Actualmente não em uso. Se activarmos publicidade (ex. Google AdSense)
            no futuro, cookies de marketing exigirão consentimento explícito
            primeiro.
          </p>

          <h2>Como controlar cookies</h2>
          <p>
            Podes aceitar ou rejeitar cookies não-essenciais através do banner
            mostrado na tua primeira visita. Podes alterar a tua escolha a
            qualquer momento clicando em "Preferências de cookies" no rodapé (em
            breve) ou limpando cookies no teu browser.
          </p>
          <p>
            A maioria dos browsers também permite bloquear ou eliminar cookies
            através das suas definições. Nota que desactivar cookies estritamente
            necessários pode quebrar funcionalidade do site.
          </p>

          <h2>Cookies de terceiros</h2>
          <p>
            Provedores de analytics (Google, Plausible) podem definir os seus
            próprios cookies quando consentires. As suas políticas:
          </p>
          <ul>
            <li>
              <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                Política de Cookies da Google
              </a>
            </li>
            <li>
              <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">
                Política de Dados do Plausible
              </a>
              {" (sem cookies por defeito)"}
            </li>
          </ul>

          <h2>Actualizações</h2>
          <p>
            Actualizaremos esta política quando adicionarmos, removermos ou
            alterarmos o uso de cookies. A data de "Última actualização" reflecte
            a revisão mais recente.
          </p>

          <h2>Contacto</h2>
          <p>
            Questões:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Cookies">hi@zyperia.ai</a>
            {/* TODO: trocar por support@zyperia.ai quando mailbox for criada */}
          </p>
        </div>
      </div>
    </div>
  );
}
