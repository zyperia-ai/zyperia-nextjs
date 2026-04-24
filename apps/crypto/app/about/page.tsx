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
          Lemos os whitepapers <span className="text-brand-gradient">para não teres de os ler.</span>
        </h1>

        <div className="prose-zyperia">
          <p>
            A ZYPERIA Crypto é uma publicação independente de análise sobre a
            economia dos activos digitais — Bitcoin, Ethereum, DeFi, L2s,
            infraestrutura, e a maquinaria regulatória à volta de tudo isto.
          </p>

          <p>
            Foi construída para um tipo específico de leitor: alguém que já anda
            na cripto há tempo suficiente para estar farto do ciclo de hype, das
            threads de shill, e das newsletters "desta vez é diferente". Alguém
            que prefere ler uma análise afiada a dez opiniões.
          </p>

          <h2>O que publicamos</h2>
          <p>
            Análise diária, curta o suficiente para acabar enquanto bebes o café,
            profunda o suficiente para mudar a forma como pensas sobre um tema.
            Cada afirmação é verificada contra dados on-chain, documentação de
            protocolo, ou fontes primárias. Se não conseguimos confirmar, não
            publicamos.
          </p>

          <h2>O que não publicamos</h2>
          <ul>
            <li><strong>Previsões de preço.</strong> Gráficos conseguem mentir em 20 línguas. Nós cobrimos fundamentos.</li>
            <li><strong>Aconselhamento financeiro.</strong> Nada aqui é recomendação para comprar, vender ou manter seja o que for.</li>
            <li><strong>Cobertura paga.</strong> Nenhum projecto, fundação ou exchange pode comprar espaço editorial.</li>
            <li><strong>Isco de afiliados.</strong> Temos parcerias de afiliados (vê <Link href="/disclosure">como somos financiados</Link>) mas não decidem o que cobrimos.</li>
          </ul>

          <h2>Quem está por trás disto</h2>
          <p>
            A ZYPERIA Crypto é gerida por uma equipa pequena liderada por um
            operador com 12+ anos de exposição à cripto — desde as rondas iniciais
            de Bitcoin, passando pelas ICOs, o DeFi summer, o ciclo dos NFTs, até
            ao que for que este capítulo actual se revele ser. Vimos o mesmo
            playbook repetir-se vezes suficientes para o cheirar à distância.
          </p>

          <p>
            Essa experiência molda o que cobrimos e, mais importante, o que
            ignoramos.
          </p>

          <h2>Como somos financiados</h2>
          <p>
            Parcerias de afiliados com infraestrutura que já usaríamos (exchanges,
            carteiras de hardware, ferramentas seleccionadas), patrocínios da
            newsletter, e eventualmente publicidade display. Imagem completa na
            nossa <Link href="/disclosure">página de divulgação</Link>.
          </p>

          <h2>A rede ZYPERIA</h2>
          <p>
            A ZYPERIA Crypto é uma das três publicações da operação ZYPERIA, ao
            lado da <a href="https://intelligence.zyperia.ai">ZYPERIA Intelligence</a> (IA
            e automação para operadores) e da <a href="https://onlinebiz.zyperia.ai">ZYPERIA OnlineBiz</a> (rendimento
            online, sem gurus). Cada uma é independente editorialmente; o que
            partilham é um padrão: não publicar o que não se consegue verificar.
          </p>

          <p>
            Queres o Resumo Matinal? <Link href="/#newsletter">Subscreve grátis →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
