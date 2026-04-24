import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre — ZYPERIA OnlineBiz",
  description: "Cobertura de rendimento online sem os gurus. Recibos ou não aconteceu.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Sobre</span>
        <h1 className="h-display text-4xl md:text-6xl mb-8">
          Sem gurus. Sem funis. <span className="text-brand-gradient">Só os números.</span>
        </h1>

        <div className="prose-zyperia">
          <p>
            A ZYPERIA OnlineBiz cobre rendimento online da maneira que devia ser
            coberto: com screenshots, facturas, e fundadores dispostos a nomear as
            partes feias. Existimos porque todas as outras publicações sobre
            negócios online parecem estar a vender o mesmo curso de €997.
          </p>

          <h2>O que cobrimos</h2>
          <p>
            Marketing de afiliados, produtos digitais, micro-SaaS, conteúdo-como-
            negócio, serviços produtizados, e-commerce. A gama completa de
            maneiras de uma pessoa ganhar dinheiro online sem chefe — e a versão
            honesta do que cada uma exige.
          </p>

          <p>
            Para cada modelo de negócio e cada caso de estudo, publicamos os
            números que interessam: receita bruta, margens, tempo investido,
            competências necessárias, ferramentas, taxas de reembolso, carga
            fiscal. A parte que os thread-bros convenientemente deixam de fora.
          </p>

          <h2>O que recusamos fazer</h2>
          <ul>
            <li><strong>Posts anónimos tipo "fiz 10k no último mês".</strong> Se não vemos o dashboard ou as facturas, não publicamos.</li>
            <li><strong>Teatro de rendimento passivo.</strong> Não existe set-and-forget. Dizemos o que cada modelo custa em horas.</li>
            <li><strong>Negócios dependentes de funil chamados "simples".</strong> Se um modelo só funciona com VSL e upsells, dizemo-lo.</li>
            <li><strong>Pitches de cursos.</strong> Não te vendemos nada além de uma newsletter. Sem bootcamp, sem mentoria, sem "sistema".</li>
          </ul>

          <h2>Padrão editorial</h2>
          <p>
            Cada caso de estudo passa pelo mesmo filtro: números verificados
            (screenshots, P&amp;L, ou entrevistas com fundadores que conduzimos),
            imagem de custos completa (bruto ≠ líquido), tempo e esforço honestos,
            e uma descrição em português claro sobre para quem este modelo
            funciona — e para quem não funciona.
          </p>

          <p>
            <strong>Os resultados mostrados não são típicos.</strong> É a parte que
            a maioria dos conteúdos sobre negócios online não quer que leias.
          </p>

          <h2>Como somos financiados</h2>
          <p>
            Parcerias de afiliados com plataformas que recomendaríamos sem a
            comissão (Gumroad, Hotmart, SendOwl, Fiverr, Amazon Associates) e
            patrocínios da newsletter. Não aceitamos parcerias com pitches de
            cursos. Detalhe completo: <Link href="/disclosure">como fazemos dinheiro</Link>.
          </p>

          <h2>A rede ZYPERIA</h2>
          <p>
            A ZYPERIA OnlineBiz é uma das três publicações, ao lado da{" "}
            <a href="https://crypto.zyperia.ai">ZYPERIA Crypto</a> (análise de
            activos digitais) e da <a href="https://intelligence.zyperia.ai">ZYPERIA Intelligence</a> (IA
            para operadores). O mesmo padrão nas três: nada se publica sem
            evidência para o suportar.
          </p>

          <p>
            <Link href="/#newsletter">A Análise de Sexta chega todas as semanas →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
