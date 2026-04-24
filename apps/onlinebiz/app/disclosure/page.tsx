import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Divulgação de Afiliados — ZYPERIA OnlineBiz",
  description: "Como uma publicação anti-guru é financiada. Recibos incluídos.",
};

export default function DisclosurePage() {
  const lastUpdated = "24 de Abril de 2026";

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Transparência</span>
        <h1 className="h-display text-4xl md:text-6xl mb-4">
          Como fazemos dinheiro.
        </h1>
        <div className="text-xs text-[var(--text-muted)] h-mono mb-12">
          Última actualização: {lastUpdated}
        </div>

        <div className="prose-zyperia">
          <p>
            Uma publicação sobre rendimento online tem de comer da sua própria
            comida nesta página. Então: aqui está como a ZYPERIA OnlineBiz paga
            as contas, em detalhe completo. Se algo não estiver claro,{" "}
            <a href="mailto:hi@zyperia.ai?subject=Transparencia">pergunta-nos</a>
            {/* TODO: trocar por editorial@zyperia.ai quando mailbox for criada */}
            .
          </p>

          <h2>Links de afiliado</h2>
          <p>
            Muitos links externos na ZYPERIA OnlineBiz são <strong>links de afiliado</strong>.
            Quando te registas ou compras através de um deles, ganhamos uma
            comissão. <strong>Não te custa nada extra.</strong> Na maioria dos
            casos, a oferta da plataforma é idêntica quer uses o nosso link quer
            não.
          </p>

          <h2>Com quem temos relações de afiliado</h2>
          <ul>
            <li><strong>Gumroad</strong> — marketplace de produtos digitais. Comissão sobre planos pagos.</li>
            <li><strong>Hotmart</strong> — plataforma de produtos digitais/cursos. Comissão sobre vendas.</li>
            <li><strong>SendOwl</strong> — entrega digital. Comissão sobre planos pagos.</li>
            <li><strong>Fiverr</strong> — marketplace de freelance. Comissão sobre registos de novos compradores.</li>
            <li><strong>Amazon Associates</strong> — comissões standard de referência de produto.</li>
          </ul>
          <p>
            Podemos adicionar plataformas que testamos activamente (processadores
            de pagamento, ferramentas de email, construtores de loja), mas apenas
            depois de as usarmos ou de as verificarmos através de fundadores que
            as usem. Alterações reflectidas aqui nos 7 dias.
          </p>

          <h2>O que "anti-guru" significa na prática</h2>
          <p>
            Muitas publicações sobre negócios online ganham o seu dinheiro real
            não dos afiliados mas do <em>seu próprio</em> curso de €997, do
            mastermind de €5k, da mentoria de €20k. A nossa não.
          </p>
          <p>Regras operacionais:</p>
          <ul>
            <li>Não existe curso da ZYPERIA OnlineBiz. Sem bootcamp. Sem programa de mentoria. Sem tier "done-with-you".</li>
            <li>Não aceitamos patrocínios de vendedores de cursos, por mais legítimos que sejam. O conflito de interesses destruiria o editorial.</li>
            <li>Quando um caso de estudo inclui o próprio curso de alguém como parte do modelo de negócio, cobrimos a economia honestamente — incluindo taxas de reembolso e problemas de decay do curso.</li>
            <li>Cada artigo com links de afiliado tem divulgação no topo.</li>
          </ul>

          <h2>O que não te vendemos</h2>
          <ul>
            <li><strong>Cursos.</strong> Não agora, não mais tarde, não rebatizados.</li>
            <li><strong>"Sistemas".</strong> Publicamos sistemas de graça, em artigos.</li>
            <li><strong>Masterminds.</strong> Já existem que chegue. Não vamos adicionar outro.</li>
            <li><strong>Colocações pagas de casos de estudo.</strong> Nenhum fundador pode comprar o seu lugar numa feature.</li>
          </ul>

          <h2>Newsletter e publicidade</h2>
          <p>
            A <em>Análise de Sexta</em> pode incluir uma secção patrocinada
            claramente identificada. Análises editoriais em si nunca são
            patrocinadas — se um negócio é apresentado, é porque o escolhemos,
            não porque alguém pagou. Podemos activar publicidade display no
            futuro; se sim, será marcada e não-intrusiva.
          </p>

          <h2>Se algo parecer errado</h2>
          <p>
            Se um caso de estudo parecer demasiado limpo, uma review positiva não
            combinar com a tua experiência, ou um modelo que chamámos "simples"
            se revelar qualquer coisa menos que isso — escreve-nos:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Transparencia">hi@zyperia.ai</a>
            {/* TODO: trocar por editorial@zyperia.ai quando mailbox for criada */}
            .
          </p>
          <p>
            Publicações que tomam posições anti-guru devem aos seus leitores mais
            escrutínio, não menos. Tentamos operar assim.
          </p>

          <p>
            Ver também: <Link href="/privacy">Política de Privacidade</Link> ·{" "}
            <Link href="/terms">Termos de Serviço</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
