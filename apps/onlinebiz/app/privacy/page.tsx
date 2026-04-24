import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — ZYPERIA OnlineBiz",
  description: "Como tratamos os teus dados pessoais.",
};

export default function PrivacyPage() {
  const lastUpdated = "24 de Abril de 2026";

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Legal</span>
        <h1 className="h-display text-4xl md:text-6xl mb-4">Política de Privacidade</h1>
        <div className="text-xs text-[var(--text-muted)] h-mono mb-12">
          Última actualização: {lastUpdated}
        </div>

        <div className="prose-zyperia">
          <p>
            Esta Política de Privacidade explica como a ZYPERIA OnlineBiz ("nós")
            trata dados pessoais quando visitas o site ou subscreves A Análise de
            Sexta. Cumprimos o GDPR. Uma publicação anti-guru não tem negócio
            nenhum a construir perfis invasivos de dados — mantemos a recolha
            mínima por princípio.
          </p>

          <h2>1. Dados que recolhemos</h2>
          <p>Recolhemos dados mínimos, apenas o necessário para operar o site:</p>
          <ul>
            <li><strong>Email:</strong> quando subscreves a newsletter.</li>
            <li><strong>Dados de cookies:</strong> apenas se consentires (vê a nossa <Link href="/cookies">Política de Cookies</Link>).</li>
            <li><strong>Analytics de utilização:</strong> dados de tráfego anonimizados via Google Analytics e/ou Plausible (apenas com consentimento).</li>
          </ul>

          <h2>2. Como usamos os teus dados</h2>
          <ul>
            <li>Para enviar a newsletter que subscreveste.</li>
            <li>Para perceber que conteúdo ressoa (apenas analytics agregados).</li>
            <li>Para responder a mensagens que envies pelo formulário de contacto.</li>
          </ul>
          <p>
            <strong>Não</strong> vendemos os teus dados a terceiros. <strong>Não</strong> usamos
            os teus dados para perfis publicitários.
          </p>

          <h2>3. Base legal (GDPR Art. 6)</h2>
          <ul>
            <li><strong>Consentimento:</strong> para subscrição da newsletter e cookies não-essenciais.</li>
            <li><strong>Interesse legítimo:</strong> para analytics essenciais e segurança do site.</li>
          </ul>

          <h2>4. Processadores terceiros</h2>
          <p>Partilhamos dados apenas com processadores verificados estritamente necessários:</p>
          <ul>
            <li><strong>Supabase</strong> (base de dados, região UE — Irlanda)</li>
            <li><strong>Resend</strong> (email transaccional)</li>
            <li><strong>SendGrid</strong> (entrega de newsletter em massa)</li>
            <li><strong>Vercel</strong> (alojamento, entrega de conteúdo)</li>
            <li><strong>Google Analytics</strong> (apenas se consentires em cookies de analytics)</li>
          </ul>

          <h2>5. Retenção de dados</h2>
          <p>
            Subscritores da newsletter: dados mantidos até cancelares subscrição,
            mais 30 dias por razões operacionais. Dados de analytics: retidos por
            14 meses, anonimizados. Mensagens do formulário de contacto: eliminadas
            após 12 meses, excepto se uma conversa em curso exigir de outra forma.
          </p>

          <h2>6. Os teus direitos ao abrigo do GDPR</h2>
          <p>Tens direito a:</p>
          <ul>
            <li>Aceder aos dados que mantemos sobre ti.</li>
            <li>Pedir correcção de dados inexactos.</li>
            <li>Pedir eliminação dos teus dados ("direito ao esquecimento").</li>
            <li>Opor-te ao processamento ou pedir restrição.</li>
            <li>Pedir portabilidade de dados (exportação).</li>
            <li>Retirar o consentimento em qualquer momento.</li>
            <li>Apresentar queixa a uma autoridade de supervisão (ex. CNPD em Portugal).</li>
          </ul>
          <p>
            Para exercer qualquer destes direitos, escreve para{" "}
            <a href="mailto:hi@zyperia.ai?subject=Pedido%20GDPR">hi@zyperia.ai</a>
            {/* TODO: trocar por privacy@zyperia.ai quando mailbox for criada */}
            . Respondemos em 30 dias.
          </p>

          <h2>7. Segurança</h2>
          <p>
            Todos os dados são transmitidos por HTTPS. O acesso à base de dados é
            restringido por políticas Row Level Security (RLS). Não processamos
            cartões de crédito nem dados de pagamento.
          </p>

          <h2>8. Crianças</h2>
          <p>
            Este site não é dirigido a crianças com menos de 16 anos. Não
            recolhemos conscientemente dados de menores.
          </p>

          <h2>9. Alterações a esta política</h2>
          <p>
            Publicamos aqui quaisquer alterações e actualizamos a data de "Última
            actualização". Alterações materiais são notificadas pela newsletter.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Questões sobre privacidade:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Privacidade">hi@zyperia.ai</a>
            {/* TODO: trocar por privacy@zyperia.ai quando mailbox for criada */}
            <br />
            Contacto geral: vê <Link href="/contact">Contacto</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
