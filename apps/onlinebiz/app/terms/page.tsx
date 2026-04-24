import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Serviço — ZYPERIA OnlineBiz",
  description: "Os termos e condições de uso do site.",
};

export default function TermsPage() {
  const lastUpdated = "24 de Abril de 2026";

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Legal</span>
        <h1 className="h-display text-4xl md:text-6xl mb-4">Termos de Serviço</h1>
        <div className="text-xs text-[var(--text-muted)] h-mono mb-12">
          Última actualização: {lastUpdated}
        </div>

        <div className="prose-zyperia">
          <p>
            Ao aceder ou usar este site, concordas com estes Termos. Se discordas
            de alguma parte, não uses o site.
          </p>

          <h2>1. Natureza do conteúdo</h2>
          <p>
            A ZYPERIA OnlineBiz publica casos de estudo e análises de negócios
            online para fins educativos. <strong>Os resultados mostrados não são
            típicos.</strong> Cada caso de estudo descreve um negócio num momento
            específico; a replicabilidade depende de competências, condições de
            mercado, sorte e variáveis que não controlamos. Começar um negócio
            online envolve risco financeiro, incluindo perda total de capital
            investido e tempo irrecuperável. Isto não é aconselhamento de negócio,
            jurídico ou fiscal. Consulta profissionais qualificados licenciados
            antes de decisões materiais.
          </p>

          <h2>2. Links de afiliado</h2>
          <p>
            Alguns links externos são links de afiliado. Podemos receber uma
            comissão quando te registas ou compras através destes links, sem
            custo adicional para ti. A nossa cobertura editorial não é influenciada
            por relações de afiliado. Detalhes completos na nossa{" "}
            <Link href="/disclosure">Divulgação de Afiliados</Link>.
          </p>

          <h2>3. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo original deste site (artigos, design, gráficos) é
            propriedade da ZYPERIA, salvo indicação em contrário. Podes partilhar
            excertos (até 200 palavras) com atribuição e link. Republicação de
            artigos completos exige autorização escrita.
          </p>

          <h2>4. Conduta do utilizador</h2>
          <p>Concordas em não:</p>
          <ul>
            <li>Fazer scraping, crawl ou cópia em massa do site sem autorização.</li>
            <li>Tentar obter acesso não autorizado aos nossos sistemas.</li>
            <li>Submeter comentários (se activados) abusivos, spam ou ilegais.</li>
            <li>Personificar a ZYPERIA ou partes afiliadas.</li>
          </ul>

          <h2>5. Exclusão de garantias</h2>
          <p>
            O site é fornecido "como está". Não garantimos que o conteúdo seja
            exacto, completo ou actual. Podemos actualizar, corrigir ou remover
            artigos a qualquer momento.
          </p>

          <h2>6. Limitação de responsabilidade</h2>
          <p>
            Na máxima extensão permitida por lei, a ZYPERIA não é responsável por
            quaisquer danos indirectos, incidentais ou consequentes resultantes do
            uso do site ou da confiança no seu conteúdo. Isto inclui perdas
            financeiras decorrentes de decisões de trading, investimento ou negócio.
          </p>

          <h2>7. Sites terceiros</h2>
          <p>
            Links para sites terceiros são fornecidos por conveniência. Não
            endossamos nem controlamos conteúdo de terceiros e não somos
            responsáveis pelas suas políticas ou práticas.
          </p>

          <h2>8. Lei aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis de Portugal. Disputas serão
            resolvidas nos tribunais competentes de Portugal, sem prejuízo de
            protecções imperativas do consumidor no teu país de residência.
          </p>

          <h2>9. Alterações</h2>
          <p>
            Podemos actualizar estes Termos. Alterações materiais serão anunciadas
            por newsletter e nesta página.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Questões sobre estes Termos:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Termos">hi@zyperia.ai</a>
            {/* TODO: trocar por support@zyperia.ai quando mailbox for criada */}
          </p>
        </div>
      </div>
    </div>
  );
}
