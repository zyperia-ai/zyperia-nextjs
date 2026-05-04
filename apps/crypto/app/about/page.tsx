import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre — ZYPERIA Crypto",
  description: "Porquê mais uma publicação sobre cripto? Porque a maioria não faz o trabalho.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Sobre</span>
        <h1 className="h-display text-4xl md:text-6xl mb-8">
          Informação cripto honesta. Para quem quer entender, não especular.
        </h1>

        <div className="prose-zyperia">
          <p>
            A ZYPERIA Crypto é uma publicação editorial independente sobre o universo dos activos digitais. Cobrimos Bitcoin, Ethereum, DeFi, regulação e infraestrutura — com análise baseada em factos, sem predições de preço e sem promoção de projectos.
          </p>

          <p>
            Existe para um leitor específico: alguém que quer perceber o que está realmente a acontecer no mercado cripto, tomar melhores decisões, e não ser enganado por hype ou por projectos com agenda comercial.
          </p>

          <h2>O que publicamos</h2>
          <p>
            Análise de mercado, guias práticos, contexto regulatório e explicações claras sobre protocolos e infraestrutura. Cada afirmação é verificada contra dados on-chain, documentação oficial ou fontes primárias. Se não conseguimos confirmar, não publicamos.
          </p>

          <h2>O que não publicamos</h2>
          <ul>
            <li><strong>Predições de preço.</strong> Não fazemos previsões de onde vai o Bitcoin ou qualquer outro activo.</li>
            <li><strong>Promoção de projectos.</strong> Nenhum projecto, token ou exchange compra cobertura editorial aqui.</li>
            <li><strong>Aconselhamento financeiro.</strong> Nada aqui é recomendação para comprar, vender ou manter seja o que for.</li>
            <li><strong>Publicidade editorial.</strong> Temos parcerias de afiliados (vê <Link href="/disclosure">como somos financiados</Link>) mas não determinam o que cobrimos.</li>
          </ul>

          <h2>Como somos financiados</h2>
          <p>
            Parcerias de afiliados com ferramentas e plataformas seleccionadas, patrocínios da newsletter, e eventualmente publicidade display. Imagem completa na nossa <Link href="/disclosure">página de divulgação</Link>.
          </p>

          <h2>A rede ZYPERIA</h2>
          <p>
            A ZYPERIA Crypto é uma das publicações da rede ZYPERIA, ao lado da <a href="https://intelligence.zyperia.ai">ZYPERIA Intelligence</a> (IA e automação) e da <a href="https://onlinebiz.zyperia.ai">ZYPERIA OnlineBiz</a> (negócio online). Cada publicação é independente editorialmente.
          </p>

          <p>
            Queres receber os nossos artigos? <Link href="/#newsletter">Subscreve gratuitamente →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
