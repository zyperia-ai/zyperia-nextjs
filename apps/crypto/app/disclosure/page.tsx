import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Divulgação de Afiliados — ZYPERIA Crypto",
  description: "Quem nos paga, como, e porque não decide o que cobrimos.",
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
            Os media de cripto ganharam um problema de reputação. Moedas shilladas,
            "reviews" pagas, operadores anónimos de pump-and-dump em folha de
            pagamento — não admira que os leitores assumam que cada publicação tem
            uma agenda escondida.
          </p>

          <p>Nós preferimos simplesmente mostrar a nossa.</p>

          <h2>Links de afiliado</h2>
          <p>
            Alguns links externos na ZYPERIA Crypto são <strong>links de afiliado</strong>.
            Quando te registas num serviço ou compras um produto através de um
            deles, podemos receber uma comissão. <strong>Não te custa nada extra</strong>{" "}
            — muitas vezes até vem com um bónus de registo melhor do que ir directamente.
          </p>

          <h2>Com quem temos relações de afiliado</h2>
          <ul>
            <li><strong>Kraken</strong> — exchange. Comissão sobre depósitos de novas contas.</li>
            <li><strong>Binance</strong> — exchange. Comissão sobre registo + taxas de trading.</li>
            <li><strong>Coinbase</strong> — exchange. Comissão sobre novas contas verificadas.</li>
            <li><strong>Ledger</strong> — carteira de hardware. Comissão sobre vendas de dispositivos.</li>
            <li><strong>Trezor</strong> — carteira de hardware. Comissão sobre vendas de dispositivos.</li>
          </ul>
          <p>
            Podemos adicionar outros parceiros ao longo do tempo (infraestrutura
            Lightning, ferramentas não-custodiais, software fiscal). Qualquer
            adição é reflectida aqui nos 7 dias após entrar em vigor.
          </p>

          <h2>Independência editorial — como funciona na prática</h2>
          <p>Estas regras não são aspirações, são procedimento operacional:</p>
          <ul>
            <li>Um parceiro de afiliado não pode comprar cobertura positiva. Ponto.</li>
            <li>Um parceiro de afiliado não pode suprimir cobertura negativa. Se achamos que as taxas são más ou a segurança é fraca, dizemo-lo.</li>
            <li>Cobrimos exchanges e hardware com as quais <em>não</em> estamos afiliados, sempre que mereçam cobertura (ou crítica).</li>
            <li>Cada artigo que contém links de afiliado tem uma divulgação explícita no topo.</li>
            <li>Revemos regularmente os nossos parceiros. Se o produto degrada, largamos o link de afiliado, não a crítica.</li>
          </ul>

          <h2>Pelo que não aceitamos dinheiro</h2>
          <ul>
            <li><strong>Listagens de tokens.</strong> Nenhum projecto pode pagar para ser coberto, mencionado ou ranqueado.</li>
            <li><strong>Cobertura de lançamento.</strong> ICOs, presales de tokens, airdrops — cobrimos se forem notícia, não porque alguém pagou.</li>
            <li><strong>"Pesquisa patrocinada".</strong> Pesquisa independente é o produto inteiro. Vendê-la destrói o objectivo.</li>
          </ul>

          <h2>Newsletter &amp; publicidade</h2>
          <p>
            A newsletter <em>O Resumo Matinal</em> pode ocasionalmente incluir uma
            secção patrocinada claramente identificada. Não influencia a parte
            editorial da newsletter. Podemos activar publicidade display (ex.
            Google AdSense) quando a publicação atingir um limiar de tráfego — se
            sim, anúncios serão marcados e não-intrusivos.
          </p>

          <h2>Se algo parecer errado</h2>
          <p>
            Se leres uma peça e algo cheirar a influência — um produto que
            elogiámos mas parece pior do que sugerimos, um link que não parece bem,
            uma crítica que conspicuamente evitámos — diz-nos directamente:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Transparencia">hi@zyperia.ai</a>
            {/* TODO: trocar por editorial@zyperia.ai quando mailbox for criada */}
            .
          </p>

          <p>Preferimos corrigir a fingir que não aconteceu.</p>

          <p>
            Ver também: <Link href="/privacy">Política de Privacidade</Link> ·{" "}
            <Link href="/terms">Termos de Serviço</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
